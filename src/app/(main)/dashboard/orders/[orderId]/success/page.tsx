import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-center">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            <CheckCircle className="h-16 w-16 text-green-500" />

            <div className="text-center space-y-2">
              <p className="text-lg font-medium">
                Order #{orderId.slice(0, 8)}...
              </p>
              <p className="text-muted-foreground">
                Your payment has been confirmed. The seller has been notified
                and will begin working on your order.
              </p>
            </div>

            <div className="flex gap-4 w-full">
              <Link
                href={`/dashboard/orders`}
                className={cn("flex-1", buttonVariants({ variant: "outline" }))}
              >
                View All Orders
              </Link>
              <Link
                href={`/dashboard/orders/${orderId}/chat`}
                className={cn(
                  "flex-1",
                  buttonVariants({ variant: "secondary" })
                )}
              >
                Go to Chat
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
