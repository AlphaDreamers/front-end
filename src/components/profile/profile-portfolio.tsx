import Image from "next/image";
import { Eye, ExternalLink } from "lucide-react";
import { PortfolioItem } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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

interface ProfilePortfolioProps {
  items: PortfolioItem[];
}

export default function ProfilePortfolio({ items }: ProfilePortfolioProps) {
  if (items.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No portfolio items yet.</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Dialog key={item.id}>
          <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
            {/* Thumbnail */}
            <div className="aspect-video relative overflow-hidden bg-muted">
              <Image
                src={item.primaryImage || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <h3 className="font-semibold line-clamp-1">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2">
                <DialogTrigger asChild>
                  <Button size="sm" className="flex-1">
                    <Eye className="size-4 mr-2" />
                    View
                  </Button>
                </DialogTrigger>
                {item.url && (
                  <Button asChild size="sm" variant="outline">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Dialog Content */}
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-xl">{item.title}</DialogTitle>
            </DialogHeader>

            {/* Images */}
            {item.images.length > 0 && (
              <div className="mt-4">
                {item.images.length === 1 ? (
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {item.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={image}
                              alt={`${item.title} - ${index + 1}`}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-16" />
                    <CarouselNext className="-right-16" />
                  </Carousel>
                )}
              </div>
            )}

            {/* Description */}
            {item.description && (
              <div className="mt-6">
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>
            )}

            {/* External Link */}
            {item.url && (
              <div className="mt-6 flex justify-end">
                <Button asChild>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4 mr-2" />
                    Visit Project
                  </a>
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
