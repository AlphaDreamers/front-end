import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Clock, DollarSign, Repeat, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderConfirmationButton from "./order-confirmation-dialog";
import { GigPackage } from "@/lib/types/gig";

interface OrderDetailsCardProps {
  packages: GigPackage[];
}

const OrderDetailsCard = ({ packages }: OrderDetailsCardProps) => {
  if (packages.length === 0) {
    return null;
  }

  return (
    <Card>
      <Tabs defaultValue={packages[0].id}>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <TabsList
            className="w-full"
            style={{
              gridTemplateColumns: `repeat(${packages.length}, minmax(0, 1fr))`,
            }}
          >
            {packages.map((pkg) => (
              <TabsTrigger key={pkg.id} value={pkg.id}>
                {pkg.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </CardHeader>
        {packages.map((pkg) => (
          <>
            <TabsContent key={pkg.id} value={pkg.id}>
              <CardContent key={pkg.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{pkg.price} SOL</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {pkg.deliveryTime} days delivery
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Repeat className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{pkg.revisions} revisions</span>
                </div>

                {pkg.features.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    {feature.isIncluded ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    {feature.label}
                  </div>
                ))}
              </CardContent>

              <CardFooter className="flex-col">
                <OrderConfirmationButton
                  title={pkg.title}
                  revisions={pkg.revisions}
                  deliveryTime={pkg.deliveryTime}
                  price={pkg.price}
                  packageId={pkg.id}
                  variant="outline"
                  size="sm"
                  className="w-full my-2"
                />

                <div className="text-xs text-center text-muted-foreground">
                  You won&apos;t be charged yet
                </div>
              </CardFooter>
            </TabsContent>
          </>
        ))}
      </Tabs>
    </Card>
  );
};
export default OrderDetailsCard;
