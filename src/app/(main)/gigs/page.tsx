import { prisma } from "@/lib/prisma";

import GigCard from "@/components/gig-card";
import Pagination from "@/components/pagination";
import SearchBar from "@/components/search-bar";
import FilterCard from "@/components/filter-card";
import { Gig } from "@/lib/types";

const ITEMS_PER_PAGE = 10;

interface SearchParams {
  query?: string;
  page?: string;
  category?: string;
  tags?: string[];
  "price-min"?: string;
  "price-max"?: string;
  "deliveryTime-max"?: string;
}

export default async function BrowseGigsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { query } = await searchParams;

  const [gigs = [], cnt = 0] = await Promise.all([
    getFeaturedGigs(),
    prisma.gig.count({
      where: {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            seller: {
              OR: [
                {
                  username: {
                    contains: query,
                  },
                },
                {
                  firstName: {
                    contains: query,
                  },
                },
                {
                  lastName: {
                    contains: query,
                  },
                },
              ],
            },
          },
        ],
      },
    }),
  ]);

  return (
    <div className="space-y-2 lg:space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">
          Explore Top Freelance Services Paid with Solana
        </h1>
        <SearchBar containerClassName="mx-auto max-w-3xl" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterCard config={[]} className="lg:w-64 h-fit w-full" />

        <div className="flex-1">
          <div className="grid xs:grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {gigs.length > 0 ? (
              gigs.map((gig) => <GigCard key={gig.id} gig={gig} />)
            ) : (
              <div className="col-span-5 flex flex-col gap-2 items-center justify-center">
                <h1 className="text-2xl font-bold">
                  No listings found matching your criteria
                </h1>
                <p className="text-gray-500">
                  Try using fewer keywords, removing some filters, or checking
                  for typos.
                </p>
                <p className="text-gray-500">
                  You can also try searching for something else.
                </p>
                <p className="text-gray-500">
                  If you need help, please contact support.
                </p>
              </div>
            )}
          </div>

          <Pagination totalPages={Math.ceil(cnt / ITEMS_PER_PAGE)} />
        </div>
      </div>
    </div>
  );
}

const getFeaturedGigs = async (): Promise<Gig[]> => {
  const gigs = await prisma.gig.findMany({
    take: 10,
    select: {
      id: true,
      packages: {
        select: {
          price: true,
        },
      },
      title: true,
      description: true,
      images: {
        select: {
          isPrimary: true,
          file: {
            select: {
              url: true,
            },
          },
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
      tags: {
        select: {
          title: true,
          id: true,
        },
      },
      seller: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          publicKey: true,
          avatar: true,
          badgeProgress: {
            where: {
              isFeatured: true,
            },
            select: {
              badge: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return gigs.map((gig) => ({
    id: gig.id,
    image:
      gig.images.find((img) => img.isPrimary)?.file.url || "/gig-fallback.png",
    startsAtPrice: gig.packages.reduce(
      (min, pkg) => Math.min(min, pkg.price),
      Infinity
    ),
    title: gig.title,
    description: gig.description,
    ratingCount: gig.reviews.length,
    averageRating:
      gig.reviews.reduce((sum, review) => sum + review.rating, 0) /
      (gig.reviews.length || 1),
    tags: gig.tags.map((tag) => ({
      id: tag.id,
      label: tag.title,
    })),
    seller: {
      id: gig.seller.id,
      username: gig.seller.username,
      firstName: gig.seller.firstName,
      lastName: gig.seller.lastName,
      publicKey: gig.seller.publicKey,
      badge:
        gig.seller.badgeProgress.length > 0
          ? {
              title: gig.seller.badgeProgress[0].badge.title,
            }
          : null,
      avatar: gig.seller.avatar,
    },
  }));
};
