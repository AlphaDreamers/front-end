import Pagination from "@/components/pagination";
import SearchBar from "@/components/search-bar";
import FilterCard, {
  FilterCardSkeletion,
  FilterType,
} from "@/components/filter-card";
import { getDashboardGigs, getGigCount } from "@/lib/actions/gig";
import { buildGigFilters } from "@/lib/utils";
import Async from "@/components/async";
import { GigSearchParams } from "@/lib/types";
import { getKeyValueCategories } from "@/lib/actions/category";
import PageTemplate from "@/components/templates/page-template";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import DashboardGigCard, {
  DashboardGigCardSkeleton,
} from "@/components/gig/dashboard-gig-card";
import { me } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

const ITEMS_PER_PAGE = 20;

export default async function DashboardGigsPage({
  searchParams,
}: {
  searchParams: Promise<GigSearchParams>;
}) {
  const { user } = await me();

  // This is handled by the middleware, but we check here to avoid unnecessary DB calls
  if (!user) {
    redirect(`/sign-in?callback-url=/dashboard/gigs`);
  }
  const params = await searchParams;

  const filtersArgs = buildGigFilters(params, ITEMS_PER_PAGE);

  filtersArgs.where = {
    ...filtersArgs.where,
    sellerId: user.id,
  };

  const getFilters = async (): Promise<FilterType[]> => {
    const categories = await getKeyValueCategories();

    return [
      {
        id: "category",
        label: "Category",
        type: "multi",
        options: categories.map((cat) => ({
          label: cat.label,
          value: cat.value,
        })),
      },
      {
        id: "price",
        label: "Price",
        type: "range",
        min: 0,
        max: 1000,
        step: 10,
      },
      {
        id: "rating",
        label: "Seller Rating",
        type: "select",
        options: [
          { label: "Any", value: "" },
          { label: "1 star & up", value: "1" },
          { label: "2 stars & up", value: "2" },
          { label: "3 stars & up", value: "3" },
          { label: "4 stars & up", value: "4" },
          { label: "5 stars", value: "5" },
        ],
      },
      {
        id: "dateAdded",
        label: "Date Added",
        type: "date",
      },
    ];
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
          <Async fetch={getFilters} fallback={<FilterCardSkeletion />}>
            {(filters) => (
              <FilterCard filters={filters} className="lg:w-64 h-fit w-full" />
            )}
          </Async>

          <div className="flex-1">
            <Async
              fetch={async () => {
                return await Promise.all([
                  getDashboardGigs(filtersArgs),
                  getGigCount(filtersArgs.where),
                ]);
              }}
              fallback={<GigsSkeleton />}
            >
              {([gigs, cnt]) => (
                <>
                  {gigs.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {gigs.map((gig) => (
                          <DashboardGigCard key={gig.id} gig={gig} />
                        ))}
                      </div>
                      <Pagination
                        totalPages={Math.ceil(cnt / ITEMS_PER_PAGE)}
                      />
                    </>
                  ) : (
                    <div className="col-span-5 flex flex-col gap-2 items-center justify-center py-16">
                      <h1 className="text-2xl font-bold">No gigs found</h1>
                      <p className="text-gray-500">Try using fewer keywords</p>
                      <p className="text-gray-500">Remove some filters</p>

                      <p className="text-gray-500">Check for typos</p>
                    </div>
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

const GigsSkeleton = () => {
  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <DashboardGigCardSkeleton key={index} />
      ))}
    </div>
  );
};
