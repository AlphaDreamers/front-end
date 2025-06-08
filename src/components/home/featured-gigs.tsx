import { ArrowRight } from "lucide-react";
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

import GigCard, { GigCardSkeleton } from "../gig/gig-card";
import { Gig } from "@/lib/types";
import Async from "../async";

interface FeaturedGigsProps {
  getFeaturedGigs: () => Promise<Gig[]>;
}

export function FeaturedGigs({ getFeaturedGigs }: FeaturedGigsProps) {
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
          <Async fetch={getFeaturedGigs} fallback={<FeaturedGigsSkeleton />}>
            {(gigs) =>
              gigs.length !== 0 ? (
                gigs.map((gig) => (
                  <CarouselItem
                    key={gig.id}
                    className="pl-1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5"
                  >
                    <div className="p-1 h-full">
                      <GigCard key={gig.id} gig={gig} />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-80">
                  <h4 className="text-xl font-semibold text-muted-foreground">
                    No featured gigs available at the moment.
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Check back later or explore other categories.
                  </p>
                </div>
              )
            }
          </Async>
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

const FeaturedGigsSkeleton = () => {
  return Array.from({ length: 10 }).map((_, index) => (
    <CarouselItem
      key={index}
      className="pl-1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5"
    >
      <div className="p-1 h-full">
        <GigCardSkeleton />
      </div>
    </CarouselItem>
  ));
};
