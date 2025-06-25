"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { cn } from "@/lib/utils";
import useCompareServicesStore from "@/lib/store/compare-services";
import UserDetails from "./user-details";
import Rating from "./rating";
import { CSSProperties } from "react";

export default function ComparisonTable() {
  const { removeGig, gigs } = useCompareServicesStore();

  return (
    <Table
      style={
        {
          "--table-items-count": gigs.length.toString(),
        } as CSSProperties
      }
    >
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">Service Details</TableHead>
          {gigs.map((gig) => (
            <TableHead
              key={gig.id}
              className="w-[calc(100%_-_150px/var(--table-items-count))] relative group h-40 min-w-40"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-4 opacity-0 group-hover:opacity-100 duration-200"
                onClick={() => removeGig(gig.id)}
                aria-label={`Remove ${gig.title} from comparison`}
              >
                <X />
              </Button>

              <Image
                src={gig.primaryImage || "/placeholder.svg?height=150&width=200"}
                alt={gig.title}
                width={200}
                height={150}
                className="h-full w-full object-cover rounded-md"
              />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="p-2">Title</TableCell>
          {gigs.map((gig) => (
            <TableCell key={gig.id} className="text-center p-2">
              {gig.title}
            </TableCell>
          ))}
        </TableRow>

        <TableRow>
          <TableCell className="p-2">Seller</TableCell>
          {gigs.map((gig) => (
            <TableCell key={gig.id} className="p-2 text-center">
              <UserDetails user={gig.seller} className="mx-auto" />
            </TableCell>
          ))}
        </TableRow>

        <TableRow>
          <TableCell className="p-2">Price</TableCell>
          {gigs.map((gig) => (
            <TableCell
              key={gig.id}
              className="text-lg font-bold text-center p-2"
            >
              <span>{gig.startsAtPrice}</span> <span>SOL</span>
            </TableCell>
          ))}
        </TableRow>

        <TableRow>
          <TableCell className="p-2">Rating</TableCell>
          {gigs.map((gig) => (
            <TableCell key={gig.id} className="text-center p-2">
              <div className="flex items-center justify-center gap-2">
                <Rating rating={gig.averageRating} />{" "}
                <span className="text-sm text-muted-foreground">
                  ({gig.ratingCount})
                </span>
              </div>
            </TableCell>
          ))}
        </TableRow>

        <TableRow>
          <TableCell className="p-2">Category</TableCell>
          {gigs.map((gig) => (
            <TableCell key={gig.id} className="text-center p-2">
              <Badge>{gig.category.label}</Badge>
            </TableCell>
          ))}
        </TableRow>

        <TableRow>
          <TableCell className="p-2">Skills</TableCell>
          {gigs.map((gig) => (
            <TableCell key={gig.id} className="p-2">
              <div className="flex flex-wrap justify-center gap-1">
                {gig.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.label}
                  </Badge>
                ))}
                {gig.tags.length > 3 && (
                  <Badge variant="outline">+{gig.tags.length - 3} more</Badge>
                )}
              </div>
            </TableCell>
          ))}
        </TableRow>

        <TableRow>
          <TableCell className="p-2">Description</TableCell>
          {gigs.map((gig) => (
            <TableCell key={gig.id} className="text-center p-2">
              {gig.description}
            </TableCell>
          ))}
        </TableRow>

        <TableRow>
          <TableCell className="p-2">Action</TableCell>
          {gigs.map((gig) => (
            <TableCell key={gig.id} className="p-2">
              <Link
                href={`/gigs/${gig.id}`}
                className={cn(
                  buttonVariants({ size: "sm", className: "w-full" })
                )}
              >
                View Details
              </Link>
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}
