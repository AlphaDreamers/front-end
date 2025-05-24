import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export interface SimilarSellerLinkProps {
  seller: Prisma.UserGetPayload<{
    select: {
      id: true;
      username: true;
      firstName: true;
      lastName: true;
      avatar: true;
      gigs: {
        select: {
          reviews: {
            select: {
              rating: true;
            };
          };
        };
      };
    };
  }>;
}

const SimilarSellerLink = ({
  seller,
}: {
  seller: Prisma.UserGetPayload<{
    select: {
      id: true;
      username: true;
      firstName: true;
      lastName: true;
      avatar: true;
      gigs: {
        select: {
          reviews: {
            select: {
              rating: true;
            };
          };
        };
      };
    };
  }>;
}) => {
  return (
    <Link
      href={`/profile/${seller.username}`}
      key={seller.id}
      className={cn(
        buttonVariants({
          variant: "ghost",
        }),
        "justify-start w-full px-2 h-14"
      )}
    >
      <Image
        src={seller.avatar || "/avatar-fallback.png"}
        alt={`Similar Seller - ${seller.username}`}
        width={40}
        height={40}
        className="object-cover rounded-full border"
      />

      <div>
        <div className="font-medium">
          {seller.firstName} {seller.lastName}
        </div>

        <div className="flex items-center text-xs text-muted-foreground">
          <Star size={12} className="mr-1 text-yellow-500" />
          {(
            seller.gigs.reduce((acc, gig) => {
              const totalReviews = gig.reviews.length;
              const totalRating = gig.reviews.reduce(
                (sum, review) => sum + review.rating,
                0
              );
              return acc + (totalReviews ? totalRating / totalReviews : 0);
            }, 0) / seller.gigs.length
          ).toFixed(1)}{" "}
          ({seller.gigs.reduce((acc, gig) => acc + gig.reviews.length, 0)}{" "}
          reviews)
        </div>
      </div>
    </Link>
  );
};
export default SimilarSellerLink;

export const SimilarSellerLinkSkeleton = () => {
  return <Skeleton className="h-14 w-full rounded-md" />;
};
