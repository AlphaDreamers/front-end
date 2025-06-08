import Link from "next/link";
import { Plus, AlertTriangle } from "lucide-react";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import DashboardGigCard from "@/components/gig/dashboard-gig-card";
import Filters from "@/components/filter-card";
import SearchBar from "@/components/search-bar";
import { prisma } from "@/lib/prisma";
import { me } from "@/lib/actions/auth";
import Pagination from "@/components/pagination";
import { DashboardGig, GigSearchParams } from "@/lib/types";

const GIGS_PER_PAGE = 10;

export default async function GigsPage({
  searchParams,
}: {
  searchParams: Promise<GigSearchParams>;
}) {
  const user = await me();

  if (!user?.isVerified) {
    redirect("/sign-in?callback-url=/dashboard/gigs");
  }

  const params = await searchParams;

  const filters = {
    search: params.q,
    category: params.category,
    minPrice: params["price-min"] ? Number(params["price-min"]) : undefined,
    maxPrice: params["price-max"] ? Number(params["price-max"]) : undefined,
    minRating: params.rating ? Number(params.rating) : undefined,
    hasOrders: params.hasOrders === "true",
    sortBy: params.sortBy,
    page: params.page ? Number(params.page) : 1,
  };

  const [{ gigs, total }, categories, priceRange] = await Promise.all([
    getMyFilteredGigs(user.id, filters),
    getCategories(),
    getPriceRange(user.id),
  ]);

  const filterConfig = [
    {
      id: "category",
      label: "Category",
      type: "select" as const,
      options: categories.map((cat) => ({
        label: cat.title,
        value: cat.id,
      })),
    },
    {
      id: "price",
      label: "Price Range",
      type: "range" as const,
      min: priceRange.min,
      max: priceRange.max,
      step: 10,
    },
    {
      id: "rating",
      label: "Minimum Rating",
      type: "select" as const,
      options: [
        { label: "4+ Stars", value: "4" },
        { label: "3+ Stars", value: "3" },
        { label: "2+ Stars", value: "2" },
        { label: "1+ Stars", value: "1" },
      ],
    },
    {
      id: "hasOrders",
      label: "Has Orders Only",
      type: "toggle" as const,
    },
    {
      id: "sortBy",
      label: "Sort By",
      type: "select" as const,
      options: [
        { label: "Newest First", value: "newest" },
        { label: "Oldest First", value: "oldest" },
        { label: "Most Orders", value: "most-orders" },
        { label: "Highest Price", value: "highest-price" },
      ],
    },
  ];

  return (
    <main className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Gigs</h1>
          <p className="text-muted-foreground mt-1">
            Manage your service offerings and attract new clients
          </p>
        </div>
        <Link
          href="/dashboard/gigs/create"
          className={cn(buttonVariants({}), "md:w-auto w-full")}
        >
          <Plus /> Create New Gig
        </Link>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4">
        {/* Search bar */}
        <SearchBar placeholder="Search your gigs..." className="w-full" />

        {/* Filters - on desktop they show inline, on mobile as a sheet */}
        <div className="lg:hidden">
          <Filters filters={filterConfig} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop filters sidebar */}
        <div className="hidden lg:block">
          <Filters filters={filterConfig} />
        </div>

        {/* Gigs grid */}
        <div className="lg:col-span-3">
          {gigs.length === 0 ? (
            <div className="text-center py-12 border border-muted/30 rounded-lg">
              <AlertTriangle className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <h2 className="text-lg font-semibold mb-1">No Matching Gigs</h2>
              <p className="text-muted-foreground">
                No gigs match your current filters. Try adjusting your search
                criteria.
              </p>
            </div>
          ) : (
            <>
              {/* Results count */}
              <p className="text-sm text-muted-foreground mb-4">
                Showing {gigs.length} of {total} gigs
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {gigs.map((gig) => (
                  <DashboardGigCard key={gig.id} gig={gig} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Pagination
        totalPages={Math.ceil(total / GIGS_PER_PAGE)}
        className="mt-auto"
      />
    </main>
  );
}

// Clean function to get filtered gigs based on your schema and requirements
const getMyFilteredGigs = async (
  userId: string,
  filters: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    hasOrders?: boolean;
    sortBy?: string;
    page: number;
  }
): Promise<{ gigs: DashboardGig[]; total: number }> => {
  // Calculate pagination offset
  const skip = (filters.page - 1) * GIGS_PER_PAGE;

  // Build the base where clause - this handles all filters except rating
  const where: Prisma.GigWhereInput = {
    sellerId: userId,
  };

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.category) {
    where.categoryId = filters.category;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    const priceConditions: Prisma.PackageWhereInput[] = [];

    if (filters.minPrice !== undefined) {
      priceConditions.push({ price: { gte: filters.minPrice } });
    }
    if (filters.maxPrice !== undefined) {
      priceConditions.push({ price: { lte: filters.maxPrice } });
    }

    where.packages = {
      some: {
        AND: priceConditions,
      },
    };
  }

  if (filters.hasOrders) {
    where.orders = {
      some: {},
    };
  }

  if (filters.minRating !== undefined) {
    where.reviews = {
      some: {},
    };
  }

  let orderBy: Prisma.GigOrderByWithRelationInput = { createdAt: "desc" }; // Default to newest first

  switch (filters.sortBy) {
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "most-orders":
      orderBy = { orders: { _count: "desc" } };
      break;
    case "highest-price":
      orderBy = { packages: { _max: { price: "desc" } } };
      break;
  }

  const fetchLimit =
    filters.minRating !== undefined ? GIGS_PER_PAGE * 3 : GIGS_PER_PAGE;
  const fetchSkip = filters.minRating !== undefined ? 0 : skip;

  const [totalCount, rawGigs] = await Promise.all([
    prisma.gig.count({ where }),

    prisma.gig.findMany({
      where,
      orderBy,
      skip: fetchSkip,
      take: fetchLimit,
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        images: {
          where: { isPrimary: true },
          select: {
            file: {
              select: { url: true },
            },
          },
        },
        _count: {
          select: { orders: true },
        },
        packages: {
          select: {
            price: true,
            title: true,
            id: true,
            _count: {
              select: { orders: true },
            },
          },
        },
        reviews: {
          select: { rating: true },
        },
        category: {
          select: {
            title: true,
            id: true,
            color: true,
            icon: true,
            _count: {
              select: { gigs: true },
            },
          },
        },
      },
    }),
  ]);

  const transformedGigs = rawGigs.map((gig) => {
    // Calculate average rating from all reviews
    const averageRating =
      gig.reviews.length > 0
        ? gig.reviews.reduce((sum, review) => sum + review.rating, 0) /
          gig.reviews.length
        : 0;

    return {
      id: gig.id,
      image: gig.images[0]?.file.url || "/gig-fallback.png",
      startsAtPrice: Math.min(...gig.packages.map((pkg) => pkg.price)),
      title: gig.title,
      description: gig.description,
      ratingCount: gig.reviews.length,
      averageRating,
      category: {
        id: gig.category.id,
        label: gig.category.title,
        icon: gig.category.icon,
        color: gig.category.color,
        gigsCnt: gig.category._count.gigs,
      },
      packages: gig.packages.map((pkg) => ({
        id: pkg.id,
        title: pkg.title,
        price: pkg.price,
        orderCnt: pkg._count.orders,
      })),
      totalOrders: gig._count.orders,
    };
  });

  let finalGigs = transformedGigs;
  let finalTotal = totalCount;

  if (filters.minRating !== undefined) {
    const ratingFilteredGigs = transformedGigs.filter(
      (gig) => gig.averageRating >= filters.minRating!
    );

    finalGigs = ratingFilteredGigs.slice(skip, skip + GIGS_PER_PAGE);

    finalTotal = Math.floor(
      totalCount * (ratingFilteredGigs.length / transformedGigs.length)
    );
  }

  return {
    gigs: finalGigs as DashboardGig[],
    total: finalTotal,
  };
};

// Helper function to get all categories for the filter
const getCategories = async () => {
  return prisma.category.findMany({
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      title: "asc",
    },
  });
};

// Helper function to get price range for the current user's gigs
const getPriceRange = async (userId: string) => {
  const result = await prisma.package.aggregate({
    where: {
      gig: {
        sellerId: userId,
      },
    },
    _min: { price: true },
    _max: { price: true },
  });

  return {
    min: result._min.price || 0,
    max: result._max.price || 1000,
  };
};
