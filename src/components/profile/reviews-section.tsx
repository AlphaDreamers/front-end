"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  ExternalLink,
  Star,
  Filter,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { loadMoreReviews } from "@/lib/actions";

type Review = {
  id: string;
  rating: number;
  title: string;
  description: string;
  author: {
    avatar: string | null;
    firstName: string;
    lastName: string;
    username: string;
  } | null;
  createdAt: Date;
  sellerResponse?: string | null;
  sellerRespondedAt?: Date | null;
  solanaTx?: string | null;
};

interface ReviewsSectionProps {
  userId: string;
  statistics: {
    average: number;
    total: number;
    distribution: Record<number, number>;
  };
  initialReviews: Review[];
}

type SortOption = "recent" | "highest" | "lowest" | "verified";

export function ReviewsSection({
  userId,
  statistics,
  initialReviews,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialReviews.length < statistics.total
  );
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filterRating, setFilterRating] = useState<string>("all");

  // Sort and filter reviews
  const processedReviews = [...reviews]
    .filter((review) => {
      if (filterRating === "all") return true;
      return review.rating === parseInt(filterRating);
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        case "verified":
          return (b.solanaTx ? 1 : 0) - (a.solanaTx ? 1 : 0);
        default: // recent
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

  const handleLoadMore = async () => {
    setIsLoading(true);
    try {
      const newReviews = await loadMoreReviews(userId, reviews.length, 6);
      setReviews((prev) => [...prev, ...newReviews]);
      setHasMore(reviews.length + newReviews.length < statistics.total);
    } catch (error) {
      console.error("Failed to load more reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Reviews</span>
            <div className="flex items-center gap-2">
              <Star className="size-5 fill-yellow-500 text-yellow-500" />
              <span className="text-2xl">{statistics.average.toFixed(1)}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Based on {statistics.total}{" "}
            {statistics.total === 1 ? "review" : "reviews"}
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = statistics.distribution[rating] || 0;
              const percentage =
                statistics.total > 0 ? (count / statistics.total) * 100 : 0;

              return (
                <div key={rating} className="flex items-center gap-3">
                  <button
                    onClick={() => setFilterRating(rating.toString())}
                    className="flex items-center gap-1 text-sm font-medium min-w-[60px] hover:text-primary transition-colors"
                  >
                    {rating} <Star className="size-3 fill-current" />
                  </button>
                  <Progress value={percentage} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground min-w-[40px] text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="size-4 mr-2" />
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            {[5, 4, 3, 2, 1].map((rating) => (
              <SelectItem key={rating} value={rating.toString()}>
                {rating} Star{rating !== 1 ? "s" : ""} (
                {statistics.distribution[rating] || 0})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortOption)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="highest">Highest Rating</SelectItem>
            <SelectItem value="lowest">Lowest Rating</SelectItem>
            <SelectItem value="verified">Blockchain Verified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {processedReviews.length === 0 ? (
          <Card className="text-center p-8">
            <p className="text-muted-foreground">
              {filterRating === "all"
                ? "No reviews yet."
                : `No ${filterRating}-star reviews found.`}
            </p>
          </Card>
        ) : (
          processedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && filterRating === "all" && (
        <div className="flex justify-center">
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            variant="outline"
            className="min-w-[200px]"
          >
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                <ChevronDown className="size-4 mr-2" />
                Load More Reviews
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

// Individual Review Card Component
function ReviewCard({ review }: { review: Review }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongDescription = review.description.length > 200;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage
                  src={review.author?.avatar || ""}
                  alt={
                    review.author
                      ? `${review.author.firstName} ${review.author.lastName}`
                      : "Anonymous"
                  }
                />
                <AvatarFallback>
                  {review.author
                    ? `${review.author.firstName[0]}${review.author.lastName[0]}`
                    : "AN"}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">
                    {review.author
                      ? `${review.author.firstName} ${review.author.lastName}`
                      : "Anonymous User"}
                  </h4>
                  {review.solanaTx && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="secondary" className="gap-1">
                            <ShieldCheck className="size-3" />
                            Verified
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            This review is verified on the Solana blockchain
                          </p>
                          {review.solanaTx && (
                            <a
                              href={`https://explorer.solana.com/tx/${review.solanaTx}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                            >
                              View transaction
                              <ExternalLink className="size-3" />
                            </a>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "size-4",
                          i < review.rating
                            ? "fill-yellow-500 text-yellow-500"
                            : "fill-muted text-muted"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(review.createdAt, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Review Content */}
          {review.title && <h5 className="font-medium">{review.title}</h5>}

          <div>
            <p
              className={cn(
                "text-sm leading-relaxed",
                !isExpanded && isLongDescription && "line-clamp-3"
              )}
            >
              {review.description}
            </p>
            {isLongDescription && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-0 h-auto mt-1"
              >
                {isExpanded ? "Show less" : "Read more"}
              </Button>
            )}
          </div>

          {/* Seller Response */}
          {review.sellerResponse && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  Seller Response
                </Badge>
                {review.sellerRespondedAt && (
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(review.sellerRespondedAt, {
                      addSuffix: true,
                    })}
                  </span>
                )}
              </div>
              <p className="text-sm">{review.sellerResponse}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
