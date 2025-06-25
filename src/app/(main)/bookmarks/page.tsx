import GigCard, { GigCardSkeleton } from "@/components/gig/gig-card";
import Pagination from "@/components/pagination";
import SearchBar from "@/components/search-bar";
import  { FilterCardSkeleton } from "@/components/filters";
import Async from "@/components/async";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PageTemplate from "@/components/templates/page-template";
import { fetchGigsWithFilters, getGigFilters } from "@/lib/actions/gigs";
import { GigSearchParams } from "@/lib/types";
import Filters from "@/components/filters";

const ITEMS_PER_PAGE = 10;

export default async function BookmarksPage({
  searchParams,
}: {
  searchParams: Promise<GigSearchParams>;
}) {
  const session = await auth();

  if (!session) {
    redirect(`/sign-in?callback-url=/bookmarks`);
  }

  const params = await searchParams;

  // Simple wrapper to fetch only bookmarked gigs
  const fetchBookmarkedGigs = async () => {
    const result = await fetchGigsWithFilters(params, ITEMS_PER_PAGE, {
      additionalWhere: {
        bookmarks: {
          some: {
            id: session.user.id,
          },
        },
      },
    });
    return result;
  };

  console.log(
    await getGigFilters({
      searchParams: params,
      userId: session.user.id,
    })
  );

  return (
    <PageTemplate
      title="Your Bookmarked Gigs"
      description="Explore the gigs you've bookmarked for easy access."
      centered
    >
      <div className="space-y-2 lg:space-y-8">
        <SearchBar containerClassName="mx-auto max-w-3xl" />

        <div className="flex flex-col lg:flex-row gap-8">
          <Async
            fetch={() =>
              getGigFilters({
                searchParams: params,
                userId: session.user.id,
              })
            }
            fallback={<FilterCardSkeleton />}
          >
            {(filters) => (
              <Filters filters={filters} className="lg:w-64 h-fit w-full" />
            )}
          </Async>

          <div className="flex-1">
            <Async fetch={fetchBookmarkedGigs} fallback={<GigsSkeleton />}>
              {({ gigs, totalPages }) => (
                <>
                  {gigs.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {gigs.map((gig) => (
                          <GigCard key={gig.id} gig={gig} />
                        ))}
                      </div>
                      <Pagination totalPages={totalPages} />
                    </>
                  ) : (
                    <NoBookmarksFound />
                  )}
                </>
              )}
            </Async>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}

const GigsSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    {Array.from({ length: 6 }).map((_, index) => (
      <GigCardSkeleton key={index} />
    ))}
  </div>
);

const NoBookmarksFound = () => (
  <div className="flex flex-col gap-4 items-center justify-center py-16 text-center">
    <h2 className="text-2xl font-bold">No bookmarked gigs yet</h2>
    <p className="text-gray-500 max-w-md">
      Start exploring gigs and bookmark your favorites to see them here.
    </p>
    <a href="/browse" className="text-primary hover:underline">
      Browse gigs
    </a>
  </div>
);
