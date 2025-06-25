"use client";

import { useState, useRef } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import {
  Upload,
  X,
  Image as ImageIcon,
  FileVideo,
  FileAudio,
  FileText,
  File,
  Star,
} from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { MediaType } from "@prisma/client";
import {
  MediaItem,
  detectMediaType,
  validateMediaFile,
  generateTempId,
} from "@/lib/types/forms";

interface MediaUploadProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  maxFiles?: number;
  className?: string;
  requireImage?: boolean;
  allowPrimary?: boolean; // For portfolio items
}

const MEDIA_CONFIG = {
  [MediaType.IMAGE]: {
    icon: ImageIcon,
    color: "bg-blue-500",
    label: "Image",
  },
  [MediaType.VIDEO]: {
    icon: FileVideo,
    color: "bg-red-500",
    label: "Video",
  },
  [MediaType.AUDIO]: {
    icon: FileAudio,
    color: "bg-green-500",
    label: "Audio",
  },
  [MediaType.DOCUMENT]: {
    icon: FileText,
    color: "bg-purple-500",
    label: "Document",
  },
  [MediaType.OTHER]: {
    icon: File,
    color: "bg-gray-500",
    label: "Other",
  },
};

export default function UnifiedMediaUpload<T extends FieldValues>({
  control,
  name,
  label = "Media Files",
  description,
  required = false,
  disabled = false,
  maxFiles = 10,
  className,
  requireImage = false,
  allowPrimary = false,
}: MediaUploadProps<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const mediaItems: MediaItem[] = field.value || [];

        const handleFileSelect = (files: FileList | null) => {
          if (!files || files.length === 0) return;

          const newMediaItems: MediaItem[] = [];
          const newErrors: string[] = [];

          Array.from(files).forEach((file) => {
            const mediaType = detectMediaType(file);
            const validation = validateMediaFile(file, mediaType);

            if (!validation.valid) {
              newErrors.push(`${file.name}: ${validation.error}`);
              return;
            }

            newMediaItems.push({
              type: "new",
              file,
              tempId: generateTempId(),
              mediaType,
              order: mediaItems.length + newMediaItems.length,
            });
          });

          if (newErrors.length > 0) {
            setErrors(newErrors);
            setTimeout(() => setErrors([]), 5000);
            return;
          }

          // Check total file limit
          const totalFiles = mediaItems.length + newMediaItems.length;
          if (totalFiles > maxFiles) {
            const allowedNew = maxFiles - mediaItems.length;
            newMediaItems.splice(allowedNew);
          }

          field.onChange([...mediaItems, ...newMediaItems]);
        };

        const removeItem = (index: number) => {
          const newItems = mediaItems.filter((_, i) => i !== index);
          // Update order
          newItems.forEach((item, i) => {
            item.order = i;
          });
          field.onChange(newItems);
        };

        const setPrimary = (index: number) => {
          if (!allowPrimary) return;

          const newItems = mediaItems.map((item, i) => ({
            ...item,
            isPrimary: i === index && item.mediaType === MediaType.IMAGE,
          }));
          field.onChange(newItems);
        };

        const getPreviewUrl = (item: MediaItem): string | null => {
          if (item.type === "existing") {
            return item.url;
          }
          if (item.mediaType === MediaType.IMAGE) {
            return URL.createObjectURL(item.file);
          }
          return null;
        };

        const getFileName = (item: MediaItem): string => {
          return item.type === "new" ? item.file.name : "Existing file";
        };

        const getFileSize = (item: MediaItem): string => {
          if (item.type !== "new") return "";
          const bytes = item.file.size;
          const mb = bytes / (1024 * 1024);
          return `${mb.toFixed(2)} MB`;
        };

        const handleDrag = (e: React.DragEvent) => {
          e.preventDefault();
          e.stopPropagation();

          if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
          } else if (e.type === "dragleave") {
            setDragActive(false);
          }
        };

        const handleDrop = (e: React.DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);

          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files);
          }
        };

        // Count media by type
        const mediaCounts = mediaItems.reduce(
          (acc, item) => {
            acc[item.mediaType] = (acc[item.mediaType] || 0) + 1;
            return acc;
          },
          {} as Record<MediaType, number>
        );

        const hasRequiredImage =
          !requireImage || mediaCounts[MediaType.IMAGE] > 0;

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}

            <FormControl>
              <div className="space-y-4">
                {/* Upload area */}
                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25",
                    disabled && "opacity-50 cursor-not-allowed",
                    mediaItems.length >= maxFiles &&
                      "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => {
                    if (!disabled && mediaItems.length < maxFiles) {
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,audio/*,application/pdf,.doc,.docx,.txt"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    disabled={disabled || mediaItems.length >= maxFiles}
                    className="hidden"
                  />

                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium">
                    {mediaItems.length >= maxFiles
                      ? `Maximum ${maxFiles} files reached`
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Images, videos, documents, and audio files
                  </p>
                </div>

                {/* Error display */}
                {errors.length > 0 && (
                  <div className="rounded-md bg-destructive/10 p-3">
                    {errors.map((error, i) => (
                      <p key={i} className="text-sm text-destructive">
                        {error}
                      </p>
                    ))}
                  </div>
                )}

                {/* Media grid */}
                {mediaItems.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mediaItems.map((item, index) => {
                      const config = MEDIA_CONFIG[item.mediaType];
                      const Icon = config.icon;
                      const previewUrl = getPreviewUrl(item);
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const isPrimary = allowPrimary && (item as any).isPrimary;

                      return (
                        <div
                          key={item.type === "existing" ? item.id : item.tempId}
                          className="relative group rounded-lg overflow-hidden border bg-card"
                        >
                          {/* Preview */}
                          <div className="aspect-square relative">
                            {previewUrl ? (
                              <Image
                                src={previewUrl}
                                width={200}
                                height={200}
                                alt={`Media ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className={cn(
                                  "w-full h-full flex flex-col items-center justify-center p-4",
                                  "bg-muted"
                                )}
                              >
                                <Icon className="h-12 w-12 mb-2 text-muted-foreground" />
                                <p className="text-xs text-center text-muted-foreground line-clamp-2">
                                  {getFileName(item)}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Badges */}
                          <div className="absolute top-2 left-2 right-2 flex justify-between">
                            <Badge variant="secondary" className="text-xs">
                              {config.label}
                            </Badge>
                            {item.type === "existing" && (
                              <Badge variant="outline" className="text-xs">
                                Saved
                              </Badge>
                            )}
                          </div>

                          {/* File info */}
                          {item.type === "new" && (
                            <div className="absolute bottom-2 left-2">
                              <span className="text-xs bg-background/80 backdrop-blur px-2 py-1 rounded">
                                {getFileSize(item)}
                              </span>
                            </div>
                          )}

                          {/* Primary indicator */}
                          {isPrimary && (
                            <div className="absolute top-2 right-2">
                              <Star className="h-4 w-4 fill-primary text-primary" />
                            </div>
                          )}

                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {allowPrimary &&
                              item.mediaType === MediaType.IMAGE &&
                              !isPrimary && (
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="secondary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPrimary(index);
                                  }}
                                  className="h-8 w-8"
                                >
                                  <Star className="h-4 w-4" />
                                </Button>
                              )}
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeItem(index);
                              }}
                              className="h-8 w-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Status bar */}
                {mediaItems.length > 0 && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {mediaItems.length} of {maxFiles} files
                    </span>
                    <div className="flex items-center gap-3">
                      {Object.entries(mediaCounts).map(([type, count]) => {
                        const config = MEDIA_CONFIG[type as MediaType];
                        const Icon = config.icon;
                        return (
                          <span key={type} className="flex items-center gap-1">
                            <Icon className="h-3 w-3" />
                            {count}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Validation warning */}
                {requireImage && !hasRequiredImage && mediaItems.length > 0 && (
                  <p className="text-sm text-destructive">
                    At least one image is required
                  </p>
                )}
              </div>
            </FormControl>

            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
