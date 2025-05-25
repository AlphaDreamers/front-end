"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReviewSummary } from "@/components/reviews-dump/review-summary"
import { ReviewCard } from "@/components/reviews-dump/review-card"
import { EmptyState } from "@/components/reviews-dump/empty-state"
import { mockReviews } from "@/lib/mock-data"
import { Search } from "lucide-react"

export default function ReviewsPage() {
  // In a real app, you would get the user ID and role from authentication
  const userId = "user-1" // This is Alex Morgan's ID
  const [userRole, setUserRole] = useState<"seller" | "buyer">("seller")

  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("newest")
  const [ratingFilter, setRatingFilter] = useState("all")

  // Filter reviews based on user role
  const userReviews =
    userRole === "seller"
      ? mockReviews.filter((review) => review.sellerId === userId)
      : mockReviews.filter((review) => review.reviewerId === userId)

  // Apply search filter
  const filteredReviews = userReviews.filter((review) => {
    const searchLower = searchTerm.toLowerCase()
    if (userRole === "seller") {
      return (
        review.reviewerName.toLowerCase().includes(searchLower) ||
        review.comment.toLowerCase().includes(searchLower) ||
        review.gigTitle.toLowerCase().includes(searchLower)
      )
    } else {
      return (
        review.sellerName.toLowerCase().includes(searchLower) ||
        review.comment.toLowerCase().includes(searchLower) ||
        review.gigTitle.toLowerCase().includes(searchLower)
      )
    }
  })

  // Apply rating filter
  const ratingFilteredReviews =
    ratingFilter === "all"
      ? filteredReviews
      : filteredReviews.filter((review) => review.rating === Number.parseInt(ratingFilter))

  // Apply sorting
  const sortedReviews = [...ratingFilteredReviews].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "highest":
        return b.rating - a.rating
      case "lowest":
        return a.rating - b.rating
      default:
        return 0
    }
  })

  return (
    <div className="container mx-auto py-8 px-4 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reviews</h1>
        <p className="text-muted-foreground">
          {userRole === "seller"
            ? "Manage and respond to reviews from your clients"
            : "View and manage reviews you've given to sellers"}
        </p>
      </div>

      <Tabs defaultValue="seller" className="mb-8" onValueChange={(value) => setUserRole(value as "seller" | "buyer")}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="seller">Reviews Received</TabsTrigger>
          <TabsTrigger value="buyer">Reviews Given</TabsTrigger>
        </TabsList>
      </Tabs>

      <ReviewSummary reviews={mockReviews} userRole={userRole} userId={userId} />

      <div className="flex flex-col md:flex-row gap-4 my-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${userRole === "seller" ? "reviews from clients" : "reviews you've given"}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Rating</SelectItem>
              <SelectItem value="lowest">Lowest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} userRole={userRole} userId={userId} />
          ))
        ) : (
          <EmptyState userRole={userRole} />
        )}
      </div>
    </div>
  )
}
