"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import type { Review } from "@/lib/mock-data"

interface ReviewSummaryProps {
  reviews: Review[]
  userRole: "seller" | "buyer"
  userId: string
}

export function ReviewSummary({ reviews, userRole, userId }: ReviewSummaryProps) {
  const [averageRating, setAverageRating] = useState(0)
  const [ratingCounts, setRatingCounts] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  })
  const [totalReviews, setTotalReviews] = useState(0)

  useEffect(() => {
    // Filter reviews based on user role
    const relevantReviews =
      userRole === "seller"
        ? reviews.filter((review) => review.sellerId === userId)
        : reviews.filter((review) => review.reviewerId === userId)

    if (relevantReviews.length === 0) {
      setAverageRating(0)
      setTotalReviews(0)
      return
    }

    // Calculate average rating
    const sum = relevantReviews.reduce((acc, review) => acc + review.rating, 0)
    const avg = sum / relevantReviews.length
    setAverageRating(avg)
    setTotalReviews(relevantReviews.length)

    // Calculate rating distribution
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    relevantReviews.forEach((review) => {
      counts[review.rating as keyof typeof counts]++
    })
    setRatingCounts(counts)
  }, [reviews, userRole, userId])

  return (
    <Card className="bg-gradient-to-br from-purple-900/40 to-black border-purple-800/30 animate-fadeIn">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-xl font-semibold mb-2">
              {userRole === "seller" ? "Reviews Received" : "Reviews Given"}
            </h2>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">({totalReviews} reviews)</div>
            </div>
          </div>

          <div className="w-full md:w-auto flex-1 max-w-md">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingCounts[rating]
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

                return (
                  <div key={rating} className="flex items-center gap-2">
                    <div className="flex items-center w-12">
                      <span className="text-sm">{rating}</span>
                      <Star className="h-4 w-4 ml-1 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-violet-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-right text-sm text-muted-foreground">
                      {count} ({percentage.toFixed(0)}%)
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
