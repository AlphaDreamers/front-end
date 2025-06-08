import { Prisma } from "@prisma/client";
import { GigSearchParams } from "../types";

export const buildGigFilters = (
  searchParams: GigSearchParams,
  itemsPerPage: number = 20
): Omit<Prisma.GigFindManyArgs, "select" | "include"> => {
  const {
    q,
    page = "1",
    "price-min": priceMin,
    "price-max": priceMax,
    rating,
    dateAdded,
  } = searchParams;

  const currentPage = parseInt(page, 10) || 1;
  const skip = (currentPage - 1) * itemsPerPage;
  const take = itemsPerPage;

  const where: Prisma.GigWhereInput = {};

  if (q && q.trim()) {
    where.OR = [
      {
        title: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        category: {
          title: {
            contains: q,
            mode: "insensitive",
          },
        },
      },
      {
        seller: {
          OR: [
            {
              username: {
                contains: q,
                mode: "insensitive",
              },
            },
            {
              firstName: {
                contains: q,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: q,
                mode: "insensitive",
              },
            },
          ],
        },
      },
    ];
  }

  if (priceMin) {
    const minPrice = parseFloat(priceMin);
    if (!isNaN(minPrice)) {
      where.packages = {
        some: {
          price: {
            gte: minPrice,
          },
        },
      };
    }
  }

  if (priceMax) {
    const maxPrice = parseFloat(priceMax);
    if (!isNaN(maxPrice)) {
      where.packages = {
        some: {
          price: {
            lte: maxPrice,
          },
        },
      };
    }
  }

  if (dateAdded) {
    const date = new Date(dateAdded);
    if (!isNaN(date.getTime())) {
      where.createdAt = {
        gte: date,
      };
    }
  }

  return {
    skip,
    take,
    where,
  };
};
