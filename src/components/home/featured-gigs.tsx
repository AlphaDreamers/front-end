import { ArrowRight } from "lucide-react";
import { Prisma } from "@prisma/client";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { cn } from "@/lib/utils";

import GigCard from "../gig-card";

interface FeaturedGigsProps {
  gigs: Prisma.GigGetPayload<{
    select: {
      title: true;
      seller: {
        select: {
          avatar: true;
          username: true;
          badgeProgress: {
            select: {
              isFeatured: true;
              badge: {
                select: {
                  title: true;
                };
              };
            };
          };
        };
      };
      images: {
        select: {
          url: true;
        };
      };
      reviews: {
        select: {
          rating: true;
        };
      };
      tags: {
        select: {
          label: true;
        };
      };
      packages: {
        select: {
          title: true;
          price: true;
          orders: {
            select: {
              id: true;
            };
          };
        };
      };
      description: true;
      id: true;
    };
  }>[];
}

export function FeaturedGigs({ gigs }: FeaturedGigsProps) {
  return (
    <section className="w-full py-16">
      <Carousel className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Featured Gigs</h2>
          <div className="relative pl-10">
            <CarouselPrevious className="absolute right-0" />
            <CarouselNext className="absolute left-0" />
          </div>
        </div>

        <CarouselContent className="-ml-1">
          {gigs.map((gig) => (
            <CarouselItem
              key={gig.id}
              className="pl-1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5"
            >
              <div className="p-1 h-full">
                <GigCard key={gig.id} {...gig} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="mt-4 text-center">
          <Link
            href="/gigs"
            className={cn(
              buttonVariants({
                size: "lg",
                className: "w-full",
              })
            )}
          >
            View All Gigs
            <ArrowRight />
          </Link>
        </div>
      </Carousel>
    </section>
  );
}
