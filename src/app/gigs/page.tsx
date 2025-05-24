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

const select: Prisma.GigSelect = {
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
};

const getCategories = async () => {
  return await prisma.category.findMany({
    where: {
      parentId: null, // Top-level categories only
    },
    select: {
      id: true,
      label: true,
    },
  });
};

const getTags = async () => {
  return await prisma.tag.findMany({
    select: {
      id: true,
      label: true,
    },
  });
};

const buildWhere = (params: SearchParams): Prisma.GigWhereInput => {
  const where: Prisma.GigWhereInput = {};

  if (params.query) {
    where.title = {
      contains,
    };
  }

  if (params.category) {
    where.categoryId = params.category;
  }

  if (params.tags) {
    where.tags = {
      some: {
        id: { in: params.tags },
      },
    };
  }

  const packageConditions: Prisma.PackageWhereInput[] = [];

  if (params["price-min"]) {
    packageConditions.push({ price: { gte: Number(params["price-min"]) } });
  }

  if (params["price-max"]) {
    packageConditions.push({ price: { lte: Number(params["price-max"]) } });
  }

  if (params["deliveryTime-max"]) {
    packageConditions.push({
      deliveryTime: { lte: Number(params["deliveryTime-max"]) },
    });
  }

  if (packageConditions.length > 0) {
    where.packages = {
      some: {
        AND: packageConditions,
      },
    };
  }

  return where;
};

const getGigs = async (params: SearchParams) => {
  const where = buildWhere(params);
  return await prisma.gig.findMany({
    where,
    select,
    take: ITEMS_PER_PAGE,
    skip: (Number(params.page || 1) - 1) * ITEMS_PER_PAGE,
  });
};

const getCnt = async (params: SearchParams) => {
  const where = buildWhere(params);
  return await prisma.gig.count({
    where,
  });
};

export default async function BrowseGigsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const categories = await getCategories();
  const tags = await getTags();
  const [gigs, cnt] = await Promise.all([getGigs(params), getCnt(params)]);

  const filterConfig = [
    {
      type: "combobox",
      id: "category",
      label: "Category",
      options: categories.map((cat) => ({ value: cat.id, label: cat.label })),
    },
    {
      type: "multicombobox",
      id: "tags",
      label: "Tags",
      options: tags.map((tag) => ({ value: tag.id, label: tag.label })),
    },
    {
      type: "slider",
      id: "price",
      label: "Price Range",
      min: 0,
      max: 1000,
      step: 10,
    },
    {
      type: "slider",
      id: "deliveryTime",
      label: "Max Delivery Time (days)",
      min: 1,
      max: 30,
      step: 1,
    },
  ];

  return (
    <div className="space-y-2 lg:space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">
          Explore Top Freelance Services Paid with Solana
        </h1>
        <SearchBar containerClassName="mx-auto max-w-3xl" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterCard config={filterConfig} className="lg:w-64 h-fit w-full" />

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
