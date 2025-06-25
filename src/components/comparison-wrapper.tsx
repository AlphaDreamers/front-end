"use client";

import { PropsWithChildren } from "react";
import { buttonVariants } from "./ui/button";
import { Plus } from "lucide-react";
import useCompareServicesStore from "@/lib/store/compare-services";
import { cn } from "@/lib/utils";
import Link from "next/link";

const ComparisonWrapper = ({ children }: PropsWithChildren) => {
  const { getGigCount } = useCompareServicesStore();

  const gigCount = getGigCount();

  if (gigCount === 0) {
    return children;
  }

  return (
    <>
      {children}

      <Link
        href="/compare"
        className={cn(
          buttonVariants({}),
          "fixed right-0 top-1/2 rounded-l-full rounded-r-none w-14 h-14"
        )}
      >
        <Plus className="size-10" />
      </Link>
      <div className="fixed right-1 top-1/2 -translate-y-5 aspect-square rounded-full bg-secondary border size-8 flex items-center justify-center pointer-events-none">
        {gigCount}
      </div>
    </>
  );
};

export default ComparisonWrapper;
