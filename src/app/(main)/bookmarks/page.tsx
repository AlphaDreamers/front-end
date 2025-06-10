import GigCard, { GigCardSkeleton } from "@/components/gig/gig-card";
import Pagination from "@/components/pagination";
import SearchBar from "@/components/search-bar";
import FilterCard, { FilterType } from "@/components/filter-card";
import Async from "@/components/async";

import { me } from "@/lib/actions/auth";
import { getGigs, getGigCount } from "@/lib/actions/gig";
import { buildGigFilters } from "@/lib/utils";
import { GigSearchParams } from "@/lib/types";
import { redirect } from "next/navigation";

const ITEMS_PER_PAGE = 10;

export default async function BookmarksPage({
  searchParams,
}: {
  searchParams: Promise<GigSearchParams>;
}) {
  const { user, error } = await me();

  if (!user?.isVerified) {
    redirect(
      `/sign-in?callback-url=${encodeURIComponent("/bookmarks")}&error=${encodeURIComponent(
        error === "INVALID_TOKEN"
          ? "Invalid token. Please log in again"
          : error === "TOKEN_EXPIRED"
            ? "Your session has expired. Please log in again"
            : "You must be logged in to access this page"
      )}`
    );
  }

  const params = await searchParams;

  const filtersArgs = buildGigFilters(params, ITEMS_PER_PAGE);

  const args = {
    ...filtersArgs,
    where: {
      ...filtersArgs.where,
      bookmarks: {
        some: {
          id: user.id,
        },
      },
    },
  };

  const filters: FilterType[] = [];

  return (
    <div className="space-y-2 lg:space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Your Bookmarked Gigs</h1>
        <SearchBar />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterCard filters={filters} className="lg:w-64 h-fit w-full" />

        <div className="flex-1">
          <Async
            fetch={async () => {
              return await Promise.all([
                getGigs(args),
                getGigCount(args.where),
              ]);
            }}
            fallback={<GigsSkeleton />}
          >
            {([gigs, cnt]) => (
              <>
                {gigs.length > 0 ? (
                  <>
                    <div className="grid xs:grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                      {gigs.map((gig) => (
                        <GigCard key={gig.id} gig={gig} />
                      ))}
                    </div>
                    <Pagination totalPages={Math.ceil(cnt / ITEMS_PER_PAGE)} />
                  </>
                ) : (
                  <div className="col-span-5 flex flex-col gap-2 items-center justify-center py-16">
                    <h1 className="text-2xl font-bold">
                      No bookmarked gigs found
                    </h1>
                    <p className="text-gray-500">
                      Start exploring and bookmark gigs you&apos;re interested
                      in.
                    </p>
                    <p className="text-gray-500">
                      They&apos;ll appear here for easy access.
                    </p>
                  </div>
                )}
              </>
            )}
          </Async>
        </div>
      </div>
    </div>
  );
}

const GigsSkeleton = () => {
  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <GigCardSkeleton key={index} />
      ))}
    </div>
  );
};
