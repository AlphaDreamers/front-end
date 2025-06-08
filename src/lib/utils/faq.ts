import { Prisma } from "@prisma/client";
import { FaqPageSearchParams } from "../types/faq";

export const buildFaqFilter = (
  searchParams: FaqPageSearchParams,
  pageSize: number = 10
) => {
  const { q } = searchParams;

  const page = parseInt(searchParams.page ?? "1", 10);

  const where: Prisma.FAQWhereInput = {};

  if (q) {
    where.question = {
      contains: q,
      mode: "insensitive",
    };
  }

  const skip: Prisma.FAQFindManyArgs["skip"] = (page - 1) * pageSize;
  const take: Prisma.FAQFindManyArgs["take"] = pageSize;
  const orderBy: Prisma.FAQFindManyArgs["orderBy"] = {
    createdAt: "desc",
  };

  return {
    where,
    skip,
    take,
    orderBy,
  };
};
