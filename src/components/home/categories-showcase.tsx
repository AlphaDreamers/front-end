import { Prisma } from "@prisma/client";
import { Award } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

interface CategoriesShowcaseProps {
  categories: Prisma.CategoryGetPayload<{
    select: {
      id: true;
      label: true;
      _count: {
        select: {
          gigs: true;
        };
      };
    };
  }>[];
}

export function CategoriesShowcase({ categories }: CategoriesShowcaseProps) {
  return (
    <section>
      <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
        Explore Popular Categories
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {categories.map((category) => {
          const IconComponent = Award;

          return (
            <Link
              href={`/gigs?category=${category.id}`}
              key={category.id}
              className={cn(
                buttonVariants({
                  variant: "outline",
                }),
                "w-full h-auto aspect-square"
              )}
            >
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/20 p-4 text-primary">
                  <IconComponent className="size-6" />
                </div>
                <h3 className="text-sm font-medium md:text-base">
                  {category.label}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {category._count.gigs} gigs
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
