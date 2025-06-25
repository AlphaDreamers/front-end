import { PropsWithChildren } from "react";
import { SearchProvider } from "./search-provider";
import { prisma } from "@/lib/prisma";

const SearchProviderWrapper = async ({ children }: PropsWithChildren) => {
  const gigs = await prisma.gig.findMany({
    select: {
      id: true,
      title: true,
    },
  });

  const results = gigs.map((gig) => ({
    label: gig.title,
    value: gig.id,
  }));

  return <SearchProvider results={results}>{children}</SearchProvider>;
};

export default SearchProviderWrapper;
