import Pagination from "@/components/pagination";
import SearchBar from "@/components/search-bar";
import FilterCard, { FilterCardSkeleton } from "@/components/filters";
import Async from "@/components/async";
import PageTemplate from "@/components/templates/page-template";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import DashboardGigCard, {
  DashboardGigCardSkeleton,
} from "@/components/gig/dashboard-gig-card";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { fetchDashboardGigs, getGigFilters } from "@/lib/actions/gigs";
import { GigSearchParams } from "@/lib/types";

const ITEMS_PER_PAGE = 20;

export default async function DashboardGigsPage({
  searchParams,
}: {
  searchParams: Promise<GigSearchParams>;
}) {
  const session = await auth();

  if (!session) {
    redirect(`/sign-in?callback-url=/dashboard/gigs`);
  }

  const params = await searchParams;

  // Fetch seller's gigs with dashboard-specific data
  const fetchSellerGigs = async () => {
    const result = await fetchDashboardGigs(params, ITEMS_PER_PAGE, {
      sellerId: session.user.id,
    });
    return result;
  };

  // Get filters for seller's gigs
  const fetchSellerFilters = async () => {
    return getGigFilters({
      searchParams: params,
      additionalWhere: { sellerId: session.user.id },
    });
  };

  return (
    <PageTemplate
      title="My Gigs"
      description="Manage your service offerings and attract new clients"
      actionComponent={
        <Link
          href="/dashboard/gigs/create"
          className={cn(buttonVariants({}), "md:w-auto w-full")}
        >
          <Plus /> Create New Gig
        </Link>
      }
    >
      <div className="space-y-2 lg:space-y-8">
        <SearchBar containerClassName="mx-auto max-w-3xl" />

        <div className="flex flex-col lg:flex-row gap-8">
          <Async fetch={fetchSellerFilters} fallback={<FilterCardSkeleton />}>
            {(filters) => (
              <FilterCard filters={filters} className="lg:w-64 h-fit w-full" />
            )}
          </Async>

          <div className="flex-1">
            <Async fetch={fetchSellerGigs} fallback={<GigsSkeleton />}>
              {({ gigs, totalPages }) => (
                <>
                  {gigs.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {gigs.map((gig) => (
                          <DashboardGigCard key={gig.id} gig={gig} />
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
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    {Array.from({ length: 6 }).map((_, index) => (
      <DashboardGigCardSkeleton key={index} />
    ))}
  </div>
);

const NoGigsFound = () => (
  <div className="flex flex-col gap-4 items-center justify-center py-16 text-center">
    <h2 className="text-2xl font-bold">No gigs yet</h2>
    <p className="text-gray-500 max-w-md">
      Create your first gig to start offering services
    </p>
    <Link
      href="/dashboard/gigs/create"
      className={buttonVariants({ variant: "default" })}
    >
      <Plus /> Create Your First Gig
    </Link>
  </div>
);
