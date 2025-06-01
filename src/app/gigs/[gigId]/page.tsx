import { notFound } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

import PackageComparison from "./package-comparison";
import GigDescription from "./gig-description";
import GigHeader from "./gig-header";
import ReviewSection from "./review-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BuyButton from "@/components/buy-button";

// Define the gig select query to get all necessary data
const gigSelect = Prisma.validator<Prisma.GigSelect>()({
  id: true,
  title: true,
  description: true,
  images: {
    select: {
      id: true,
      file: {
        select: {
          url: true,
        },
      },
      isPrimary: true,
    },
  },
  packages: {
    select: {
      id: true,
      title: true,
      price: true,
      revisions: true,
      deliveryTime: true,
      features: {
        select: {
          isIncluded: true,
          feature: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  },
  seller: {
    select: {
      id: true,
      username: true,
      avatar: true,
      isVerified: true,
      skills: {
        select: {
          level: true,
          skill: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
      badgeProgress: {
        where: {
          isFeatured: true,
        },
        select: {
          badge: {
            select: {
              title: true,
            },
          },
          highestTier: true,
        },
        take: 1,
      },
    },
  },
  reviews: {
    select: {
      id: true,
      rating: true,
      title: true,
      description: true,
      author: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      order: {
        id: "desc",
      },
    },
    take: 5,
  },
  category: {
    select: {
      id: true,
      title: true,
    },
  },
  tags: {
    select: {
      id: true,
      title: true,
    },
  },
  faqs: {
    select: {
      id: true,
      question: true,
      answer: true,
    },
  },
});

async function getGigDetails(id: string) {
  const gig = await prisma.gig.findUnique({
    where: { id },
    select: gigSelect,
  });

  if (!gig) {
    return null;
  }

  // Calculate average rating
  const avgRating =
    gig.reviews.length > 0
      ? gig.reviews.reduce((sum, review) => sum + review.rating, 0) /
        gig.reviews.length
      : 0;

  return {
    ...gig,
    avgRating,
    reviewCount: gig.reviews.length,
  };
}

export default async function GigDetailsPage({
  params,
}: {
  params: Promise<{ gigId: string }>;
}) {
  const { gigId } = await params;

  const gig = await getGigDetails(gigId);

  if (!gig) {
    notFound();
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      <div className="xl:w-2/3 space-y-8">
        <GigHeader
          title={gig.title}
          sellerName={gig.seller.username}
          sellerAvatar={gig.seller.avatar}
          sellerBadge={gig.seller.badgeProgress[0]?.badge.title}
          sellerTier={gig.seller.badgeProgress[0]?.highestTier}
          avgRating={gig.avgRating}
          reviewCount={gig.reviewCount}
        />

        <ImageCarousel
          images={gig.images
            .filter((image) => image.file.url)
            .map((image) => image.url || "")}
          alt={gig.title}
        />

        <GigDescription description={gig.description} />

        <PackageComparison packages={gig.packages} />

        <ReviewSection
          reviews={gig.reviews}
          avgRating={gig.avgRating}
          reviewCount={gig.reviewCount}
        />

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>

          <div>
            {gig.faqs.map((faq, index) => (
              <Accordion key={index} type="single" collapsible>
                <AccordionItem value={faq.id}>
                  <AccordionTrigger>
                    <span className="font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
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
  packages: Prisma.PackageGetPayload<{
    select: {
      id: true;
      title: true;
      price: true;
      revisions: true;
      deliveryTime: true;
      features: {
        select: {
          isIncluded: true;
          feature: {
            select: {
              id: true;
              label: true;
            };
          };
        };
      };
    };
  }>[];
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
        <Dialog>
          {packages.map((pkg) => (
            <>
              <TabsContent key={pkg.id} value={pkg.id}>
                <CardContent key={pkg.id}>
                  <div className="space-y-2">
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
                  </div>

                  <div className="space-y-2">
                    {pkg.features.map((feature) => (
                      <div
                        key={feature.feature.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        {feature.isIncluded ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-red-500" />
                        )}
                        {feature.feature.title}
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="flex-col">
                  <DialogTrigger
                    className={buttonVariants({
                      size: "lg",
                      className: "w-full mt-8 mb-2",
                    })}
                  >
                    Order Now
                  </DialogTrigger>

                  <div className="text-xs text-center text-muted-foreground">
                    You won&apos;t be charged yet
                  </div>
                </CardFooter>
              </TabsContent>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Order {pkg.title} Package</DialogTitle>
                  <DialogDescription>
                    <div className="space-y-2">
                      <p>
                        You are about to order the <strong>{pkg.title}</strong>{" "}
                        package.
                      </p>
                      <p>
                        This package includes{" "}
                        <strong>{pkg.revisions} revisions</strong> and will be
                        delivered in <strong>{pkg.deliveryTime} days</strong>.
                      </p>
                      <p>
                        The total cost is <strong>{pkg.price} SOL</strong>.
                      </p>
                    </div>
                  </DialogDescription>
                </DialogHeader>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Please confirm your order details before proceeding.
                  </p>
                </div>

                <DialogFooter>
                  <Button variant="destructive" className="w-1/2">
                    Cancel
                  </Button>
                  <BuyButton packageId={pkg.id} />
                </DialogFooter>
              </DialogContent>
            </>
          ))}
        </Dialog>
      </Tabs>
    </Card>
  );
};
