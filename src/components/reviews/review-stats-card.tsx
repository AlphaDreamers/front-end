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
