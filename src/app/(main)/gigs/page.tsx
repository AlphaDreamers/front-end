import GigCard, { GigCardSkeleton } from "@/components/gig/gig-card";
import Pagination from "@/components/pagination";
import SearchBar from "@/components/search-bar";
import Async from "@/components/async";
import PageTemplate from "@/components/templates/page-template";
import Filters, { FilterCardSkeleton } from "@/components/filters";
import { GigSearchParams } from "@/lib/types";
import { fetchGigsWithFilters, getGigFilters } from "@/lib/actions/gigs";

const ITEMS_PER_PAGE = 20;

export default async function BrowseGigsPage({
  searchParams,
}: {
  searchParams: Promise<GigSearchParams>;
}) {
  const params = await searchParams;

  return (
    <PageTemplate
      title="Browse Gigs"
      description="Find top freelance services paid with Solana"
      centered
    >
      <div className="space-y-2 lg:space-y-8">
        <SearchBar containerClassName="mx-auto max-w-3xl" />

        <div className="flex flex-col lg:flex-row gap-8">
          <Async
            fetch={() => getGigFilters({ searchParams: params })}
            fallback={<FilterCardSkeleton />}
          >
            {(filters) => (
              <Filters filters={filters} className="lg:w-72 h-fit" />
            )}
          </Async>

          <div className="flex-1">
            <Async
              fetch={() => fetchGigsWithFilters(params, ITEMS_PER_PAGE)}
              fallback={<GigsSkeleton />}
            >
              {({ gigs, totalPages }) => (
                <>
                  {gigs.length > 0 ? (
                    <>
                      <div className="grid xs:grid-cols-1 lg:grid md:grid-cols-2 2xl:grid-cols-3 gap-4">
                        {gigs.map((gig) => (
                          <GigCard key={gig.id} gig={gig} />
                        ))}
                      </div>
                      <Pagination totalPages={totalPages} />
                    </>
                  ) : (
                    <NoGigsFound />
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
  <div className="grid xs:grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
    {Array.from({ length: 10 }).map((_, index) => (
      <GigCardSkeleton key={index} />
    ))}
  </div>
);

const NoGigsFound = () => (
  <div className="col-span-5 flex flex-col gap-2 items-center justify-center py-16">
    <h1 className="text-2xl font-bold">No gigs found</h1>
    <p className="text-gray-500">Try adjusting your filters or search terms</p>
  </div>
);
