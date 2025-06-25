"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import Rating from "@/components/rating";
import { Review } from "@/lib/types";
import UserDetails from "../user-details";

interface TestimonialCardProps {
  testimonial: Review;
  className?: string;
}

const TestimonialCard = ({ testimonial, className }: TestimonialCardProps) => {
  return (
    <Card className={cn("h-full gap-1 min-w-xs w-[400px]", className)}>
      {/* Header matches ReviewCard structure */}
      <CardHeader className="flex flex-row items-start justify-between gap-4 mb-1.5">
        <UserDetails user={testimonial.author} />

        {/* Rating positioned consistently */}
        <div className="flex-shrink-0 flex items-center gap-1 text-sm text-muted-foreground">
          <Rating rating={testimonial.rating} size={18} />
          <span>({testimonial.rating})</span>
        </div>
      </CardHeader>

      <CardContent className="pb-0">
        <div className="text-lg font-semibold text-muted-foreground mb-2">
          {testimonial.title}
        </div>
      </CardContent>

      {/* Content with quotes for testimonial style */}
      <CardFooter className="pt-0">
        <blockquote className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
          <span className="text-2xl leading-none text-muted-foreground/30">
            &ldquo;
          </span>
          <span className="italic">{testimonial.description}</span>
          <span className="text-2xl leading-none text-muted-foreground/30">
            &ldquo;
          </span>
        </blockquote>
      </CardFooter>
    </Card>
  );
};
export default TestimonialCard;

export const TestimonialsCardSkeleton = () => {
  return (
    <Card className="h-full w-72 min-w-xs">
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
