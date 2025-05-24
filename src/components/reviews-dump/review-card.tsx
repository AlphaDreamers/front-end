"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Shield, ChevronDown, ChevronUp, MessageSquare, ExternalLink, Check } from "lucide-react"
import type { Review } from "@/lib/mock-data"
import { formatDistanceToNow } from "date-fns"

interface ReviewCardProps {
  review: Review
  userRole: "seller" | "buyer"
  userId: string
}

export function ReviewCard({ review, userRole, userId }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showSignature, setShowSignature] = useState(false)

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return "Invalid date"
    }
  }

  const isSeller = userRole === "seller"
  const isBuyer = userRole === "buyer"
  const isReviewerVerified = review.reviewerIsVerified

  // Determine if this is a review received or given by the current user
  const isReviewReceived = isSeller && review.sellerId === userId
  const isReviewGiven = isBuyer && review.reviewerId === userId

  // Only show relevant reviews based on user role
  if ((isSeller && !isReviewReceived) || (isBuyer && !isReviewGiven)) {
    return null
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const shortenHash = (hash: string) => {
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 10)}`
  }

  return (
    <Card className="border-muted/30 hover:border-purple-500/30 transition-all duration-300 animate-fadeIn">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left side: Reviewer/Gig info */}
          <div className="md:w-1/4">
            {isSeller ? (
              // Show reviewer info for sellers
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-12 w-12 mb-2">
                  <AvatarImage src={review.reviewerAvatar || "/placeholder.svg"} alt={review.reviewerName} />
                  <AvatarFallback>{review.reviewerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1">
                  <h3 className="font-medium">{review.reviewerName}</h3>
                  {isReviewerVerified && <Shield className="h-3 w-3 text-purple-400" />}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Order #{review.orderId.substring(review.orderId.length - 6)}
                </div>
              </div>
            ) : (
              // Show gig info for buyers
              <div className="flex flex-col">
                <div className="aspect-video w-full rounded-md overflow-hidden mb-2">
                  <img
                    src={review.gigImage || "/placeholder.svg"}
                    alt={review.gigTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium line-clamp-2">{review.gigTitle}</h3>
                <div className="text-xs text-muted-foreground mt-1">Seller: {review.sellerName}</div>
              </div>
            )}
          </div>

          {/* Right side: Review content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">{formatDate(review.date)}</div>
            </div>

            <div className="mb-4">
              <p className={expanded ? "" : "line-clamp-3"}>{review.comment}</p>
              {review.comment.length > 150 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto mt-2 text-purple-400 hover:text-purple-300"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" /> Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" /> Show more
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Response section (only for sellers) */}
            {isSeller && review.response && (
              <div className="bg-muted/20 p-3 rounded-md border-l-2 border-purple-500 mt-3">
                <div className="flex items-center gap-2 mb-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={review.sellerAvatar || "/placeholder.svg"} alt={review.sellerName} />
                    <AvatarFallback>{review.sellerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{review.sellerName}</span>
                    <span className="text-xs text-muted-foreground ml-2">{formatDate(review.response.date)}</span>
                  </div>
                </div>
                <p className="text-sm">{review.response.comment}</p>
              </div>
            )}

            {/* Verification badge */}
            <div className="mt-4 flex items-center">
              <Badge
                variant="outline"
                className="bg-green-900/20 text-green-400 border-green-800/30 flex items-center gap-1"
              >
                <Check className="h-3 w-3" /> Cryptographically Verified
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-7 text-xs"
                onClick={() => setShowSignature(!showSignature)}
              >
                {showSignature ? "Hide Signature" : "View Signature"}
              </Button>
            </div>

            {showSignature && (
              <div className="mt-2 p-2 bg-muted/20 rounded-md border border-muted/30 text-xs font-mono overflow-x-auto">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Signature Hash:</span>
                  <span>{shortenHash(review.signatureHash)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 py-3 bg-muted/10 border-t border-muted/20 flex justify-between">
        {isSeller ? (
          <div className="text-xs text-muted-foreground">
            For: <span className="text-purple-400">{review.gigTitle}</span>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            Order completed: <span className="text-purple-400">{formatDate(review.date)}</span>
          </div>
        )}
        <div className="flex gap-2">
          {isSeller && !review.response && (
            <Button variant="ghost" size="sm" className="h-7 text-xs">
              <MessageSquare className="h-3 w-3 mr-1" /> Respond
            </Button>
          )}
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            <ExternalLink className="h-3 w-3 mr-1" /> View Order
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
