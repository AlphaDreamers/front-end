import Rating from "../rating";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

interface ReviewStatsCardProps {
  statistics: {
    average: number;
    total: number;
    distribution: Record<number, number>;
  };
  maxRating?: number;
}

const ReviewStatsCard = ({
  statistics,
  maxRating = 5,
}: ReviewStatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="text-2xl">Customer Reviews</CardTitle>
        <div className="flex flex-col gap-1 items-end">
          <div className="flex items-center gap-2">
            <Rating rating={statistics.average} size={24} />
            <span className="text-sm font-light">
              {statistics.average.toFixed(1)} / {maxRating}
            </span>
          </div>

          <span className="text-sm text-muted-foreground">
            {statistics.total} reviews
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-1.5">
        {[...Array(Object.keys(statistics.distribution).length)].map(
          (_, index) => {
            const curStars = 5 - index;

            const curStarRatings =
              curStars in statistics.distribution
                ? statistics.distribution[curStars]
                : 0;

            const curStarPercentage = (curStarRatings / statistics.total) * 100;

            return (
              <div key={index} className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Rating rating={curStars} />
                  <span className="text-sm text-muted-foreground font-medium w-8">
                    ({curStarRatings})
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
          }
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewStatsCard;

export const ReviewStatsCardSkeleton = () => {
  return (
    <Card className="animate-pulse">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="text-2xl bg-gray-200 h-6 w-1/2" />
        <div className="flex flex-col gap-1 items-end">
          <div className="flex items-center gap-2">
            <div className="bg-gray-200 h-6 w-6 rounded-full" />
            <span className="text-sm font-light bg-gray-200 h-4 w-16" />
          </div>
          <span className="text-sm text-muted-foreground bg-gray-200 h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-gray-200 h-6 w-6 rounded-full" />
              <span className="text-sm text-muted-foreground font-medium w-8 bg-gray-200 h-4" />
            </div>
            <div className="flex items-center flex-1 gap-2 ml-2">
              <div className="bg-gray-200 flex-1 h-2" />
              <span className="text-sm text-muted-foreground font-medium w-8 bg-gray-200 h-4" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
