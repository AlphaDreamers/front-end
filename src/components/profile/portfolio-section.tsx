"use client";

// src/components/profile/portfolio-section.tsx
import { useState } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Eye,
  FileText,
  Video,
  ImageIcon,
  Lock,
} from "lucide-react";
import { Prisma } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { PortfolioItem } from "@/lib/types";

interface PortfolioSectionProps {
  portfolioItems: PortfolioItem[];
  className?: string;
}

// Helper function to get media type icon
const getMediaIcon = (type: string) => {
  switch (type) {
    case "VIDEO":
      return Video;
    case "DOCUMENT":
      return FileText;
    default:
      return ImageIcon;
  }
};

// Portfolio item card component
function PortfolioItemCard({
  item,
  onView,
}: {
  item: PortfolioItem;
  onView: () => void;
}) {
  const primaryImage =
    item.images.length > 0
      ? item.images.find((img) => img.isPrimary)
      : item.images[0] || "/portfolio-placeholder.png";
  const mediaTypes = new Set(item.images.map((img) => img.file.type));

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
      {item.isConfidential && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="secondary" className="bg-black/80 text-white">
            <Lock className="size-3 mr-1" />
            Confidential
          </Badge>
        </div>
      )}

      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {primaryImage ? (
            <>
              <Image
                src={primaryImage.file.url}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {primaryImage.file.type === "VIDEO" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="rounded-full bg-white/90 p-3">
                    <Video className="size-6 text-black" />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <FileText className="size-12 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-1 mb-2">{item.title}</h3>
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {item.description}
          </p>
        )}

        {/* Media type badges */}
        <div className="flex items-center gap-2">
          {[...mediaTypes].map((type) => {
            const Icon = getMediaIcon(type);
            return (
              <Badge key={type} variant="outline" className="text-xs">
                <Icon className="size-3 mr-1" />
                {type === "IMAGE"
                  ? "Images"
                  : type === "VIDEO"
                    ? "Videos"
                    : "Documents"}
              </Badge>
            );
          })}
          {item.category && (
            <Badge variant="secondary" className="text-xs">
              {item.category}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Button onClick={onView} className="flex-1" size="sm">
          <Eye className="size-4 mr-2" />
          View Details
        </Button>
        {item.url && !item.isConfidential && (
          <Button asChild variant="outline" size="sm">
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function PortfolioSection({
  portfolioItems,
  className,
}: PortfolioSectionProps) {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Group items by category
  const categories = portfolioItems.reduce(
    (acc, item) => {
      const category = item.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, PortfolioItem[]>
  );

  // Filter items based on active tab
  const filteredItems =
    activeTab === "all" ? portfolioItems : categories[activeTab] || [];

  if (portfolioItems.length === 0) {
    return (
      <Card className={cn("text-center p-8", className)}>
        <p className="text-muted-foreground">
          No portfolio items to display yet.
        </p>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Category tabs */}
      {Object.keys(categories).length > 1 && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
            <TabsTrigger value="all">All ({portfolioItems.length})</TabsTrigger>
            {Object.entries(categories).map(([category, items]) => (
              <TabsTrigger key={category} value={category}>
                {category} ({items.length})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Portfolio grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <PortfolioItemCard
            key={item.id}
            item={item}
            onView={() => setSelectedItem(item)}
          />
        ))}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {selectedItem.title}
                </DialogTitle>
                {selectedItem.description && (
                  <DialogDescription className="mt-2">
                    {selectedItem.description}
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="flex-1 overflow-y-auto">
                {/* Media carousel */}
                {selectedItem.images.length > 0 && (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {selectedItem.images.map((img) => (
                        <CarouselItem key={img.id}>
                          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                            {img.file.type === "VIDEO" ? (
                              <video
                                src={img.file.url}
                                controls
                                className="h-full w-full object-contain"
                              />
                            ) : img.file.type === "DOCUMENT" ? (
                              <div className="flex h-full items-center justify-center">
                                <div className="text-center">
                                  <FileText className="size-16 text-muted-foreground mb-2" />
                                  <Button asChild variant="outline">
                                    <a
                                      href={img.file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      View Document
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Image
                                src={img.file.url}
                                alt={selectedItem.title}
                                fill
                                className="object-contain"
                              />
                            )}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {selectedItem.images.length > 1 && (
                      <>
                        <CarouselPrevious />
                        <CarouselNext />
                      </>
                    )}
                  </Carousel>
                )}

                {/* Additional info */}
                <div className="mt-6 space-y-4">
                  {selectedItem.category && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Category</h4>
                      <Badge variant="secondary">{selectedItem.category}</Badge>
                    </div>
                  )}

                  {selectedItem.url && !selectedItem.isConfidential && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">
                        External Link
                      </h4>
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={selectedItem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="size-4 mr-2" />
                          Visit Project
                        </a>
                      </Button>
                    </div>
                  )}

                  {selectedItem.isConfidential && (
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Lock className="size-4" />
                        <p className="font-medium">Confidential Project</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Some details of this project are kept confidential to
                        protect client privacy.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
