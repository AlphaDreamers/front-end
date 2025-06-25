"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import * as faceapi from "face-api.js";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

type Status = "idle" | "loading" | "scanning" | "success" | "error";

interface CaptureFaceProps {
  onCapture: (file: File) => void;
  className?: string;
}

export function CaptureFace({ onCapture, className }: CaptureFaceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setStatus("loading");
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        ]);
        setStatus("idle");
      } catch (error) {
        console.error("Failed to load face detection models:", error);
        setStatus("error");
      }
    };

    loadModels();

    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCapture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    try {
      setStatus("loading");

      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      video.srcObject = mediaStream;
      setStream(mediaStream);
      await video.play();

      setStatus("scanning");

      // Set up canvas dimensions
      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };
      faceapi.matchDimensions(canvas, displaySize);

      // Start face detection loop
      const interval = setInterval(async () => {
        const detections = await faceapi.detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions()
        );

        const context = canvas.getContext("2d");
        if (!context) return;

        // Clear previous drawings
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (detections) {
          // Draw face outline
          const { x, y, width, height } = detections.box;
          context.strokeStyle = "rgba(0, 255, 192, 0.8)";
          context.lineWidth = 3;
          context.strokeRect(x, y, width, height);

          // Check if face is centered and large enough
          const centerX = x + width / 2;
          const centerY = y + height / 2;
          const videoCenterX = video.videoWidth / 2;
          const videoCenterY = video.videoHeight / 2;
          const iscentered =
            Math.abs(centerX - videoCenterX) < video.videoWidth * 0.1 &&
            Math.abs(centerY - videoCenterY) < video.videoHeight * 0.1;
          const isLargeEnough = width > video.videoWidth * 0.3;

          if (iscentered && isLargeEnough) {
            clearInterval(interval);

            // Capture the image
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0);

            // Convert canvas to blob
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const file = new File([blob], "face-capture.jpg", {
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
          }
        } else {
          // Draw guide overlay when no face detected
          context.strokeStyle = "rgba(255, 255, 255, 0.3)";
          context.lineWidth = 2;
          context.setLineDash([10, 10]);
          const guideWidth = video.videoWidth * 0.4;
          const guideHeight = video.videoHeight * 0.5;
          const guideX = (video.videoWidth - guideWidth) / 2;
          const guideY = (video.videoHeight - guideHeight) / 2;
          context.strokeRect(guideX, guideY, guideWidth, guideHeight);
          context.setLineDash([]);
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
            <Camera size={48} className="text-muted-foreground" />
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
              <p className="text-sm text-primary">Face captured successfully</p>
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
            status !== "scanning" && "hidden"
          )}
        />
      </div>

      <Button
        variant={status === "error" ? "destructive" : "outline"}
        className="w-full mt-2"
        onClick={
          status === "success" || status === "scanning" ? reset : startCapture
        }
        disabled={status === "loading"}
      >
        {status === "idle" && "Start Face Capture"}
        {status === "loading" && "Loading..."}
        {status === "scanning" && "Cancel"}
        {status === "success" && "Capture Another"}
        {status === "error" && "Retry"}
      </Button>
    </div>
  );
}
