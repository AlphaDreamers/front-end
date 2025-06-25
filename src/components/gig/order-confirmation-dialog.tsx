import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import BuyButton from "@/components/buy-button";
import { ComponentProps } from "react";

interface OrderConfirmationButtonProps extends ComponentProps<typeof Button> {
  title: string;
  revisions: number;
  deliveryTime: number;
  price: number;
  packageId: string;
}

const OrderConfirmationButton = ({
  title,
  revisions,
  deliveryTime,
  price,
  packageId,
  ...props
}: OrderConfirmationButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...props}>Order Now</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order {title} Package</DialogTitle>
          <DialogDescription>
            <div className="space-y-2">
              <p>
                You are about to order the <strong>{title}</strong> package.
              </p>
              <p>
                This package includes <strong>{revisions} revisions</strong> and
                will be delivered in <strong>{deliveryTime} days</strong>.
              </p>
              <p>
                The total cost is <strong>{price} SOL</strong>.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div>
          <p className="text-sm text-muted-foreground">
            Please confirm your order details before proceeding.
          </p>
        </div>

        <DialogFooter className="flex-row gap-2">
          <Button variant="destructive" className="flex-1">
            Cancel
          </Button>
          <BuyButton className="flex-1" packageId={packageId}>
            Order
          </BuyButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default OrderConfirmationButton;
