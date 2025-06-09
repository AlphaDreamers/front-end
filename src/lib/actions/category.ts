"use server";

import { KeyValuePair } from "../types";
import { prisma } from "../prisma";

export const getKeyValueCategories = async (): Promise<KeyValuePair[]> => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      title: true,
    },
  });

  return categories.map((category) => ({
    value: category.id,
    label: category.title,
  }));
};
