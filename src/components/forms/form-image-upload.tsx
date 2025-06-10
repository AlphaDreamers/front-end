"use client";

import { useState, useRef } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { Upload, X, Star, AlertCircle } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Enhanced type definitions to handle both existing and new images
type ExistingImage = {
  type: "existing";
  id: string;
  url: string;
  isPrimary: boolean;
};

type NewImage = {
  type: "new";
  file: File;
  isPrimary: boolean;
  tempId: string;
};

type ImageUnion = ExistingImage | NewImage;

interface FormImageUploadProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  maxImages?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  className?: string;
}

export default function FormImageUpload<T extends FieldValues = FieldValues>({
  control,
  name,
  label = "Images",
  description,
  required = false,
  disabled = false,
  maxImages = 8,
  maxSizeMB = 5,
  acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  className,
}: FormImageUploadProps<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Generate a unique temp ID for new images
  const generateTempId = () => `temp_${Date.now()}_${Math.random()}`;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const images: ImageUnion[] = field.value || [];

        const handleFileSelect = (files: FileList | null) => {
          if (!files || files.length === 0) return;

          const newImages: NewImage[] = [];
          const errors: string[] = [];

          Array.from(files).forEach((file) => {
            // Validate file type
            if (!acceptedTypes.includes(file.type)) {
              errors.push(`Images must be JPG, or PNG format`);
              return;
            }

            // Validate file size
            if (file.size > maxSizeMB * 1024 * 1024) {
              errors.push(`Images must be less than 5MB in size`);
              return;
            }

            // Create new image object
            newImages.push({
              type: "new",
              file,
              isPrimary: images.length === 0 && newImages.length === 0,
              tempId: generateTempId(),
            });
          });

          if (errors.length > 0) {
            console.error("Upload errors:", errors);
            return;
          }

          // Check total image limit
          const totalImages = images.length + newImages.length;
          if (totalImages > maxImages) {
            const allowedNew = maxImages - images.length;
            newImages.splice(allowedNew);
          }

          field.onChange([...images, ...newImages]);
        };

        const removeImage = (index: number) => {
          const newImages = images.filter((_, i) => i !== index);

          // If we removed the primary image, make the first remaining image primary
          if (images[index].isPrimary && newImages.length > 0) {
            newImages[0].isPrimary = true;
          }

          field.onChange(newImages);
        };

        const setPrimaryImage = (index: number) => {
          const newImages = images.map((img, i) => ({
            ...img,
            isPrimary: i === index,
          }));
          field.onChange(newImages);
        };

        // Get display URL for any image type
        const getImageUrl = (image: ImageUnion): string => {
          if (image.type === "existing") {
            return image.url;
          } else {
            // Create blob URL for new file uploads
            return URL.createObjectURL(image.file);
          }
        };

        // Get image identifier for keys
        const getImageKey = (image: ImageUnion, index: number): string => {
          if (image.type === "existing") {
            return `existing_${image.id}`;
          } else {
            return `new_${image.tempId}`;
          }
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
                    images.length >= maxImages &&
                      "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => {
                    if (!disabled && images.length < maxImages) {
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
                    accept={acceptedTypes.join(",")}
                    onChange={(e) => handleFileSelect(e.target.files)}
                    disabled={disabled || images.length >= maxImages}
                    className="hidden"
                  />

                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium">
                    {images.length >= maxImages
                      ? `Maximum ${maxImages} images reached`
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {acceptedTypes
                      .map((type) => type.split("/")[1].toUpperCase())
                      .join(", ")}{" "}
                    (max {maxSizeMB}MB each)
                  </p>
                </div>

                {/* Image preview grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div
                        key={getImageKey(image, index)}
                        className="relative group aspect-square rounded-lg overflow-hidden border"
                      >
                        {/* Image preview */}
                        <img
                          src={getImageUrl(image)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Image type indicator */}
                        <div className="absolute top-2 right-2">
                          {image.type === "existing" ? (
                            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                              Saved
                            </div>
                          ) : (
                            <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                              New
                            </div>
                          )}
                        </div>

                        {/* Hover overlay with action buttons */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          {/* Set as primary button */}
                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPrimaryImage(index);
                            }}
                            disabled={image.isPrimary}
                            className="h-8 w-8"
                          >
                            <Star
                              className={cn(
                                "h-4 w-4",
                                image.isPrimary && "fill-current"
                              )}
                            />
                          </Button>

                          {/* Remove button */}
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Primary badge */}
                        {image.isPrimary && (
                          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Status information */}
                {images.length > 0 && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {images.length} of {maxImages} images uploaded
                    </span>
                    <div className="flex items-center gap-4">
                      {images.filter((img) => img.type === "existing").length >
                        0 && (
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          {
                            images.filter((img) => img.type === "existing")
                              .length
                          }{" "}
                          existing
                        </span>
                      )}
                      {images.filter((img) => img.type === "new").length >
                        0 && (
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          {images.filter((img) => img.type === "new").length}{" "}
                          new
                        </span>
                      )}
                    </div>
                  </div>
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
