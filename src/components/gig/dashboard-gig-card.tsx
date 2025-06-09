"use client";

import { Edit, Eye, DollarSign, Users, BarChart3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import GigDeleteButton from "./gig-delete-button";
import Rating from "../rating";
import { DashboardGig } from "@/lib/types/gig";

interface DashboardGigCardProps {
  gig: DashboardGig;
}

const DashboardGigCard = ({ gig }: DashboardGigCardProps) => {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300">
      <CardHeader>
        {/* Hero Image */}
        <div className="relative aspect-video -mx-6 -mt-6 mb-6 min-w-[calc(100%+48px)] overflow-hidden">
          <Image
            src={gig.image}
            alt={gig.title}
            width={400}
            height={240}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div>
          {/* Category and Views */}
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className="text-xs font-medium">
              {gig.category.label}
            </Badge>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{(2847).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <CardTitle className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {gig.title}
          </CardTitle>

          {/* Description */}
          <CardDescription className="text-sm line-clamp-4 mb-4">
            {gig.description}
          </CardDescription>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Rating rating={gig.averageRating} />
              <span className="text-sm font-medium">
                {gig.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({gig.ratingCount} reviews)
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="mt-auto">
        {/* Performance Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center size-12 bg-secondary rounded-full mx-auto mb-1">
              <Users className="text-chart-3" />
            </div>
            <div className="text-lg font-semibold text-muted-foreground">
              {gig.totalOrders}
            </div>
            <div className="text-xs text-muted-foreground">Orders</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center size-12 bg-secondary rounded-full mx-auto mb-2">
              <DollarSign className="text-chart-4" />
            </div>
            <div className="text-lg font-semibold text-muted-foreground">
              {(1766.5).toFixed(1)} SOL
            </div>
            <div className="text-xs text-muted-foreground">Revenue</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center size-12 bg-secondary rounded-full mx-auto mb-2">
              <BarChart3 className="text-chart-5" />
            </div>
            <div className="text-lg font-semibold text-muted-foreground">
              {(15420).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Impressions</div>
          </div>
        </div>

        {/* Package Overview */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-muted-foreground">
              Packages
            </h4>
            <span className="text-xs text-muted-foreground">
              {gig.packages.length} tiers
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {gig.packages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex items-center justify-between p-3 bg-muted rounded"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{pkg.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {pkg.orderCnt} sold
                    </Badge>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold">{pkg.price} SOL</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Link
          href={`/dashboard/gigs/${gig.id}/edit`}
          className={buttonVariants({
            variant: "default",
            className: "flex-1",
          })}
        >
          <Edit />
          Edit Gig
        </Link>

        <Link
          href={`/gigs/${gig.id}`}
          className={buttonVariants({
            variant: "outline",
            className: "flex-1",
          })}
        >
          <Eye />
          Preview
        </Link>

        <GigDeleteButton gigId={gig.id} />
      </CardFooter>
    </Card>
  );
};

export default DashboardGigCard;

export const DashboardGigCardSkeleton = () => {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="relative aspect-video -mx-6 -mt-6 mb-6 min-w-[calc(100%+48px)] bg-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-gray-200 rounded" />
          <div className="h-3 w-1/2 bg-gray-200 rounded" />
          <div className="h-3 w-1/3 bg-gray-200 rounded" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-gray-200 h-12 rounded" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
