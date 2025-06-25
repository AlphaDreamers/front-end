"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, AlertCircle, CheckCircle, FileText } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const cv: any;

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
  const [hasAutoCaptured, setHasAutoCaptured] = useState(false);

  useEffect(() => {
    // Load OpenCV.js
    const loadOpenCV = () => {
      const script = document.createElement("script");
      script.src = "https://docs.opencv.org/4.5.1/opencv.js";
      script.async = true;
      script.onload = () => {
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
  }, [stream]);

  const detectDocument = (imageData: ImageData) => {
    if (typeof cv === "undefined") return null;

    try {
      const src = cv.matFromImageData(imageData);
      const gray = new cv.Mat();
      const blurred = new cv.Mat();
      const edges = new cv.Mat();
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();

      // Convert to grayscale
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      // Apply bilateral filter for better edge preservation
      cv.bilateralFilter(gray, blurred, 9, 75, 75);

      // Use adaptive thresholding for better results in varying lighting
      const thresh = new cv.Mat();
      cv.adaptiveThreshold(
        blurred,
        thresh,
        255,
        cv.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv.THRESH_BINARY,
        11,
        2
      );

      // Use Canny with auto-calculated thresholds
      const median = cv.mean(blurred)[0];
      const lower = Math.max(0, (1.0 - 0.33) * median);
      const upper = Math.min(255, (1.0 + 0.33) * median);
      cv.Canny(blurred, edges, lower, upper);

      // Apply morphological operations to connect broken edges
      const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));
      cv.morphologyEx(edges, edges, cv.MORPH_CLOSE, kernel);
      cv.dilate(edges, edges, kernel);

      // Find contours
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

      // Much more lenient minimum area - just 5% of image
      const minArea = imageData.width * imageData.height * 0.05;

      // Find the largest rectangular contour
      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const area = cv.contourArea(contour);

        if (area < minArea) continue;

        // Get bounding rectangle
        const rect = cv.boundingRect(contour);

        // Very simple scoring - just based on area
        // Larger is better, no complex requirements
        const score = area / (imageData.width * imageData.height);

        if (score > bestScore) {
          bestScore = score;
          bestRect = rect;
          if (bestContour) bestContour.delete();
          bestContour = contour.clone();
        }
      }

      // Clean up
      src.delete();
      gray.delete();
      blurred.delete();
      edges.delete();
      thresh.delete();
      contours.delete();
      hierarchy.delete();
      kernel.delete();

      return bestContour
        ? { contour: bestContour, rect: bestRect, score: bestScore }
        : null;
    } catch (error) {
      console.error("Document detection error:", error);
      return null;
    }
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    // Draw current frame
    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob and create file
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "document-capture.jpg", {
            type: "image/jpeg",
          });
          onCapture(file);
          setStatus("success");

          // Stop the camera
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            video.srcObject = null;
            setStream(null);
          }
        }
      },
      "image/jpeg",
      0.95
    );
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

          // Calculate confidence based on size
          const sizeRatio = (width * height) / (canvas.width * canvas.height);
          const confidence = Math.min(100, Math.round(sizeRatio * 200));

          // Color based on confidence
          const green = Math.round(confidence * 2.55);
          const red = Math.round((100 - confidence) * 2.55);
          context.strokeStyle = `rgba(${red}, ${green}, 0, 0.8)`;
          context.lineWidth = 4;
          context.strokeRect(x, y, width, height);

          // Draw corner markers
          const cornerSize = 20;
          context.lineWidth = 6;

          // Top-left
          context.beginPath();
          context.moveTo(x, y + cornerSize);
          context.lineTo(x, y);
          context.lineTo(x + cornerSize, y);
          context.stroke();

          // Top-right
          context.beginPath();
          context.moveTo(x + width - cornerSize, y);
          context.lineTo(x + width, y);
          context.lineTo(x + width, y + cornerSize);
          context.stroke();

          // Bottom-left
          context.beginPath();
          context.moveTo(x, y + height - cornerSize);
          context.lineTo(x, y + height);
          context.lineTo(x + cornerSize, y + height);
          context.stroke();

          // Bottom-right
          context.beginPath();
          context.moveTo(x + width - cornerSize, y + height);
          context.lineTo(x + width, y + height);
          context.lineTo(x + width, y + height - cornerSize);
          context.stroke();

          // Auto-capture at 50% confidence
          if (confidence >= 50 && !hasAutoCaptured) {
            setHasAutoCaptured(true);
            clearInterval(interval);

            // Add capture effect
            context.fillStyle = "rgba(0, 255, 0, 0.3)";
            context.fillRect(x, y, width, height);

            // Capture after a brief moment
            setTimeout(() => {
              captureImage();
            }, 300);
          }

          if (detection.contour) {
            detection.contour.delete();
          }
        } else {
          // Draw guide overlay when no document detected
          context.strokeStyle = "rgba(255, 255, 255, 0.3)";
          context.lineWidth = 2;
          context.setLineDash([10, 10]);
          const guideWidth = canvas.width * 0.8;
          const guideHeight = canvas.height * 0.6;
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

      // Store interval ID for cleanup
      return () => clearInterval(interval);
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
    setHasAutoCaptured(false);
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
          className={clsx(
            "absolute inset-0 w-full h-full object-cover",
            status !== "scanning" && "hidden"
          )}
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
