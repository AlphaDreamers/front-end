import { Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Progress,
} from "./ui";
import { Button } from "./ui/button";
import ReviewCard from "./ReviewCard";
import Rating from "./Rating";

interface ReviewStatsProps {
  distribution: Record<number, number>;
  averageRating: number;
  maxRating?: number;
  totalReviews: number;
}

const ReviewStats = ({
  distribution,
  averageRating,
  maxRating = 5,
  totalReviews,
}: ReviewStatsProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="text-2xl">Customer Reviews</CardTitle>
        <div className="flex flex-col gap-1 items-end">
          <div className="flex items-center gap-2">
            <Rating rating={averageRating} size={24} />
            <span className="text-sm font-light">
              {averageRating} / {maxRating}
            </span>
          </div>

          <span className="text-sm text-muted-foreground">
            {totalReviews} reviews
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-1.5">
        {[...Array(Object.keys(distribution).length)].map((_, index) => {
          const curStars = 5 - index;

          const curStarRatings = distribution[curStars];

          if (!curStarRatings) {
            throw new Error(`Rating ${curStars} not found in ratings`);
          }

          const curStarReviews = curStarRatings;

          const curStarPercentage = (curStarReviews / totalReviews) * 100;

          return (
            <div key={index} className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Rating rating={curStars} />
                <span className="text-sm text-muted-foreground font-medium w-8">
                  ({curStarReviews})
                </span>
              </div>

              <div className="flex items-center flex-1 gap-2 ml-2">
                <Progress value={curStarPercentage} className="flex-1 h-2" />
                <span className="text-sm text-muted-foreground font-medium w-8">
                  ({curStarPercentage.toFixed(0)}
                  %)
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ReviewStats;
