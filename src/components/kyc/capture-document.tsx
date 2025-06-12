"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, AlertCircle, CheckCircle, FileText } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

type Status = "idle" | "loading" | "scanning" | "success" | "error";

interface CaptureDocumentProps {
  onCapture: (file: File) => void;
  className?: string;
}

export function CaptureDocument({
  onCapture,
  className,
}: CaptureDocumentProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isOpenCVReady, setIsOpenCVReady] = useState(false);

  useEffect(() => {
    // Load OpenCV.js
    const loadOpenCV = () => {
      const script = document.createElement("script");
      script.src = "https://docs.opencv.org/4.5.1/opencv.js";
      script.async = true;
      script.onload = () => {
        // @ts-ignore
        cv.onRuntimeInitialized = () => {
          setIsOpenCVReady(true);
          setStatus("idle");
        };
      };
      script.onerror = () => {
        console.error("Failed to load OpenCV.js");
        setStatus("error");
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    setStatus("loading");
    loadOpenCV();

    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);
  const detectDocument = (imageData: ImageData) => {
    // @ts-ignore
    if (typeof cv === "undefined") return null;

    try {
      // @ts-ignore
      const src = cv.matFromImageData(imageData);
      // @ts-ignore
      const gray = new cv.Mat();
      // @ts-ignore
      const blurred = new cv.Mat();
      // @ts-ignore
      const edges = new cv.Mat();
      // @ts-ignore
      const contours = new cv.MatVector();
      // @ts-ignore
      const hierarchy = new cv.Mat();

      // Convert to grayscale
      // @ts-ignore
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      // Apply Gaussian blur to reduce noise
      // @ts-ignore
      cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

      // Use more lenient Canny edge detection parameters
      // @ts-ignore
      cv.Canny(blurred, edges, 30, 100); // Reduced thresholds for easier detection

      // Apply morphological operations to connect broken edges
      // @ts-ignore
      const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));
      // @ts-ignore
      cv.morphologyEx(edges, edges, cv.MORPH_CLOSE, kernel);

      // Find contours
      // @ts-ignore
      cv.findContours(
        edges,
        contours,
        hierarchy,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
      );

      let bestContour = null;
      let bestRect = null;
      let bestScore = 0;

      // Find the best document-like contour with more flexible criteria
      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        // @ts-ignore
        const area = cv.contourArea(contour);

        // More lenient area threshold (5% instead of 10%)
        const minArea = imageData.width * imageData.height * 0.05;
        if (area < minArea) continue;

        // Try multiple approximation tolerances for better shape detection
        const tolerances = [0.01, 0.02, 0.03, 0.05];

        for (const tolerance of tolerances) {
          // @ts-ignore
          const approx = new cv.Mat();
          // @ts-ignore
          cv.approxPolyDP(
            contour,
            approx,
            tolerance * cv.arcLength(contour, true),
            true
          );

          // Accept 4-8 sided polygons (more flexible than just rectangles)
          if (approx.rows >= 4 && approx.rows <= 8) {
            // @ts-ignore
            const rect = cv.boundingRect(contour);

            // Calculate aspect ratio score (prefer rectangular shapes)
            const aspectRatio =
              Math.max(rect.width, rect.height) /
              Math.min(rect.width, rect.height);
            const aspectScore = aspectRatio < 3 ? 1 : 1 / (aspectRatio - 2); // Penalize extreme ratios

            // Calculate area ratio score (how much of bounding rect is filled)
            const rectArea = rect.width * rect.height;
            const fillRatio = area / rectArea;
            const fillScore = fillRatio > 0.5 ? 1 : fillRatio * 2; // Prefer well-filled shapes

            // Calculate convexity score
            // @ts-ignore
            const hull = new cv.Mat();
            // @ts-ignore
            cv.convexHull(contour, hull);
            // @ts-ignore
            const hullArea = cv.contourArea(hull);
            const convexityScore = area / hullArea;
            hull.delete();

            // Combined score favoring larger, more rectangular, well-filled, convex shapes
            const score =
              ((area / (imageData.width * imageData.height)) *
                aspectScore *
                fillScore *
                convexityScore *
                (6 - approx.rows)) /
              2; // Slight preference for fewer vertices

            if (score > bestScore) {
              bestScore = score;
              if (bestContour) bestContour.delete();
              bestContour = approx.clone();
              bestRect = rect;
            }
          }

          approx.delete();
        }
      }

      // If no good contour found with strict criteria, try fallback with largest contour
      if (!bestContour && contours.size() > 0) {
        let largestArea = 0;
        let largestIndex = -1;

        for (let i = 0; i < contours.size(); i++) {
          const contour = contours.get(i);
          // @ts-ignore
          const area = cv.contourArea(contour);
          if (area > largestArea) {
            largestArea = area;
            largestIndex = i;
          }
        }

        if (
          largestIndex >= 0 &&
          largestArea > imageData.width * imageData.height * 0.02
        ) {
          const contour = contours.get(largestIndex);
          // @ts-ignore
          const approx = new cv.Mat();
          // @ts-ignore
          cv.approxPolyDP(
            contour,
            approx,
            0.05 * cv.arcLength(contour, true), // Very lenient approximation
            true
          );
          bestContour = approx;
          // @ts-ignore
          bestRect = cv.boundingRect(contour);
        }
      }

      // Clean up
      src.delete();
      gray.delete();
      blurred.delete();
      edges.delete();
      contours.delete();
      hierarchy.delete();
      kernel.delete();

      return bestContour ? { contour: bestContour, rect: bestRect } : null;
    } catch (error) {
      console.error("Document detection error:", error);
      return null;
    }
  };
  const startCapture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !isOpenCVReady) return;

    try {
      setStatus("loading");

      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      video.srcObject = mediaStream;
      setStream(mediaStream);
      await video.play();

      setStatus("scanning");

      // Set up canvas dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Start document detection loop
      const interval = setInterval(() => {
        const context = canvas.getContext("2d");
        if (!context) return;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get image data for processing
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const detection = detectDocument(imageData);

        // Clear and redraw
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (detection && detection.rect) {
          // Draw detected document outline
          const { x, y, width, height } = detection.rect;
          context.strokeStyle = "rgba(0, 255, 192, 0.8)";
          context.lineWidth = 3;
          context.strokeRect(x, y, width, height);

          // Check if document is well-positioned
          const isLargeEnough =
            width > canvas.width * 0.5 && height > canvas.height * 0.4;
          const isCentered =
            Math.abs(x + width / 2 - canvas.width / 2) < canvas.width * 0.1 &&
            Math.abs(y + height / 2 - canvas.height / 2) < canvas.height * 0.1;

          if (isLargeEnough && isCentered) {
            clearInterval(interval);

            // Add a capture indicator
            context.fillStyle = "rgba(0, 255, 192, 0.2)";
            context.fillRect(x, y, width, height);

            // Capture the image
            setTimeout(() => {
              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    const file = new File([blob], "document-capture.jpg", {
                      type: "image/jpeg",
                    });
                    onCapture(file);
                    setStatus("success");
                  }
                },
                "image/jpeg",
                0.95
              );

              // Stop the camera
              mediaStream.getTracks().forEach((track) => track.stop());
              video.srcObject = null;
              setStream(null);
            }, 500);
          }

          if (detection.contour) {
            detection.contour.delete();
          }
        } else {
          // Draw guide overlay when no document detected
          context.strokeStyle = "rgba(255, 255, 255, 0.3)";
          context.lineWidth = 2;
          context.setLineDash([10, 10]);
          const guideWidth = canvas.width * 0.7;
          const guideHeight = canvas.height * 0.5;
          const guideX = (canvas.width - guideWidth) / 2;
          const guideY = (canvas.height - guideHeight) / 2;
          context.strokeRect(guideX, guideY, guideWidth, guideHeight);
          context.setLineDash([]);

          // Add text instruction
          context.fillStyle = "rgba(255, 255, 255, 0.8)";
          context.font = "16px sans-serif";
          context.textAlign = "center";
          context.fillText(
            "Position document within the frame",
            canvas.width / 2,
            guideY - 10
          );
        }
      }, 100);
    } catch (error) {
      console.error("Camera access error:", error);
      setStatus("error");
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
  };

  const reset = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setStatus("idle");
    const video = videoRef.current;
    if (video) {
      video.srcObject = null;
    }
  };

  return (
    <div className={className}>
      <div className="relative h-64 w-full bg-secondary rounded-lg overflow-hidden">
        {status === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText size={48} className="text-muted-foreground" />
          </div>
        )}
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 size={48} className="animate-spin text-muted-foreground" />
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/10">
            <div className="text-center">
              <AlertCircle
                size={48}
                className="text-destructive mx-auto mb-2"
              />
              <p className="text-sm text-destructive">Camera access failed</p>
            </div>
          </div>
        )}
        {status === "success" && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
            <div className="text-center">
              <CheckCircle size={48} className="text-primary mx-auto mb-2" />
              <p className="text-sm text-primary">
                Document captured successfully
              </p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          playsInline
          muted
          className={clsx("absolute inset-0 w-full h-full object-cover hidden")}
        />

        <canvas
          ref={canvasRef}
          className={clsx(
            "absolute inset-0 w-full h-full",
            status !== "scanning" && status !== "success" && "hidden"
          )}
        />
      </div>

      <Button
        variant={status === "error" ? "destructive" : "outline"}
        className="w-full mt-2"
        onClick={
          status === "success" || status === "scanning" ? reset : startCapture
        }
        disabled={status === "loading" || !isOpenCVReady}
      >
        {status === "idle" && "Start Document Capture"}
        {status === "loading" && "Loading..."}
        {status === "scanning" && "Cancel"}
        {status === "success" && "Capture Another"}
        {status === "error" && "Retry"}
      </Button>
    </div>
  );
}
