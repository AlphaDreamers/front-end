import Link from "next/link";
import { Plus, AlertTriangle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { GigCard } from "@/components/dashboard-gig-card";
import FilterCard from "@/components/filter-card";
import SearchBar from "@/components/search-bar";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/actions";
import { redirect } from "next/navigation";
import Pagination from "@/components/pagination";

export default async function GigsPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    category?: string;
    sort: string;
    page: number;
  }>;
}) {
  const user = await getCurrentUser();

  if (!user?.isVerified) {
    redirect("/sign-in?callback-url=/dashboard/gigs");
  }

  const { query, category, page } = await searchParams;

  const [gigs, gigCnt] = await Promise.all([
    prisma.gig.findMany({
      where: {
        AND: [
          {
            sellerId: user.id,
          },
          {
            OR: [
              {
                title: {
                  contains: query,
                },
              },
              {
                description: {
                  contains: query,
                },
              },
            ],
          },
          {
            category: {
              slug: category,
            },
          },
        ],
      },
      include: {
        reviews: {
          select: {
            rating: true,
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
        category: {
          select: {
            label: true,
          },
        },
        images: {
          select: {
            url: true,
          },
        },
      },
      skip: (page - 1) * 10,
      take: 10,
    }),
    prisma.gig.count({
      where: {
        AND: [
          {
            sellerId: user.id,
          },
          {
            OR: [
              {
                title: {
                  contains: query,
                },
              },
              {
                description: {
                  contains: query,
                },
              },
            ],
          },
          {
            category: {
              slug: category,
            },
          },
        ],
      },
    }),
  ]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Gigs</h1>
          <p className="text-muted-foreground mt-1">
            Manage your service offerings and attract new clients
          </p>
        </div>
        <Link
          href="/dashboard/create"
          className={cn(buttonVariants({}), "md:w-auto w-full")}
        >
          <Plus /> Create New Gig
        </Link>
      </div>

      {gigs.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-muted/50 rounded-lg">
          <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Gigs Found</h2>
          <p className="text-muted-foreground mb-6">
            You haven&apos;t created any gigs yet. Create your first gig to
            start selling your services.
          </p>
          <Link href="/dashboard/create" className={cn(buttonVariants({}))}>
            <Plus className="mr-2 h-4 w-4" /> Create Your First Gig
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-col lg:items-center lg:flex-row gap-2">
            <SearchBar className="flex-1" />
            <FilterCard
              config={[
                {
                  id: "category",
                  label: "Category",
                  type: "combobox",
                  options: [
                    { label: "Web Development", value: "web-development" },
                    { label: "Graphic Design", value: "graphic-design" },
                    { label: "Content Writing", value: "content-writing" },
                  ],
                },
                {
                  id: "sort",
                  type: "checkbox",
                  label: "Sort By",
                  options: [
                    { label: "Newest", value: "newest" },
                    { label: "Oldest", value: "oldest" },
                    { label: "Price High to Low", value: "price_high" },
                    { label: "Price Low to High", value: "price_low" },
                  ],
                },
              ]}
            />
          </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {gigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          )}
        </>
      )}
      <Pagination totalPages={gigCnt / 10} />
    </div>
  );
}
