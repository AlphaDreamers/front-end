"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Bookmark,
  Eye,
  MessageCircle,
  Star,
  Trash2,
  TrendingUp,
  User,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BookmarkedService {
  id: string;
  title: string;
  description: string;
  seller: {
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
  };
  price: number;
  category: string;
  bookmarkedAs: "buyer" | "seller";
  bookmarkedDate: string;
  hasUpdates: boolean;
  updateType?: "price_change" | "availability" | "new_review";
  tags: string[];
  deliveryTime: string;
}

const mockBookmarks: BookmarkedService[] = [
  {
    id: "1",
    title: "Professional Solana Smart Contract Development",
    description:
      "I'll develop secure and efficient smart contracts for your Solana project with comprehensive testing and documentation.",
    seller: {
      name: "Alex Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.9,
      verified: true,
    },
    price: 15.5,
    category: "Development",
    bookmarkedAs: "buyer",
    bookmarkedDate: "2024-01-15",
    hasUpdates: true,
    updateType: "price_change",
    tags: ["Smart Contracts", "Solana", "Rust"],
    deliveryTime: "7 days",
  },
  {
    id: "2",
    title: "Solana NFT Collection Design & Minting",
    description:
      "Complete NFT collection design with custom artwork and automated minting setup on Solana blockchain.",
    seller: {
      name: "Maria Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.8,
      verified: true,
    },
    price: 25.0,
    category: "Design",
    bookmarkedAs: "seller",
    bookmarkedDate: "2024-01-12",
    hasUpdates: false,
    tags: ["NFT", "Design", "Minting"],
    deliveryTime: "10 days",
  },
  {
    id: "3",
    title: "DeFi Protocol Security Audit",
    description:
      "Comprehensive security audit for your DeFi protocol with detailed vulnerability assessment and recommendations.",
    seller: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5.0,
      verified: true,
    },
    price: 50.0,
    category: "Security",
    bookmarkedAs: "buyer",
    bookmarkedDate: "2024-01-10",
    hasUpdates: true,
    updateType: "new_review",
    tags: ["Security", "Audit", "DeFi"],
    deliveryTime: "14 days",
  },
  {
    id: "4",
    title: "Solana Wallet Integration & UI Development",
    description:
      "Seamless wallet integration with modern UI/UX design for your Solana dApp.",
    seller: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.7,
      verified: false,
    },
    price: 12.0,
    category: "Development",
    bookmarkedAs: "seller",
    bookmarkedDate: "2024-01-08",
    hasUpdates: true,
    updateType: "availability",
    tags: ["Wallet", "UI/UX", "Frontend"],
    deliveryTime: "5 days",
  },
];

export default function BookmarksPage() {
  const [filter, setFilter] = useState<"all" | "buyer" | "seller">("all");
  const [sortBy, setSortBy] = useState<"date" | "price" | "rating">("date");
  const [bookmarks, setBookmarks] =
    useState<BookmarkedService[]>(mockBookmarks);

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    if (filter === "all") return true;
    return bookmark.bookmarkedAs === filter;
  });

  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return b.price - a.price;
      case "rating":
        return b.seller.rating - a.seller.rating;
      case "date":
      default:
        return (
          new Date(b.bookmarkedDate).getTime() -
          new Date(a.bookmarkedDate).getTime()
        );
    }
  });

  const removeBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
  };

  const getUpdateMessage = (bookmark: BookmarkedService) => {
    switch (bookmark.updateType) {
      case "price_change":
        return "Price updated recently";
      case "availability":
        return "Availability changed";
      case "new_review":
        return "New review received";
      default:
        return "Service updated";
    }
  };

  const updatesCount = bookmarks.filter((b) => b.hasUpdates).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Bookmarks
          </h1>
          <p className="text-gray-600">
            Manage your saved services and stay updated on changes
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600">
            {updatesCount} service{updatesCount !== 1 ? "s" : ""} updated
          </span>
        </div>
      </div>

      {/* Notifications */}
      {updatesCount > 0 && (
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Bell className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            You have {updatesCount} bookmarked service
            {updatesCount !== 1 ? "s" : ""} with recent updates. Check them out
            to stay informed!
          </AlertDescription>
        </Alert>
      )}

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Tabs
          value={filter}
          onValueChange={(value) =>
            setFilter(value as "all" | "buyer" | "seller")
          }
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3 sm:w-auto">
            <TabsTrigger value="all">All ({bookmarks.length})</TabsTrigger>
            <TabsTrigger value="buyer">
              As Buyer (
              {bookmarks.filter((b) => b.bookmarkedAs === "buyer").length})
            </TabsTrigger>
            <TabsTrigger value="seller">
              As Seller (
              {bookmarks.filter((b) => b.bookmarkedAs === "seller").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Select
          value={sortBy}
          onValueChange={(value) =>
            setSortBy(value as "date" | "price" | "rating")
          }
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Recently Bookmarked</SelectItem>
            <SelectItem value="price">Price (High to Low)</SelectItem>
            <SelectItem value="rating">Rating (High to Low)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookmarks Grid */}
      {sortedBookmarks.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No bookmarks found
          </h3>
          <p className="text-gray-600">
            {filter === "all"
              ? "Start exploring services and bookmark your favorites!"
              : `No services bookmarked as ${filter}. Try switching filters or explore new services.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedBookmarks.map((bookmark) => (
            <Card
              key={bookmark.id}
              className="relative hover:shadow-lg transition-shadow"
            >
              {bookmark.hasUpdates && (
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge variant="destructive" className="animate-pulse">
                    <Bell className="h-3 w-3 mr-1" />
                    Updated
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <Badge
                    variant={
                      bookmark.bookmarkedAs === "buyer"
                        ? "default"
                        : "secondary"
                    }
                    className="mb-2"
                  >
                    {bookmark.bookmarkedAs === "buyer"
                      ? "Saved to Buy"
                      : "Market Research"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBookmark(bookmark.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                  {bookmark.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {bookmark.description}
                </p>
              </CardHeader>

              <CardContent className="pb-3">
                {/* Seller Info */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={bookmark.seller.avatar || "/placeholder.svg"}
                      alt={bookmark.seller.name}
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium truncate">
                        {bookmark.seller.name}
                      </p>
                      {bookmark.seller.verified && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">
                        {bookmark.seller.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price and Delivery */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-purple-600">
                      {bookmark.price} SOL
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {bookmark.deliveryTime}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {bookmark.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Update Notification */}
                {bookmark.hasUpdates && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-2 mb-3">
                    <p className="text-xs text-blue-800 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {getUpdateMessage(bookmark)}
                    </p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-0">
                <div className="flex gap-2 w-full">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  {bookmark.bookmarkedAs === "buyer" && (
                    <Button
                      size="sm"
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      Order Now
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center p-6">
          <h3 className="text-2xl font-bold text-purple-600">
            {bookmarks.filter((b) => b.bookmarkedAs === "buyer").length}
          </h3>
          <p className="text-gray-600">Services to Purchase</p>
        </Card>
        <Card className="text-center p-6">
          <h3 className="text-2xl font-bold text-blue-600">
            {bookmarks.filter((b) => b.bookmarkedAs === "seller").length}
          </h3>
          <p className="text-gray-600">Market Research Items</p>
        </Card>
        <Card className="text-center p-6">
          <h3 className="text-2xl font-bold text-green-600">{updatesCount}</h3>
          <p className="text-gray-600">Recent Updates</p>
        </Card>
      </div>
    </div>
  );
}
