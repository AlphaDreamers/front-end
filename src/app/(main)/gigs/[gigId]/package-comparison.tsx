"use client";

import { Check, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PackageComparisonProps {
  packages: Prisma.PackageGetPayload<{
    select: {
      id: true;
      title: true;
      price: true;
      revisions: true;
      deliveryTime: true;
      features: {
        select: {
          isIncluded: true;
          feature: {
            select: {
              id: true;
              label: true;
            };
          };
        };
      };
    };
  }>[];
}

export default function PackageComparison({
  packages,
}: PackageComparisonProps) {
  // Sort packages by price
  const sortedPackages = [...packages].sort((a, b) => a.price - b.price);

  // Get all unique features across all packages
  const allFeatures = Array.from(
    new Set(
      sortedPackages.flatMap((pkg) =>
        pkg.features.map((feature) => feature.feature.id)
      )
    )
  ).map((featureId) => {
    const feature = sortedPackages
      .flatMap((pkg) => pkg.features)
      .find((f) => f.feature.id === featureId);

    return {
      id: featureId,
      label: feature?.feature.label || "",
    };
  });

  // Function to check if a feature is included in a package
  const isFeatureIncluded = (packageId: string, featureId: string) => {
    const pkg = packages.find((p) => p.id === packageId);
    if (!pkg) return false;

    const feature = pkg.features.find((f) => f.feature.id === featureId);
    return feature?.isIncluded || false;
  };

  // For desktop view, use a comparison table
  return (
    <div className="hidden lg:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            {sortedPackages.map((pkg) => (
              <TableHead key={pkg.id} className="text-center p-2 space-y-2">
                <h3 className="text-lg font-bold">{pkg.title}</h3>
                <p className="text-2xl font-bold text-primary">
                  {pkg.price} SOL
                </p>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="p-4">Delivery Time</TableCell>
            {packages.map((pkg) => (
              <TableCell key={pkg.id} className="text-center">
                {pkg.deliveryTime} days
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="p-4 border-b border-border">
              Revisions
            </TableCell>
            {sortedPackages.map((pkg) => (
              <TableCell
                key={pkg.id}
                className="text-center p-4 border-b border-border"
              >
                {pkg.revisions}
              </TableCell>
            ))}
          </TableRow>

          {allFeatures.map((feature) => (
            <TableRow key={feature.id}>
              <TableCell>{feature.label}</TableCell>
              {sortedPackages.map((pkg) => (
                <TableCell key={pkg.id} className="text-center p-4">
                  {isFeatureIncluded(pkg.id, feature.id) ? (
                    <Check className="size-5 text-green-500 mx-auto" />
                  ) : (
                    <X className="size-5 text-red-500 mx-auto" />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}

          <TableRow>
            <TableCell />
            {sortedPackages.map((pkg) => (
              <TableCell key={pkg.id} className="text-center">
                <Link
                  href={`/gigs/${pkg.id}/order`}
                  className={cn("w-1/2", buttonVariants({ size: "sm" }))}
                >
                  {"Order Now"}
                </Link>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
