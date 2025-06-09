"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";
import { orderPackage } from "@/lib/actions/order";
import { useRouter } from "next/navigation";
import { ComponentProps } from "react";

interface BuyButtonProps
  extends Omit<ComponentProps<typeof Button>, "onClick"> {
  packageId: string;
}

const BuyButton = ({ packageId, ...props }: BuyButtonProps) => {
  const { push } = useRouter();

  const handleClick = async () =>
    toast.promise(async () => orderPackage(packageId), {
      loading: "Processing your order...",
      success: () => {
        push("/dashboard/orders");
        return "Order placed successfully!";
      },
      error: (err) => {
        const ms = err instanceof Error ? err.message : "An error occurred";
        return ms;
      },
    });

  return <Button onClick={handleClick} {...props} />;
};

export default BuyButton;
