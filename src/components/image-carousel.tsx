"use client";

import {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType,
} from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";

const TWEEN_FACTOR_BASE = 0.2;
const OPTIONS: EmblaOptionsType = {};
const THUMB_OPTIONS: EmblaOptionsType = {
  containScroll: "keepSnaps",
  dragFree: true,
};

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(OPTIONS);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel(THUMB_OPTIONS);

  const handleSelect = useCallback(
    (index: number) => {
      emblaMainApi?.scrollTo(index);
      emblaThumbsApi?.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const handleUpdateSelectedIndex = useCallback(() => {
    const index = emblaMainApi?.selectedScrollSnap() ?? 0;
    setSelectedIndex(index);
    emblaThumbsApi?.scrollTo(index);
  }, [emblaMainApi, emblaThumbsApi]);

  useEffect(() => {
    if (!emblaMainApi) return;
    handleUpdateSelectedIndex();
    emblaMainApi
      .on("select", handleUpdateSelectedIndex)
      .on("reInit", handleUpdateSelectedIndex);

    return () => {
      emblaMainApi
        .off("select", handleUpdateSelectedIndex)
        .off("reInit", handleUpdateSelectedIndex);
    };
  }, [emblaMainApi, handleUpdateSelectedIndex]);

  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const setTweenNodes = useCallback((api: EmblaCarouselType) => {
    tweenNodes.current = api
      .slideNodes()
      .map((slide) => slide.querySelector(".embla__parallax__layer"))
      .filter(Boolean) as HTMLElement[];
  }, []);

  const setTweenFactor = useCallback((api: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length;
  }, []);

  const tweenParallax = useCallback(
    (api: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = api.internalEngine();
      const scrollProgress = api.scrollProgress();
      const slidesInView = api.slidesInView();
      const isScrollEvent = eventName === "scroll";

      api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        const slidesInSnap = engine.slideRegistry[snapIndex];
        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          let diffToTarget = scrollSnap - scrollProgress;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              if (loopItem.index === slideIndex && loopItem.target() !== 0) {
                const sign = Math.sign(loopItem.target());
                if (sign === -1)
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                if (sign === 1)
                  diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            });
          }

          const translate = diffToTarget * (-1 * tweenFactor.current) * 100;
          const tweenNode = tweenNodes.current[slideIndex];
          if (tweenNode)
            tweenNode.style.transform = `translateX(${translate}%)`;
        });
      });
    },
    []
  );

  useEffect(() => {
    if (!emblaMainApi) return;
    setTweenNodes(emblaMainApi);
    setTweenFactor(emblaMainApi);
    tweenParallax(emblaMainApi);

    const handleReInit = () => {
      setTweenNodes(emblaMainApi);
      setTweenFactor(emblaMainApi);
      tweenParallax(emblaMainApi);
    };

    emblaMainApi
      .on("reInit", handleReInit)
      .on("scroll", tweenParallax)
      .on("slideFocus", tweenParallax);
    return () => {
      emblaMainApi
        .off("reInit", handleReInit)
        .off("scroll", tweenParallax)
        .off("slideFocus", tweenParallax);
    };
  }, [emblaMainApi, setTweenNodes, setTweenFactor, tweenParallax]);

  return (
    <div>
      <div className="overflow-hidden px-4" ref={emblaMainRef}>
        <div className="flex -ml-8 -mr-4">
          {images.map((image) => (
            <div className="shrink-0 grow-0 basis-8/12 pl-4" key={image}>
              <div className="relative h-80 overflow-hidden rounded">
                <Image
                  className="embla__parallax__layer object-cover"
                  src={image}
                  fill
                  alt={alt}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="py-2 my-2 pr-2 overflow-x-hidden" ref={emblaThumbsRef}>
        <div className="flex flex-row items-center pl-4">
          <div className="flex-1" />
          {images.map((image, index) => (
            <Button
              key={image}
              onClick={() => handleSelect(index)}
              variant="outline"
              size="icon"
              className={cn(
                "min-w-16 min-h-16 overflow-hidden transition-all mr-4 touch-manipulation",
                selectedIndex === index
                  ? "ring-2 ring-primary scale-110"
                  : "ring-1 ring-primary-foreground"
              )}
            >
              <Image
                src={image}
                width={100}
                height={100}
                alt={`${alt} - Image ${index + 1}`}
                className="object-cover min-h-full min-w-full"
              />
            </Button>
          ))}
          <div className="flex-1" />
        </div>
      </div>
    </div>
  );
}

export default ImageCarousel;
