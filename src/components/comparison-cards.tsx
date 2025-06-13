"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronDown, ChevronUp, X, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";


export default function ComparisonCards() {
  const [gigs, setGigs] = useState(mockGigs);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    {}
  );

  const removeGig = (id: string) => {
    setGigs(gigs.filter((gig) => gig.id !== id));
  };

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (gigs.length === 0) {
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-8 text-center">
        <p className="mb-4 text-lg">No services selected for comparison</p>
        <Link href="/services">
          <Button className="bg-violet-600 hover:bg-violet-700">
            Browse Services
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {gigs.map((gig) => (
        <Card key={gig.id} className="border-gray-700 bg-gray-800">
          <CardHeader className="relative p-0">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-gray-900/70 p-1.5 hover:bg-gray-800"
              onClick={() => removeGig(gig.id)}
              aria-label={`Remove ${gig.title} from comparison`}
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="h-48 w-full overflow-hidden">
              <Image
                src={gig.image || "/placeholder.svg"}
                alt={gig.title}
                width={400}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <Link
                href={`/services/${gig.id}`}
                className="text-lg font-semibold text-violet-400 hover:text-violet-300 hover:underline"
              >
                {gig.title}
              </Link>
              <span className="text-xl font-bold">${gig.startsAtPrice}</span>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-2 h-8 w-8 overflow-hidden rounded-full">
                  <Image
                    src={
                      gig.seller.avatar || "/placeholder.svg?height=32&width=32"
                    }
                    alt={`${gig.seller.firstName} ${gig.seller.lastName}`}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                </div>
                <Link
                  href={`/sellers/${gig.seller.id}`}
                  className="text-sm font-medium text-violet-400 hover:text-violet-300 hover:underline"
                >
                  {gig.seller.username}
                </Link>
                {gig.seller.badge && (
                  <Badge
                    variant="outline"
                    className="ml-2 border-violet-500 text-xs"
                  >
                    <Award className="mr-1 h-3 w-3 text-violet-400" />
                    {gig.seller.badge.title}
                  </Badge>
                )}
              </div>
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">
                  {gig.averageRating.toFixed(1)}
                </span>
                <span className="ml-1 text-xs text-gray-400">
                  ({gig.ratingCount})
                </span>
              </div>
            </div>

            <Badge
              className={`mb-3 bg-${gig.category.color}-600 hover:bg-${gig.category.color}-700`}
            >
              {gig.category.label}
            </Badge>

            {expandedCards[gig.id] ? (
              <>
                <div className="mb-3">
                  <h4 className="mb-1 text-sm font-medium text-gray-300">
                    Description
                  </h4>
                  <p className="text-sm text-gray-400">{gig.description}</p>
                </div>

                <div className="mb-3">
                  <h4 className="mb-1 text-sm font-medium text-gray-300">
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {gig.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="border-gray-600 text-xs"
                      >
                        {tag.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="line-clamp-2 text-sm text-gray-400">
                {gig.description}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t border-gray-700 p-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
              onClick={() => toggleCard(gig.id)}
            >
              {expandedCards[gig.id] ? (
                <>
                  <ChevronUp className="mr-1 h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1 h-4 w-4" />
                  Show More
                </>
              )}
            </Button>
            <Link href={`/services/${gig.id}`}>
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                View Details
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export type Color =
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose"

export type LucideIconName = string

export interface Gig {
  id: string
  image: string
  startsAtPrice: number
  title: string
  description: string
  averageRating: number
  ratingCount: number
  category: {
    id: string
    label: string
    icon: LucideIconName
    color: Color
  }
  seller: {
    id: string
    username: string
    avatar: string | null
    firstName: string
    lastName: string
    badge: {
      title: string
      tier: string
    } | null
  }
  isBookmarked: boolean
  tags: {
    id: string
    label: string
  }[]
}

export const mockGigs: Gig[] = [
  {
    id: "gig-1",
    image: "/placeholder.svg?height=400&width=600",
    startsAtPrice: 120,
    title: "Professional Logo Design",
    description:
      "I will design a modern, minimalist logo for your brand with unlimited revisions and source files included. Fast turnaround time guaranteed.",
    averageRating: 4.9,
    ratingCount: 342,
    category: {
      id: "cat-1",
      label: "Graphic Design",
      icon: "Palette",
      color: "violet",
    },
    seller: {
      id: "seller-1",
      username: "designmaster",
      avatar: "/placeholder.svg?height=100&width=100",
      firstName: "Alex",
      lastName: "Johnson",
      badge: {
        title: "Top Rated",
        tier: "gold",
      },
    },
    isBookmarked: true,
    tags: [
      { id: "tag-1", label: "Logo Design" },
      { id: "tag-2", label: "Branding" },
      { id: "tag-3", label: "Vector" },
      { id: "tag-4", label: "Minimalist" },
    ],
  },
  {
    id: "gig-2",
    image: "/placeholder.svg?height=400&width=600",
    startsAtPrice: 85,
    title: "Responsive Website Development",
    description:
      "I will build a fully responsive website using React and Next.js with modern design principles and SEO optimization.",
    averageRating: 4.7,
    ratingCount: 218,
    category: {
      id: "cat-2",
      label: "Web Development",
      icon: "Code",
      color: "teal",
    },
    seller: {
      id: "seller-2",
      username: "webwizard",
      avatar: "/placeholder.svg?height=100&width=100",
      firstName: "Sarah",
      lastName: "Miller",
      badge: {
        title: "Rising Talent",
        tier: "silver",
      },
    },
    isBookmarked: false,
    tags: [
      { id: "tag-5", label: "React" },
      { id: "tag-6", label: "Next.js" },
      { id: "tag-7", label: "Responsive" },
      { id: "tag-8", label: "SEO" },
    ],
  },
  {
    id: "gig-3",
    image: "/placeholder.svg?height=400&width=600",
    startsAtPrice: 150,
    title: "Social Media Marketing Campaign",
    description:
      "I will create and manage a complete social media marketing campaign across multiple platforms to boost your brand visibility and engagement.",
    averageRating: 4.8,
    ratingCount: 176,
    category: {
      id: "cat-3",
      label: "Digital Marketing",
      icon: "TrendingUp",
      color: "emerald",
    },
    seller: {
      id: "seller-3",
      username: "marketpro",
      avatar: "/placeholder.svg?height=100&width=100",
      firstName: "Michael",
      lastName: "Davis",
      badge: null,
    },
    isBookmarked: true,
    tags: [
      { id: "tag-9", label: "Social Media" },
      { id: "tag-10", label: "Marketing" },
      { id: "tag-11", label: "Content Strategy" },
      { id: "tag-12", label: "Analytics" },
    ],
  },
  {
    id: "gig-4",
    image: "/placeholder.svg?height=400&width=600",
    startsAtPrice: 200,
    title: "Mobile App UI/UX Design",
    description:
      "I will design a beautiful, intuitive mobile app interface with user experience best practices and deliver Figma files ready for development.",
    averageRating: 5.0,
    ratingCount: 89,
    category: {
      id: "cat-4",
      label: "UI/UX Design",
      icon: "Smartphone",
      color: "purple",
    },
    seller: {
      id: "seller-4",
      username: "uxmaster",
      avatar: "/placeholder.svg?height=100&width=100",
      firstName: "Emma",
      lastName: "Wilson",
      badge: {
        title: "Expert",
        tier: "platinum",
      },
    },
    isBookmarked: false,
    tags: [
      { id: "tag-13", label: "UI Design" },
      { id: "tag-14", label: "UX Design" },
      { id: "tag-15", label: "Figma" },
      { id: "tag-16", label: "Mobile App" },
    ],
  },
]
