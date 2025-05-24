import { Prisma } from "@prisma/client";
import Image from "next/image";
import { ExternalLink, Eye } from "lucide-react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PortfolioCardProps {
  item: Prisma.PortfolioItemGetPayload<{
    select: {
      id: true;
      title: true;
      images: true;
      description: true;
      url: true;
    };
  }>;
}

const PorfolioCard = ({ item }: PortfolioCardProps) => {
  const primaryImage =
    item.images.find((img) => img.isPrimary) || item.images.length > 0
      ? item.images[0]
      : null;

  return (
    <Dialog>
      <Card key={item.id} className="overflow-hidden">
        <CardHeader>
          <Image
            src={primaryImage?.url || "/placeholder.svg"}
            alt={item.title}
            width={400}
            height={300}
            className="aspect-video object-cover -mx-6 -mt-6 mb-2 min-w-[calc(100%+3rem)]"
          />
          <CardTitle>{item.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm line-clamp-4 text-muted-foreground">
            {item.description}
          </p>
        </CardContent>
        <CardFooter className="gap-2 mt-auto">
          <DialogTrigger asChild>
            <Button className="flex-1" size="sm">
              <Eye />
              View Details
            </Button>
          </DialogTrigger>

          {item.url && (
            <Link
              href={item.url}
              target="_blank"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
              })}
            >
              <ExternalLink />
            </Link>
          )}
        </CardFooter>
      </Card>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
          <DialogDescription>{item.description}</DialogDescription>
        </DialogHeader>

        <Carousel>
          <CarouselContent>
            {item.images.map((img) => (
              <CarouselItem key={img.id}>
                <Image
                  src={img.url}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="h-92 w-full object-cover rounded"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext className="-right-20 size-10" />
          <CarouselPrevious className="-left-20 size-10" />
        </Carousel>

        <div className="mt-4">
          <p>{item.description}</p>
        </div>

        {item.url && (
          <DialogFooter>
            <Link
              href={item.url}
              target="_blank"
              className={buttonVariants({})}
            >
              <ExternalLink />
              Visit Project
            </Link>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PorfolioCard;
