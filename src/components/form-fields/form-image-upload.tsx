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

// Type definition for our image objects
interface ImageFile {
  file: File; // The actual file object
  isPrimary: boolean; // Whether this is the main/featured image
}

interface FormImageUploadProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  maxImages?: number; // Maximum number of images allowed
  maxSizeMB?: number; // Maximum size per image in megabytes
  acceptedTypes?: string[]; // Array of accepted MIME types
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
  // Ref to the hidden file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State to track if user is dragging files over the upload area
  const [dragActive, setDragActive] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Get current images from form state, default to empty array
        const images: ImageFile[] = field.value || [];

        // Function to handle file selection (from both click and drag-drop)
        const handleFileSelect = (files: FileList | null) => {
          if (!files || files.length === 0) return;

          const newImages: ImageFile[] = [];
          const errors: string[] = [];

          // Process each selected file
          Array.from(files).forEach((file) => {
            // Validate file type
            if (!acceptedTypes.includes(file.type)) {
              errors.push(`${file.name} is not a supported image type`);
              return;
            }

            // Validate file size
            if (file.size > maxSizeMB * 1024 * 1024) {
              errors.push(`${file.name} exceeds ${maxSizeMB}MB limit`);
              return;
            }

            // Create image object
            // First image is automatically set as primary if none exist
            newImages.push({
              file,
              isPrimary: images.length === 0 && newImages.length === 0,
            });
          });

          // Handle validation errors
          if (errors.length > 0) {
            // In production, you'd show these in a toast notification
            console.error("Upload errors:", errors);
            return;
          }

          // Check if adding these would exceed the limit
          const totalImages = images.length + newImages.length;
          if (totalImages > maxImages) {
            // Only take as many as we can fit
            const allowedNew = maxImages - images.length;
            newImages.splice(allowedNew);
          }

          // Update form state with new images
          field.onChange([...images, ...newImages]);
        };

        // Function to remove an image
        const removeImage = (index: number) => {
          const newImages = images.filter((_, i) => i !== index);

          // If we removed the primary image, make the first remaining image primary
          if (images[index].isPrimary && newImages.length > 0) {
            newImages[0].isPrimary = true;
          }

          field.onChange(newImages);
        };

        // Function to set which image is primary/featured
        const setPrimaryImage = (index: number) => {
          const newImages = images.map((img, i) => ({
            ...img,
            isPrimary: i === index, // Only the clicked image is primary
          }));
          field.onChange(newImages);
        };

        // Drag and drop event handlers
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

          // Get files from the drag event
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
                {/* Upload area - clickable and droppable */}
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
                    // Only trigger file input if not disabled and under limit
                    if (!disabled && images.length < maxImages) {
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={acceptedTypes.join(",")}
                    onChange={(e) => handleFileSelect(e.target.files)}
                    disabled={disabled || images.length >= maxImages}
                    className="hidden"
                  />

                  {/* Upload icon and instructions */}
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
                        key={index}
                        className="relative group aspect-square rounded-lg overflow-hidden border"
                      >
                        {/* Image preview using blob URL */}
                        <img
                          src={URL.createObjectURL(image.file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

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

                {/* Status and warnings */}
                {images.length > 0 && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {images.length} of {maxImages} images uploaded
                    </span>
                    {images.length > 0 &&
                      !images.some((img) => img.isPrimary) && (
                        <span className="flex items-center gap-1 text-amber-600">
                          <AlertCircle className="h-4 w-4" />
                          Please select a primary image
                        </span>
                      )}
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
