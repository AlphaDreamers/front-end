"use client";

import Image from "next/image";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import Rating from "@/components/rating";
import { Testimonial } from "@/lib/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

const TestimonialCard = ({ testimonial, className }: TestimonialCardProps) => {
  return (
    <Card className={cn("h-full", className)}>
      {/* Header matches ReviewCard structure */}
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Avatar with same sizing as ReviewCard */}
          <Image
            src={testimonial.author.avatar || "/avatar-fallback.png"}
            alt={`${testimonial.author.firstName} ${testimonial.author.lastName}`}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full border object-cover flex-shrink-0"
          />

          {/* User info with same structure */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-1">
              <h4 className="font-semibold text-base truncate">
                {testimonial.author.firstName} {testimonial.author.lastName}
              </h4>
              <p className="text-sm text-muted-foreground">
                @{testimonial.author.username}
              </p>
            </div>
          </div>
        </div>

        {/* Rating positioned consistently */}
        <div className="flex-shrink-0">
          <Rating rating={testimonial.rating} size={18} />
        </div>
      </CardHeader>

      {/* Content with quotes for testimonial style */}
      <CardContent className="pt-0">
        <blockquote className="text-muted-foreground text-sm leading-relaxed">
          <span className="text-2xl leading-none text-muted-foreground/30">
            &ldquo;
          </span>
          <span className="italic">{testimonial.content}</span>
          <span className="text-2xl leading-none text-muted-foreground/30">
            &ldquo;
          </span>
        </blockquote>
      </CardContent>
    </Card>
  );
};
export default TestimonialCard;

export const TestimonialsCardSkeleton = () => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-1">
              <div className="h-4 w-32 bg-muted animate-pulse" />
              <div className="h-3 w-24 bg-muted animate-pulse" />
            </div>
          </div>
        </div>
        <div className="w-16 h-6 bg-muted animate-pulse" />
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-20 bg-muted animate-pulse" />
      </CardContent>
    </Card>
  );
};
