import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import GigCard from "@/components/gig-card";
import Pagination from "@/components/pagination";
import SearchBar from "@/components/search-bar";
import FilterCard from "@/components/filter-card";

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

  const [gigs, cnt] = await Promise.all([
    prisma.gig.findMany({
      select: {
        title: true,
        seller: {
          select: {
            avatar: true,
            username: true,
            badgeProgress: {
              select: {
                isFeatured: true,
                badge: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        },
        images: {
          select: {
            url: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        tags: {
          select: {
            label: true,
          },
        },
        packages: {
          select: {
            title: true,
            price: true,
            orders: {
              select: {
                id: true,
              },
            },
          },
        },
        description: true,
        id: true,
      },
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
