import { Award } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { Category } from "@/lib/types";
import Async from "../async";
import * as LucideIcons from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface CategoriesShowcaseProps {
  getCategories: () => Promise<Category[]>;
}

export function CategoriesShowcase({ getCategories }: CategoriesShowcaseProps) {
  return (
    <section>
      <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
        Explore Popular Categories
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        <Async fetch={getCategories} fallback={<CategoriesShowcaseSkeleton />}>
          {(categories) =>
            categories.map((category) => {
              const IconComponent =
                (LucideIcons[
                  category.icon as keyof typeof LucideIcons
                ] as React.ElementType) || Award;

              return (
                <Link
                  href={`/gigs?category=${category.id}`}
                  key={category.id}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                    }),
                    "w-auto h-auto aspect-square"
                  )}
                >
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div
                      className={cn("mb-4 rounded-full p-4", {
                        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200":
                          category.color === "purple",
                        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200":
                          category.color === "green",
                        "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200":
                          category.color === "gray",
                        "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200":
                          category.color === "blue",
                        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200":
                          category.color === "yellow",
                      })}
                    >
                      <IconComponent className="size-6" />
                    </div>
                    <h3 className="text-sm font-medium md:text-base">
                      {category.label}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {category.gigsCnt} gigs
                    </p>
                  </div>
                </Link>
              );
            })
          }
        </Async>
      </div>
    </section>
  );
}

const CategoriesShowcaseSkeleton = () => {
  return Array.from({ length: 10 }).map((_, index) => (
    <div
      key={index}
      className={cn(
        buttonVariants({
          variant: "outline",
        }),
        "w-auto h-auto aspect-square"
      )}
    >
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <Skeleton className="mb-4 rounded-full size-14" />
        <Skeleton className="w-24 h-5" />
        <Skeleton className="mt-1 w-1/2 h-4" />
      </div>
    </div>
  ));
};
