import FilterCard from "@/components/FilterCard";
import GigCard from "@/components/GigCard";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import { Prisma, PrismaClient } from "@prisma/client";

const ITEMS_PER_PAGE = 10;

const prisma = new PrismaClient();

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    page?: number;
    sort?: string;
    "price-min"?: number;
    "price-max"?: number;
    "rating-min"?: number;
    "rating-max"?: number;
    "created-after"?: Date;
  }>;
}) {
  const filters = await searchParams;

  const gigs = await getFilteredGigs(filters);

  const gigCnt = await prisma.gig.count();

  return (
    <main className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <SearchBar />
        <FilterCard
          config={[
            {
              id: "sort",
              label: "Sort By",
              options: [
                { value: "relevance", label: "Relevance" },
                { value: "rating-desc", label: "Highest Rating" },
                { value: "price-asc", label: "Lowest Price" },
                { value: "price-desc", label: "Highest Price" },
                { value: "delivery-asc", label: "Fastest Delivery" },
                { value: "newest", label: "Newest" },
              ],
              type: "radio",
            },
            {
              id: "price",
              label: "Budget",
              min: 5,
              max: 500,
              step: 5,
              type: "slider",
            },
            {
              id: "rating",
              label: "Rating",
              min: 1,
              max: 5,
              step: 0.1,
              type: "slider",
            },
            {
              id: "created-after",
              label: "Created After",
              min: new Date("2024-01-01"),
              max: new Date(),
              type: "date",
            },
          ]}
        />
      </div>

      <div className="grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {gigs.map((gig) => (
          <GigCard key={gig.id} {...gig} />
        ))}
      </div>
      <Pagination totalPages={Math.ceil(gigCnt / ITEMS_PER_PAGE)} />
    </main>
  );
}

async function getFilteredGigs(filters: {
  page?: number;
  sort?: string;
  "price-min"?: number;
  "price-max"?: number;
  "rating-min"?: number;
  "rating-max"?: number;
  "created-after"?: Date;
}) {
  const page = filters.page || 1;
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const where: Prisma.GigWhereInput = {
    createdAt: {
      gte: filters["created-after"],
    },
  };

  const orderBy: Prisma.GigOrderByWithRelationInput[] = [];
  if (filters.sort) {
    switch (filters.sort) {
      case "rating-desc":
        orderBy.push({ averageRating: "desc" });
        break;
      case "newest":
        orderBy.push({ createdAt: "desc" });
        break;
      default:
        break; // Default to no sorting
    }
  }

  const gigs = await prisma.gig.findMany({
    include: {
      seller: {
        include: {
          badges: {
            include: {
              badge: true,
            },
          },
        },
      },
      packages: {
        include: {
          orders: {
            include: {
              review: true,
            },
          },
        },
      },
      images: true,
      tags: true,
    },
    where,
    orderBy,
    skip,
    take: ITEMS_PER_PAGE,
  });

  return gigs;
}
