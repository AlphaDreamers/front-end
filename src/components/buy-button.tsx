"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";
import { createOrder } from "@/lib/actions/orders";
import { useRouter } from "next/navigation";
import { ComponentProps } from "react";

interface BuyButtonProps
  extends Omit<ComponentProps<typeof Button>, "onClick"> {
  packageId: string;
}

const BuyButton = ({ packageId, ...props }: BuyButtonProps) => {
  const { push } = useRouter();

  const handleClick = async () =>
    toast.promise(
      async () => {
        const res = await createOrder(packageId);
        if (res.success === false) {
          throw new Error(res.error || "Failed to create order");
        }
      },
      {
        loading: "Processing your order...",
        success: () => {
          push("/dashboard/orders");
          return "Order placed successfully!";
        },
        error: (err) => {
          const ms = err instanceof Error ? err.message : "An error occurred";
          return ms;
        },
      }
    );

  return <Button onClick={handleClick} {...props} />;
};

export default BuyButton;
