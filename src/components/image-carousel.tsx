"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Pause,
  Volume2,
} from "lucide-react";
import { MediaType } from "@prisma/client";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";

interface MediaItem {
  id: string;
  url: string;
  type: MediaType;
}

interface MediaCarouselProps {
  media: MediaItem[];
  alt: string;
}

const CAROUSEL_OPTIONS: EmblaOptionsType = {
  loop: false,
  align: "start",
};

const THUMB_OPTIONS: EmblaOptionsType = {
  containScroll: "keepSnaps",
  dragFree: true,
};

function MediaCarousel({ media, alt }: MediaCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(CAROUSEL_OPTIONS);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel(THUMB_OPTIONS);

  // Only include images and videos for display
  const displayableMedia = media
    .filter((item) => item.type === "IMAGE" || item.type === "VIDEO")
    .slice(0, 10); // Limit to 10 items as per requirement

  // Handle thumbnail selection
  const handleSelect = useCallback(
    (index: number) => {
      emblaMainApi?.scrollTo(index);
      emblaThumbsApi?.scrollTo(index);
      setSelectedIndex(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  // Update selected index when main carousel scrolls
  const handleScroll = useCallback(() => {
    if (!emblaMainApi) return;
    const index = emblaMainApi.selectedScrollSnap();
    setSelectedIndex(index);
    emblaThumbsApi?.scrollTo(index);
  }, [emblaMainApi, emblaThumbsApi]);

  useEffect(() => {
    if (!emblaMainApi) return;
    emblaMainApi.on("select", handleScroll);
    return () => {
      emblaMainApi.off("select", handleScroll);
    };
  }, [emblaMainApi, handleScroll]);

  // Modal navigation handlers
  const handlePrevious = useCallback(() => {
    const newIndex =
      selectedIndex > 0 ? selectedIndex - 1 : displayableMedia.length - 1;
    setSelectedIndex(newIndex);
  }, [selectedIndex, displayableMedia.length]);

  const handleNext = useCallback(() => {
    const newIndex =
      selectedIndex < displayableMedia.length - 1 ? selectedIndex + 1 : 0;
    setSelectedIndex(newIndex);
  }, [selectedIndex, displayableMedia.length]);

  // Open modal for images only
  const handleMediaClick = (index: number) => {
    if (displayableMedia[index].type === "IMAGE") {
      setSelectedIndex(index);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {/* Main Carousel */}
      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg" ref={emblaMainRef}>
          <div className="flex">
            {displayableMedia.map((item, index) => (
              <div key={item.id} className="relative flex-[0_0_100%] min-w-0">
                {item.type === "IMAGE" ? (
                  <div
                    className="relative h-[400px] cursor-pointer group"
                    onClick={() => handleMediaClick(index)}
                  >
                    <Image
                      src={item.url}
                      fill
                      alt={`${alt} - Image ${index + 1}`}
                      className="object-contain bg-gray-100"
                      sizes="(max-width: 768px) 100vw, 66vw"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="rounded-full"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : item.type === "VIDEO" ? (
                  <VideoPlayer
                    url={item.url}
                    alt={`${alt} - Video ${index + 1}`}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* Thumbnail Navigation */}
        {displayableMedia.length > 1 && (
          <div className="overflow-hidden px-2" ref={emblaThumbsRef}>
            <div className="flex gap-2">
              {displayableMedia.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(index)}
                  className={cn(
                    "relative flex-[0_0_100px] h-20 rounded-md overflow-hidden transition-all",
                    "ring-2 ring-offset-2",
                    selectedIndex === index
                      ? "ring-primary"
                      : "ring-transparent hover:ring-gray-300"
                  )}
                >
                  {item.type === "IMAGE" ? (
                    <Image
                      src={item.url}
                      fill
                      alt={`${alt} thumbnail ${index + 1}`}
                      className="object-cover"
                      sizes="100px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Modal for Images */}
      {isModalOpen && displayableMedia[selectedIndex]?.type === "IMAGE" && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Close button - consistent position */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(false);
            }}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation arrows */}
          {displayableMedia.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 text-white hover:bg-white/10 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 text-white hover:bg-white/10 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Image display */}
          <div
            className="relative w-full h-full max-w-7xl max-h-[90vh] mx-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={displayableMedia[selectedIndex].url}
              fill
              alt={`${alt} - Full size image ${selectedIndex + 1}`}
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 90vw"
              priority
            />
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
            {selectedIndex + 1} /{" "}
            {displayableMedia.filter((m) => m.type === "IMAGE").length}
          </div>
        </div>
      )}
    </>
  );
}

// Separate Video Player Component
function VideoPlayer({ url }: { url: string; alt: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  return (
    <div
      className="relative h-[400px] bg-black group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-contain"
        controls={false}
        playsInline
      >
        <source src={url} />
        Your browser does not support the video tag.
      </video>

      {/* Custom Controls Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="bg-black/50 rounded-full p-4 hover:bg-black/70 transition-colors">
            {isPlaying ? (
              <Pause className="h-8 w-8 text-white" />
            ) : (
              <Play className="h-8 w-8 text-white" />
            )}
          </div>
        </button>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-4">
          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-white" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaCarousel;
