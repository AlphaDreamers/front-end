"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

interface RatingProps {
  rating: number;
  maxRating?: number;
  onClick?: (rating: number) => void;
  size?: number;
}

const Rating = ({ rating, maxRating = 5, onClick, size = 20 }: RatingProps) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const effectiveRating = hoveredRating !== null ? hoveredRating : rating;

  return (
    <div
      className="flex items-center"
      onMouseLeave={() => setHoveredRating(null)}
    >
      {Array.from({ length: maxRating }).map((_, index) => {
        const starPosition = index + 1;
        const fillPercentage = Math.max(
          0,
          Math.min(100, (effectiveRating - index) * 100)
        );

        return (
          <div
            key={index}
            className={cn(
              "relative aspect-square",
              onClick && "cursor-pointer"
            )}
            style={{
              height: size,
            }}
            onMouseEnter={() => onClick && setHoveredRating(index + 1)}
            onClick={() => onClick && onClick(starPosition)}
          >
            <Star
              className="absolute text-muted stroke-muted fill-muted"
              strokeWidth={1}
              size={size}
            />

            {fillPercentage > 0 && (
              <div
                className="absolute overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <Star
                  className="text-primary stroke-primary fill-primary"
                  strokeWidth={1}
                  size={size}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Rating;
