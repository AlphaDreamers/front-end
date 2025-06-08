"use server";

import { prisma } from "../prisma";
import { KeyValuePair } from "../types";

export const getKeyValueTags = async (): Promise<KeyValuePair[]> => {
  const tags = await prisma.tag.findMany({
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  return tags.map((tag) => ({
    key: tag.id,
    value: tag.title,
  }));
};
