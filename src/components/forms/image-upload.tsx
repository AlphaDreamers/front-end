"use client";

import { useRef, useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { X, Image as ImageIcon } from "lucide-react";
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
import Image from "next/image";
import { generateTempId } from "@/lib/types/forms";
import { ImageField } from "@/lib/schemas";

interface UnifiedImageUploadProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  maxSizeMB?: number;
  className?: string;
  aspectRatio?: string;
}

export default function UnifiedImageUpload<
  T extends FieldValues = FieldValues,
>({
  control,
  name,
  label,
  description,
  required = false,
  disabled = false,
  maxSizeMB = 5,
  className,
  aspectRatio = "aspect-square",
}: UnifiedImageUploadProps<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const imageValue: ImageField | null = field.value;

        const handleFileSelect = (file: File | null) => {
          if (!file) return;

          // Validate file type
          if (!acceptedTypes.includes(file.type)) {
            setError("Please upload a valid image file (JPEG, PNG, or WebP)");
            setTimeout(() => setError(null), 5000);
            return;
          }

          // Validate file size
          if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`File size must be less than ${maxSizeMB}MB`);
            setTimeout(() => setError(null), 5000);
            return;
          }

          // Set the new file
          field.onChange({
            type: "new",
            file,
            tempId: generateTempId(),
          });
        };

        const removeImage = () => {
          field.onChange(null);
        };

        const getPreviewUrl = (): string | null => {
          if (!imageValue) return null;

          if (imageValue.type === "existing") {
            return imageValue.url;
          } else {
            return URL.createObjectURL(imageValue.file);
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
            handleFileSelect(e.dataTransfer.files[0]);
          }
        };

        const previewUrl = getPreviewUrl();

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
                {previewUrl ? (
                  // Image preview
                  <div className="relative group">
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-lg",
                        aspectRatio
                      )}
                    >
                      <Image
                        src={previewUrl}
                        fill
                        alt="Upload preview"
                        className="object-cover"
                      />
                    </div>

                    {/* Overlay with remove button */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={removeImage}
                        disabled={disabled}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Status badge */}
                    {imageValue?.type === "existing" && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-background/80 backdrop-blur text-xs px-2 py-1 rounded">
                          Current
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  // Upload area
                  <div
                    className={cn(
                      "relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                      aspectRatio,
                      "flex flex-col items-center justify-center",
                      dragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25",
                      disabled && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => {
                      if (!disabled) {
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
                      accept={acceptedTypes.join(",")}
                      onChange={(e) =>
                        handleFileSelect(e.target.files?.[0] || null)
                      }
                      disabled={disabled}
                      className="hidden"
                    />

                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPEG, PNG or WebP (max {maxSizeMB}MB)
                    </p>
                  </div>
                )}

                {/* Error display */}
                {error && <p className="text-sm text-destructive">{error}</p>}
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
