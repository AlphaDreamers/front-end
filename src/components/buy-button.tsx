"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";
import { orderPackage } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface BuyButtonProps {
  packageId: string;
}

const BuyButton = ({ packageId }: BuyButtonProps) => {
  const { push } = useRouter();

  return (
    <Button
      onClick={() =>
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
        })
      }
    >
      Enter
    </Button>
  );
};

export default BuyButton;
