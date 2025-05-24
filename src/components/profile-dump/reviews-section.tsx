import type { Review } from "@/lib/data"
import { Star } from "lucide-react"

interface ReviewsSectionProps {
  reviews: Review[]
  avgRating: number
}

export function ReviewsSection({ reviews, avgRating }: ReviewsSectionProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <div className="flex items-center">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(avgRating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="ml-2 font-medium">{avgRating.toFixed(1)}</span>
          <span className="ml-1 text-muted-foreground">({reviews.length} reviews)</span>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-muted/20 pb-6 last:border-0">
            <div className="flex items-start">
              <img
                src={review.author.avatar || "/placeholder.svg"}
                alt={review.author.name}
                className="h-10 w-10 rounded-full mr-4"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{review.author.name}</h3>
                  <span className="text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString()}</span>
                </div>
                <div className="flex mt-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">{review.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
