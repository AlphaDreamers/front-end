"use client";

import {
  Card,
  CardContent,
  CardFooter,
  Input,
  Popover,
  PopoverAnchor,
  PopoverContent,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  ChevronRight,
  Clock,
  ClockIcon,
  MessageSquare,
  Search,
  Star,
  StarIcon,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";

export default function Page() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverAnchor className="flex items-center relative">
          <Button
            className="rounded-r-none absolute size-[46px] left-px rounded-l-[5px]"
            variant="secondary"
            size="icon"
          >
            <Search className="size-6 text-muted-foreground" />
          </Button>

          <Input className="h-12 pl-14" />
        </PopoverAnchor>

        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2">
          <Tabs className="w-full" defaultValue="gigs">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="gigs">Gigs</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            {/* Gigs Tab Content */}
            <TabsContent value="gigs">
              <ScrollArea className="h-[300px] w-full">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <Card key={`gig-${index}`} className="py-2">
                      <CardContent className="px-2 flex items-center gap-2">
                        <div className="relative w-fit mr-4">
                          <Image
                            src="https://picsum.photos/seed/picsum/200/300"
                            alt="Placeholder"
                            width={100}
                            height={100}
                            className="rounded-lg border object-cover size-14"
                          />
                          <Image
                            src="https://picsum.photos/seed/picsum/200/300"
                            alt="User Avatar"
                            width={40}
                            height={40}
                            className="absolute rounded-full top-1/2 right-0 translate-x-1/2 -translate-y-1/2 object-cover size-10 border border-primary"
                          />
                        </div>

                        <div className="flex flex-col">
                          <h3 className="text-sm font-semibold">Gig Title</h3>
                          <p className="text-xs text-muted-foreground">
                            Gig description goes here.
                          </p>
                        </div>

                        <div className="flex flex-col items-end ml-auto space-y-1">
                          <Badge variant="outline" className="text-xs">
                            $100
                          </Badge>

                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-0.5">
                              <Star className="size-3" />
                              <span>4.5</span>
                            </div>
                            <div className="flex items-center space-x-0.5">
                              <Clock className="size-3" />
                              <span>2d</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Categories Tab Content */}
            <TabsContent value="categories">
              <ScrollArea className="h-[300px] w-full">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categories.map((category) => (
                    <Card key={`category-${category.id}`} className="py-2">
                      <CardContent className="px-2 flex items-center gap-2">
                        <div className="flex items-center justify-center rounded-lg border text-3xl size-14">
                          {category.icon}
                        </div>

                        <div className="flex flex-col">
                          <h3 className="text-sm font-semibold">
                            {category.name}
                          </h3>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Briefcase className="size-3 mr-1" />
                            <span>{category.count} gigs</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end ml-auto space-y-1">
                          <Badge
                            variant={category.popular ? "default" : "outline"}
                            className="text-xs"
                          >
                            {category.popular
                              ? "Popular"
                              : `~${category.avgPrice} ETH`}
                          </Badge>

                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <TrendingUp
                              className={`size-3 ${
                                category.trend === "up"
                                  ? "text-green-500"
                                  : "text-gray-400"
                              }`}
                            />
                            <ChevronRight className="size-3" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Users Tab Content */}
            <TabsContent value="users">
              <ScrollArea className="h-[300px] w-full">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {users.map((user) => (
                    <Card key={`user-${user.id}`} className="py-2">
                      <CardContent className="px-2 flex items-center gap-2">
                        <div className="relative w-fit mr-4">
                          <Image
                            src={user.avatar}
                            alt={`${user.name}'s Avatar`}
                            width={100}
                            height={100}
                            className="rounded-lg border object-cover size-14"
                          />
                          {user.verified && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5 border border-white">
                              <svg
                                className="size-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                              </svg>
                            </div>
                          )}
                          {user.active && (
                            <div className="absolute bottom-0 right-0 bg-green-500 rounded-full size-2.5 border border-white" />
                          )}
                        </div>

                        <div className="flex flex-col">
                          <h3 className="text-sm font-semibold">{user.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {user.specialty}
                          </p>
                        </div>

                        <div className="flex flex-col items-end ml-auto space-y-1">
                          <div className="flex items-center">
                            <Star className="size-3 text-yellow-500 mr-0.5" />
                            <span className="text-xs font-medium">
                              {user.rating}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Briefcase className="size-3 mr-0.5" />
                              <span>{user.completedJobs}</span>
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="size-3 mr-0.5" />
                              <span>{user.responseTime}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </>
  );
}

const categories = [
  {
    id: 1,
    name: "Smart Contract Development",
    icon: "💻",
    count: 142,
    trend: "up",
    avgPrice: 0.18,
    popular: true,
  },
  {
    id: 2,
    name: "NFT Creation & Minting",
    icon: "🎨",
    count: 98,
    trend: "up",
    avgPrice: 0.15,
    popular: true,
  },
  {
    id: 3,
    name: "DeFi Protocol Building",
    icon: "🏦",
    count: 73,
    trend: "up",
    avgPrice: 0.45,
    popular: false,
  },
  {
    id: 4,
    name: "Blockchain Security Audits",
    icon: "🔒",
    count: 51,
    trend: "up",
    avgPrice: 0.22,
    popular: true,
  },
  {
    id: 5,
    name: "Crypto Marketing",
    icon: "📣",
    count: 87,
    trend: "stable",
    avgPrice: 0.12,
    popular: false,
  },
  {
    id: 6,
    name: "Web3 Frontend Integration",
    icon: "🖥️",
    count: 64,
    trend: "up",
    avgPrice: 0.16,
    popular: false,
  },
  {
    id: 7,
    name: "DAO Development",
    icon: "👥",
    count: 29,
    trend: "up",
    avgPrice: 0.32,
    popular: false,
  },
  {
    id: 8,
    name: "Tokenomics Design",
    icon: "📊",
    count: 45,
    trend: "up",
    avgPrice: 0.17,
    popular: true,
  },
  {
    id: 9,
    name: "Crypto Whitepaper Writing",
    icon: "📝",
    count: 56,
    trend: "stable",
    avgPrice: 0.1,
    popular: false,
  },
  {
    id: 10,
    name: "Cross-Chain Solutions",
    icon: "🌉",
    count: 31,
    trend: "up",
    avgPrice: 0.4,
    popular: false,
  },
];

// Sample users data
const users = [
  {
    id: 1,
    name: "CryptoDevPro",
    avatar: "https://picsum.photos/seed/user1/200/300",
    specialty: "Smart Contract Expert",
    rating: 4.9,
    completedJobs: 127,
    responseTime: "2h",
    verified: true,
    active: true,
  },
  {
    id: 2,
    name: "BlockchainNinja",
    avatar: "https://picsum.photos/seed/user2/200/300",
    specialty: "Full-Stack Blockchain Developer",
    rating: 5.0,
    completedJobs: 93,
    responseTime: "1h",
    verified: true,
    active: true,
  },
  {
    id: 3,
    name: "SecurityAuditor",
    avatar: "https://picsum.photos/seed/user3/200/300",
    specialty: "Security Specialist",
    rating: 4.8,
    completedJobs: 215,
    responseTime: "3h",
    verified: true,
    active: true,
  },
  {
    id: 4,
    name: "NFTartistPro",
    avatar: "https://picsum.photos/seed/user4/200/300",
    specialty: "NFT Artist & Developer",
    rating: 4.7,
    completedJobs: 84,
    responseTime: "4h",
    verified: true,
    active: false,
  },
  {
    id: 5,
    name: "TokenEconomist",
    avatar: "https://picsum.photos/seed/user5/200/300",
    specialty: "Tokenomics Designer",
    rating: 4.6,
    completedJobs: 49,
    responseTime: "3h",
    verified: false,
    active: true,
  },
  {
    id: 6,
    name: "Web3Designer",
    avatar: "https://picsum.photos/seed/user6/200/300",
    specialty: "Frontend & UX for Web3",
    rating: 4.9,
    completedJobs: 76,
    responseTime: "1h",
    verified: true,
    active: true,
  },
  {
    id: 7,
    name: "DAOexpert",
    avatar: "https://picsum.photos/seed/user7/200/300",
    specialty: "DAO Structure & Governance",
    rating: 4.8,
    completedJobs: 38,
    responseTime: "5h",
    verified: false,
    active: true,
  },
  {
    id: 8,
    name: "CryptoMarketer",
    avatar: "https://picsum.photos/seed/user8/200/300",
    specialty: "Marketing & Community Building",
    rating: 4.7,
    completedJobs: 114,
    responseTime: "2h",
    verified: true,
    active: true,
  },
  {
    id: 9,
    name: "SolidityPro",
    avatar: "https://picsum.photos/seed/user9/200/300",
    specialty: "Solidity & EVM Expert",
    rating: 5.0,
    completedJobs: 67,
    responseTime: "1h",
    verified: true,
    active: false,
  },
  {
    id: 10,
    name: "BridgeBuilder",
    avatar: "https://picsum.photos/seed/user10/200/300",
    specialty: "Cross-Chain Solutions",
    rating: 4.9,
    completedJobs: 42,
    responseTime: "4h",
    verified: true,
    active: true,
  },
];
