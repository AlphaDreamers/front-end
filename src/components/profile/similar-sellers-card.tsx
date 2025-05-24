import { Prisma } from "@prisma/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import SimilarSellerLink, {
  SimilarSellerLinkSkeleton,
} from "@/components/profile/similar-seller-link";
import Async from "../async";

type SimilarSeller = Prisma.UserGetPayload<{
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

interface SimilarSellerCardProps {
  getSimilarSellers: () => Promise<SimilarSeller[]>;
}

const SimilarSellersCard = ({ getSimilarSellers }: SimilarSellerCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Similar Sellers</CardTitle>
        <CardDescription>
          Explore other sellers with similar skills and offerings.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <Async
          fetch={getSimilarSellers}
          fallback={<SimilarSellersCardSkeleton />}
        >
          {(sellers) =>
            sellers.map((seller) => (
              <SimilarSellerLink seller={seller} key={seller.id} />
            ))
          }
        </Async>
      </CardContent>
    </Card>
  );
};

export default SimilarSellersCard;

const SimilarSellersCardSkeleton = () => {
  return Array.from({ length: 3 }).map((_, index) => (
    <SimilarSellerLinkSkeleton key={index} />
  ));
};
