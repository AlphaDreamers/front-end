"use client";

import { useState } from "react";
import {
  User,
  Star,
  Shield,
  Award,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import Rating from "@/components/Rating";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import GigCardDesign from "@/components/GigCard";

export default function ProfileHeader1() {
  const user = {
    username: "CryptoVisionPro",
    displayName: "Alex Thompson",
    avatar: "https://picsum.photos/seed/picsum/201/300",
    coverImage: "/api/placeholder/800/200",
    verified: true,
    joinDate: "May 2023",
    rating: 4.9,
    reviews: 156,
    completedProjects: 89,
    bio: "Blockchain developer specializing in Solana smart contracts and DeFi solutions. Passionate about creating secure and efficient decentralized applications.",
    walletAddress: "8xGz...9j4K",
    badges: ["Top Seller", "Quick Responder"],
  };

  return (
    <main>
      <div className="flex items-center gap-6">
        <Image
          src={user.avatar}
          width={128}
          height={128}
          className="size-32 rounded-full object-cover border-2 border-primary"
        />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">{user.displayName}</h1>
            <span className="text-muted-foreground text-sm">
              @{user.username}
            </span>
          </div>

          <div className="flex flex-col text-sm text-muted-foreground">
            <div className="flex gap-1 items-center">
              <User size={14} />
              <span>Member since {user.joinDate}</span>
            </div>

            <div className="flex gap-1 items-center">
              <Rating rating={user.rating} size={16} />
              <span>{user.rating}</span>

              <span>({user.reviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex mt-8 gap-2">
        {user.badges.map((badge, index) => (
          <Badge
            key={index}
            variant="outline"
            className="bg-gradient-to-r from-chart-2 to-chart-1 border-l-chart-2 border-r-chart-1"
          >
            <Award size={12} />
            {badge}
          </Badge>
        ))}
      </div>

      <div className="mt-4 text-muted-foreground">
        <p>{user.bio}</p>
      </div>

      <Card className="py-4 mt-6">
        <CardContent className="flex flex-row px-0">
          <div className="text-center flex-1">
            <p className="font-bold text-primary">{user.completedProjects}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>

          <Separator orientation="vertical" className="bg-primary-foreground" />

          <div className="text-center flex-1">
            <p className="font-bold text-primary">{816}</p>
            <p className="text-sm text-muted-foreground">Reviews</p>
          </div>

          <Separator orientation="vertical" className="bg-primary-foreground" />

          <div className="text-center flex-1">
            <div className="flex items-center justify-center">
              <Star size={16} className="text-primary fill-primary" />
              <span className="ml-1 font-bold text-primary">{user.rating}</span>
            </div>

            <p className="text-sm text-muted-foreground">Rating</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="overview"></TabsContent>
        <TabsContent
          value="services"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <GigCardDesign
              key={i}
              title="NFT Collection Creation & Launch"
              description="Complete NFT collection development, from artwork to smart contracts and marketplace listing"
              level="Expert"
              experience="4+ years"
              completedProjects={47}
              deliveryTime="7 days"
              startingPrice={3.5}
              currency="SOL"
              sellerName="NFT_Master"
              sellerAvatar="https://picsum.photos/seed/picsum/200/300"
              popularityScore={98}
            />
          ))}
        </TabsContent>
        <TabsContent value="portfolio"></TabsContent>
        <TabsContent value="reviews"></TabsContent>
        <TabsContent value="projects"></TabsContent>
      </Tabs>
    </main>
  );
}
