// components/buy-button.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Coins } from "lucide-react";
import { createStripeCheckoutSession } from "@/lib/actions/stripe";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/actions/order";

interface StripeBuyButtonProps {
  packageId: string;
  price: number;
  title: string;
  deliveryTime: number;
  revisions: number;
  onSolanaPayment?: () => void; // Your existing Solana payment handler
}

export function StripeBuyButton({
  packageId,
  price,
  title,
  deliveryTime,
  revisions,
  onSolanaPayment,
}: StripeBuyButtonProps) {
  const [selectedPayment, setSelectedPayment] = useState<
    "solana" | "stripe" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStripePayment = async () => {
    setIsLoading(true);
    try {
      // First create the order (you'll need to implement this)
      // For now, assuming you have an existing createOrder function
      const order = await createOrder(packageId); // You'll need to implement this

      // Then create Stripe checkout session
      const { checkoutUrl } = await createStripeCheckoutSession(order.id);

      if (checkoutUrl) {
        router.push(checkoutUrl);
      }
    } catch (error) {
      console.error("Error processing Stripe payment:", error);
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  const handleSolanaPayment = () => {
    if (onSolanaPayment) {
      onSolanaPayment();
    }
  };

  if (!selectedPayment) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">Choose Payment Method</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{title}</span>
              <Badge variant="outline">${price}</Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {deliveryTime} day delivery • {revisions} revisions
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Button
              onClick={() => setSelectedPayment("stripe")}
              variant="outline"
              className="w-full justify-start"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Pay with Credit Card
              <Badge variant="secondary" className="ml-auto">
                Instant
              </Badge>
            </Button>

            <Button
              onClick={() => setSelectedPayment("solana")}
              variant="outline"
              className="w-full justify-start"
            >
              Pay with Solana
              <Badge variant="secondary" className="ml-auto">
                Crypto
              </Badge>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          {selectedPayment === "stripe" ? (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Credit Card Payment
            </>
          ) : (
            <>
              <Coins className="mr-2 h-4 w-4" />
              Solana Payment
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">{title}</span>
            <Badge variant="outline">${price}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {deliveryTime} day delivery • {revisions} revisions
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          {selectedPayment === "stripe" ? (
            <Button
              onClick={handleStripePayment}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Processing..." : `Pay $${price} with Card`}
            </Button>
          ) : (
            <Button
              onClick={handleSolanaPayment}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Processing..." : `Pay with Solana`}
            </Button>
          )}

          <Button
            onClick={() => setSelectedPayment(null)}
            variant="ghost"
            className="w-full"
          >
            Back to Payment Methods
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
