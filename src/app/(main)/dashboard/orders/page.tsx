import { redirect } from "next/navigation";
import { PackageSearch } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import SearchBar from "@/components/search-bar";
import Filters, { FilterType } from "@/components/filters";
import OrderCard from "@/components/orders/order-card";

import { getOrders } from "@/lib/actions/orders";
import Link from "next/link";
import Async from "@/components/async";
import PageTemplate from "@/components/templates/page-template";
import { auth } from "@/lib/auth";

export default async function OrdersPage() {
  const session = await auth();

  if (!session) {
    redirect(
      `/sign-in?callback-url=${encodeURIComponent(`/dashboard/orders`)}`
    );
  }

  const filterConfig: FilterType[] = [];

  const fetchOrders = async () => {
    return await getOrders({
      where: {
        OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }],
      },
      take: 10,
    });
  };

  return (
    <PageTemplate
      title="Orders"
      description="Manage your orders as a buyer or seller"
    >
      <div className="space-y-2 lg:space-y-8">
        <SearchBar containerClassName="mx-auto max-w-3xl" />

        <div className="flex flex-col lg:flex-row gap-8">
          <Filters filters={filterConfig} className="lg:w-64 h-fit w-full" />

          <div className="flex-1">
            <Async fetch={fetchOrders}>
              {(orders) =>
                orders.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 px-4">
                      <PackageSearch className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-center">
                        No orders found
                      </h3>
                      <p className="text-sm text-muted-foreground text-center mt-1">
                        {"Orders from your buyers will appear here"}
                      </p>
                      <Link
                        href="/gigs"
                        className={cn(
                          buttonVariants({ variant: "default" }),
                          "mt-4"
                        )}
                      >
                        Browse Services
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {orders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        currentUserId={session.user.id}
                      />
                    ))}
                  </div>
                )
              }
            </Async>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
