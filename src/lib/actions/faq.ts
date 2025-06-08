"use server";

import { Prisma } from "@prisma/client";
import { FAQ } from "../types/faq";
import { prisma } from "../prisma";

export const getFaqs = async (
  args: Omit<Prisma.FAQFindManyArgs, "select" | "include"> = {}
): Promise<FAQ[]> => {
  const faqs = await prisma.fAQ.findMany({
    ...args,
    select: {
      id: true,
      question: true,
      answer: true,
    },
  });

  return faqs;
};

export const getFaqCount = async (
  args: Prisma.FAQCountArgs = {}
): Promise<number> => {
  const count = await prisma.fAQ.count(args);

  return count;
};
