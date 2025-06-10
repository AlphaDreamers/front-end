import { Star, Eye, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { buttonVariants } from "../ui/button";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

import { Gig } from "@/lib/types";
import BookmarkToggle from "./bookmark-toggle";

interface GigCardProps {
  gig: Gig;
}

const GigCard = ({ gig }: GigCardProps) => {
  return (
    <Card className="group h-full overflow-hidden hover:border-primary transition-all duration-300">
      {/* Image with price overlay */}
      <CardHeader className="relative">
        <Image
          src={gig.image}
          width={200}
          height={200}
          alt={gig.title}
          className="-mt-6 -mx-6 min-w-[calc(100%+48px)] h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          <div className="flex items-center">
            <Link href={`/profile/${gig.seller.username}`}>
              <Image
                src={gig.seller.avatar || "/avatar-fallback.png"}
                alt={gig.seller.username}
                width={32}
                height={32}
                className="min-w-8 min-h-8 rounded-full border-1 border-primary"
              />
            </Link>
            <Link href={`/profile/${gig.seller.username}`} className="ml-2">
              <p className="text-foreground text-sm font-medium">
                {gig.seller.username}
              </p>
              <p className="text-muted-foreground text-xs">
                {gig.seller.username}
              </p>
            </Link>
            {gig.seller.badge && (
              <Badge className="ml-auto">
                <Star />
                {gig.seller.badge.title}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Content section */}
      <CardContent>
        <div className="flex items-center mb-3 text-xs text-gray-400">
          <div className="flex items-center mr-3">
            <Star className="w-3 h-3 text-primary mr-1" />
            <span>{gig.averageRating.toFixed(2)}</span>
          </div>
          <div className="flex items-center mr-3">
            <Award className="w-3 h-3 text-primary mr-1" />
            <span className="text-muted-foreground">({gig.ratingCount})</span>
          </div>
        </div>

        <h3 className="font-medium mb-3 line-clamp-2">{gig.title}</h3>

        <p className="text-muted-foreground text-xs mb-4 line-clamp-3">
          {gig.description}
        </p>

        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {gig.tags.map((tag) => (
            <Badge variant="outline" key={tag.id} className="text-chart-3">
              {tag.label}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="justify-between mt-auto">
        <div className="text-primary font-bold text-xl">
          {gig.startsAtPrice} SOL
        </div>

        <div className="flex gap-2 items-center">
          <BookmarkToggle gigId={gig.id} isBookmarked={gig.isBookmarked} />
          <Link
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "flex items-center gap-2",
            })}
            href={`/gigs/${gig.id}`}
          >
            <Eye />
            View
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default GigCard;

export const GigCardSkeleton = () => {
  return (
    <Card className="h-full overflow-hidden hover:border-primary transition-all duration-300">
      <CardHeader className="relative">
        <Skeleton className="-mt-6 -mx-6 min-w-[calc(100%+48px)] h-48 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          <div className="flex items-center">
            <Skeleton className="w-8 h-8 rounded-full border-1 border-primary" />

            <div className="ml-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="w-20 h-3 mt-1" />
            </div>
            <Skeleton className="ml-auto h-5 w-14" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center mb-3 gap-2">
          <Skeleton className="w-6 h-4" />
          <Skeleton className="w-6 h-4" />
        </div>

        <Skeleton className="mb-3 h-6 w-28" />

        <div className="mb-4 flex flex-col gap-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-7/8" />
          <Skeleton className="h-4 w-11/12" />
        </div>

        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className={cn("h-4", {
                "w-20": i % 2 === 0,
                "w-16": i % 2 !== 0,
              })}
            />
          ))}
        </div>
      </CardContent>

      <CardFooter className="justify-between mt-auto">
        <Skeleton className="w-24 h-8" />

        <Skeleton className="w-20 h-8" />
      </CardFooter>
    </Card>
  );
};
