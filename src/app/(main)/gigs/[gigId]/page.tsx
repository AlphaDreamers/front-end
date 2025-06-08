import { notFound } from "next/navigation";

import PackageComparison from "./package-comparison";
import GigDescription from "./gig-description";
import GigHeader from "./gig-header";
import ImageCarousel from "@/components/image-carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Clock, DollarSign, Repeat, X } from "lucide-react";
import GigFaqList from "./gig-faq-list";
import { getDetailedGig } from "@/lib/actions/gig";
import { GigPackage } from "@/lib/types/gig";
import OrderConfirmationButton from "./order-confirmation-dialog";
import { ReviewsSection } from "@/components/profile/reviews-section";

export default async function GigDetailsPage({
  params,
}: {
  params: Promise<{ gigId: string }>;
}) {
  const { gigId } = await params;

  const gig = await getDetailedGig(gigId);

  if (!gig) {
    notFound();
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      <div className="xl:w-2/3 space-y-8">
        <GigHeader
          title={gig.title}
          seller={gig.seller}
          avgRating={gig.avgRating}
          reviewCount={gig.reviewCount}
        />

        <ImageCarousel images={gig.images} alt={gig.title} />

        <GigDescription description={gig.description} />

        <PackageComparison packages={gig.packages} />

        {gig.faqs.length > 0 ? (
          <GigFaqList faqs={gig.faqs} />
        ) : (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-medium text-white mb-2">
              No FAQs available
            </h3>
            <p className="text-gray-400">
              The seller has not provided any FAQs for this gig.
            </p>
          </div>
        )}
      </div>

      <div className="xl:w-1/3">
        <div className="w-full sticky top-24">
          <OrderDetailsCard packages={gig.packages} />
        </div>
      </div>
    </div>
  );
}

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
