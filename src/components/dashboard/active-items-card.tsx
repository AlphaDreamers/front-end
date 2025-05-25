"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Prisma } from "@prisma/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ActiveItemsCardProps {
  orders?: Prisma.OrderGetPayload<{
    select: {
      id: true;
      seller: {
        select: {
          firstName: true;
          lastName: true;
          username: true;
          avatar: true;
        };
      };
      buyer: {
        select: {
          firstName: true;
          lastName: true;
          username: true;
          avatar: true;
        };
      };
      package: {
        select: {
          price: true;
          title: true;
        };
      };
      deadline: true;
      status: true;
      gig: {
        select: {
          title: true;
        };
      };
    };
  }>[];
}

const ActiveItemsCard = ({ orders = [] }: ActiveItemsCardProps) => {
  const [role, setRole] = useState<"buyer" | "seller">("buyer");

  return (
    <Card className="pb-0">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Active Items</CardTitle>
        <div>
          <Button
            variant={role === "buyer" ? "default" : "outline"}
            className={cn("rounded-r-none")}
            onClick={() => setRole("buyer")}
          >
            Buyer
          </Button>
          <Button
            variant={role === "seller" ? "default" : "outline"}
            className={cn("rounded-l-none")}
            onClick={() => setRole("seller")}
          >
            Seller
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="text-center">
                {role === "buyer" ? "Seller" : "Buyer"}
              </TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{item.gig.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.package.title}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {role === "buyer" ? (
                    <div className="flex items-center justify-center gap-2">
                      <Image
                        src={item.seller.avatar || "/avatar-fallback.png"}
                        alt={`${item.seller.firstName} ${item.seller.lastName}`}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div className="text-left">
                        <span>
                          {item.seller.firstName} {item.seller.lastName}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          @{item.seller.username}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Image
                        src={item.seller.avatar || "/avatar-fallback.png"}
                        alt={`${item.buyer.firstName} ${item.buyer.lastName}`}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div className="text-left">
                        <span>
                          {item.buyer.firstName} {item.buyer.lastName}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          @{item.buyer.username}
                        </p>
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <div className="font-medium text-primary">
                    {item.package.price} SOL
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge>
                    {item.status.replace("_", " ").toLocaleLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/orders/${item.id}`}
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}
                  >
                    <ExternalLink />
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
export default ActiveItemsCard;
