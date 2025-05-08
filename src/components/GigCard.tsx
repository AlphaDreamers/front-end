import { Star, ShoppingCart, Eye, Award } from "lucide-react";
import { Prisma } from "@prisma/client";
import Image from "next/image";

import { Card, CardContent, CardFooter, CardHeader } from "./ui";
import { Button, buttonVariants } from "./ui/button";
import { Badge } from "./ui/badge";
import Link from "next/link";

export default function GigCard(
  gig: Prisma.GigGetPayload<{
    include: {
      seller: {
        include: {
          badges: {
            include: {
              badge: true;
            };
          };
        };
      };
      packages: {
        include: {
          orders: {
            include: {
              review: true;
            };
          };
        };
      };
      images: true;
      tags: true;
    };
  }>
) {
  const feautedBadge = gig.seller.badges.find(
    (badge) => badge.isFeatured === true
  );

  return (
    <Card className="overflow-hidden hover:border-primary transition-all duration-300">
      {/* Image with price overlay */}
      <CardHeader className="relative">
        <Image
          src={gig.images[0].url}
          width={200}
          height={200}
          alt={gig.title}
          className="-mt-6 -mx-6 min-w-[calc(100%+48px)] h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          <div className="flex items-center">
            <Image
              src={gig.seller.avatar || "/avatar-fallback.png"}
              alt={gig.seller.firstName + " " + gig.seller.lastName}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border-1 border-primary"
            />
            <div className="ml-2">
              <p className="text-foreground text-sm font-medium">
                {gig.seller.firstName + " " + gig.seller.lastName}
              </p>
              <p className="text-muted-foreground text-xs">
                {gig.seller.username}
              </p>
            </div>
            {feautedBadge && (
              <Badge className="ml-auto">
                <Star />
                {feautedBadge.badge.label}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Content section */}
      <CardContent>
        <div className="flex items-center mb-3 text-xs text-gray-400">
          <div className="flex items-center mr-3">
            <Star className="w-3 h-3 text-primary mr-1" />
            <span>{gig.averageRating.toFixed(2)}</span>
          </div>
          <div className="flex items-center mr-3">
            <Award className="w-3 h-3 text-primary mr-1" />
            <span className="text-muted-foreground">({gig.ratingCount})</span>
          </div>
          <div className="flex items-center mr-3 ml-auto">
            <Eye className="w-3 h-3 mr-1" />
            <span>{gig.viewCount}</span>
          </div>
        </div>

        <h3 className="font-medium mb-3 line-clamp-2">{gig.title}</h3>

        <p className="text-muted-foreground text-xs mb-4 line-clamp-3">
          {gig.description}
        </p>

        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {gig.tags.map((tag, index) => (
            <Badge variant="outline" key={index} className="text-chart-3">
              {tag.label}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="justify-between mt-auto">
        <div className="text-primary font-bold text-xl">
          {gig.packages[0].price} SOL
        </div>

        <Link
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "flex items-center gap-2",
          })}
          href={`/gigs/${gig.id}`}
        >
          <Eye />
          View
        </Link>
      </CardFooter>
    </Card>
  );
}
