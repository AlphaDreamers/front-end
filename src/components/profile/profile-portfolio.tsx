import Image from "next/image";
import {
  Eye,
  ExternalLink,
  Play,
  Music,
  FileText,
  File,
  Download,
} from "lucide-react";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

type MediaType = "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT" | "OTHER";

export interface Media {
  id: string;
  url: string; // Cloudinary or external URL
  type: MediaType; // Using the Prisma enum
}

export interface PortfolioItem {
  id: string;
  primaryImage?: string;
  media: Media[];
  title: string;
  description?: string;
  url?: string;
}

interface ProfilePortfolioProps {
  items: PortfolioItem[];
}

// Media type configuration
const MEDIA_CONFIG = {
  IMAGE: {
    icon: null, // Images don't need icons
    color: "bg-blue-500",
    label: "Image",
  },
  VIDEO: {
    icon: Play,
    color: "bg-red-500",
    label: "Video",
  },
  AUDIO: {
    icon: Music,
    color: "bg-green-500",
    label: "Audio",
  },
  DOCUMENT: {
    icon: FileText,
    color: "bg-purple-500",
    label: "Document",
  },
  OTHER: {
    icon: File,
    color: "bg-gray-500",
    label: "File",
  },
};

// Component to render individual media items
function MediaRenderer({ media, title }: { media: Media; title: string }) {
  const config = MEDIA_CONFIG[media.type];
  const IconComponent = config.icon;

  switch (media.type) {
    case "IMAGE":
      return (
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          <Image src={media.url} alt={title} fill className="object-contain" />
        </div>
      );

    case "VIDEO":
      return (
        <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
          <video controls className="w-full h-full" preload="metadata">
            <source src={media.url} />
            Your browser does not support the video tag.
          </video>
        </div>
      );

    case "AUDIO":
      return (
        <div className="flex flex-col items-center justify-center aspect-video bg-muted rounded-lg p-8">
          <div
            className={`w-20 h-20 rounded-full ${config.color} flex items-center justify-center mb-4`}
          >
            {IconComponent && (
              <IconComponent className="h-10 w-10 text-white" />
            )}
          </div>
          <audio controls className="w-full max-w-md">
            <source src={media.url} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );

    case "DOCUMENT":
      return (
        <div className="flex flex-col items-center justify-center aspect-video bg-muted rounded-lg p-8">
          <div
            className={`w-20 h-20 rounded-full ${config.color} flex items-center justify-center mb-4`}
          >
            {IconComponent && (
              <IconComponent className="h-10 w-10 text-white" />
            )}
          </div>
          <div className="text-center space-y-4">
            <p className="text-lg font-medium">Document Preview</p>
            <p className="text-sm text-muted-foreground">
              Click the download button to view this document
            </p>
            <Button asChild>
              <a href={media.url} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Open Document
              </a>
            </Button>
          </div>
        </div>
      );

    case "OTHER":
    default:
      return (
        <div className="flex flex-col items-center justify-center aspect-video bg-muted rounded-lg p-8">
          <div
            className={`w-20 h-20 rounded-full ${config.color} flex items-center justify-center mb-4`}
          >
            {IconComponent && (
              <IconComponent className="h-10 w-10 text-white" />
            )}
          </div>
          <div className="text-center space-y-4">
            <p className="text-lg font-medium">File Preview</p>
            <p className="text-sm text-muted-foreground">
              Click the download button to access this file
            </p>
            <Button asChild>
              <a href={media.url} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Open File
              </a>
            </Button>
          </div>
        </div>
      );
  }
}

// Component to render media type indicator
function MediaTypeIndicator({ media }: { media: Media[] }) {
  const mediaTypes = [...new Set(media.map((m) => m.type))];

  if (mediaTypes.length === 0) return null;

  return (
    <div className="absolute top-2 right-2 flex gap-1">
      {mediaTypes.map((type) => {
        const config = MEDIA_CONFIG[type];
        const IconComponent = config.icon;

        return (
          <Badge
            key={type}
            variant="secondary"
            className="text-xs bg-black/70 text-white border-none"
          >
            {IconComponent && <IconComponent className="h-3 w-3 mr-1" />}
            {config.label}
          </Badge>
        );
      })}
    </div>
  );
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <Dialog key={item.id}>
          <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 pt-0 h-90">
            {/* Thumbnail */}
            <div className="aspect-video relative overflow-hidden bg-muted h-72 -mb-6">
              <Image
                src={item.primaryImage || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover h-full transition-transform duration-300 group-hover:scale-105 "
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

              {/* Media type indicators */}
              <MediaTypeIndicator media={item.media} />
            </div>

            {/* Content */}
            <div className="p-4 space-y-3 h-full">
              <h3 className="font-semibold line-clamp-1">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              )}

              {/* Media count indicator */}
              {item.media.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {item.media.length} media file
                    {item.media.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}

              {/* Actions */}
            </div>

            <CardFooter className="flex items-center gap-2 mt-auto">
              <DialogTrigger asChild>
                <Button size="sm" className="flex-1">
                  <Eye className="size-4 mr-2" />
                  View
                </Button>
              </DialogTrigger>
              {item.url && (
                <Button asChild size="sm" variant="outline">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4" />
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Dialog Content */}
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-xl">{item.title}</DialogTitle>
            </DialogHeader>

            {/* Media Display */}
            {item.media.length > 0 && (
              <div className="mt-4">
                {item.media.length === 1 ? (
                  // Single media item
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">
                        {MEDIA_CONFIG[item.media[0].type].label}
                      </Badge>
                    </div>
                    <MediaRenderer media={item.media[0]} title={item.title} />
                  </div>
                ) : (
                  // Multiple media items - carousel
                  <Carousel className="w-full">
                    <CarouselContent>
                      {item.media.map((media, index) => (
                        <CarouselItem key={media.id}>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between mb-3">
                              <Badge variant="outline">
                                {MEDIA_CONFIG[media.type].label}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {index + 1} of {item.media.length}
                              </span>
                            </div>
                            <MediaRenderer media={media} title={item.title} />
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
