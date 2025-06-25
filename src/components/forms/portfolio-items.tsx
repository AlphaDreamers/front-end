"use client";

import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import {
  Plus,
  X,
  Image as ImageIcon,
  ExternalLink,
  Folder,
  GripVertical,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import UnifiedMediaUpload from "./media-upload";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { generateTempId } from "@/lib/types/forms";
import { UpdateProfileFormData, PortfolioItem } from "@/lib/schemas";

interface UnifiedPortfolioItemsProps {
  form: UseFormReturn<UpdateProfileFormData>;
}

export default function UnifiedPortfolioItems({
  form,
}: UnifiedPortfolioItemsProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const portfolioItems = form.watch("portfolioItems") || [];

  const featuredCount = portfolioItems.filter((item) => item.isFeatured).length;

  const addPortfolioItem = () => {
    const newItem: PortfolioItem = {
      tempId: generateTempId(),
      title: "",
      description: "",
      url: "",
      isFeatured: false,
      media: [],
    };

    form.setValue("portfolioItems", [...portfolioItems, newItem]);
  };

  const removePortfolioItem = (index: number) => {
    const newItems = portfolioItems.filter((_, i) => i !== index);
    form.setValue("portfolioItems", newItems);
  };

  const toggleFeatured = (index: number) => {
    const newItems = [...portfolioItems];
    const currentItem = newItems[index];

    // If trying to feature and already at limit
    if (!currentItem.isFeatured && featuredCount >= 5) {
      return;
    }

    newItems[index] = { ...currentItem, isFeatured: !currentItem.isFeatured };
    form.setValue("portfolioItems", newItems);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const draggedItem = portfolioItems[draggedIndex];
    const newItems = [...portfolioItems];

    // Remove dragged item
    newItems.splice(draggedIndex, 1);

    // Insert at new position
    newItems.splice(dropIndex, 0, draggedItem);

    form.setValue("portfolioItems", newItems);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Portfolio Items</h3>
          <p className="text-sm text-muted-foreground">
            Showcase your best work and projects. Drag to reorder.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPortfolioItem}
          disabled={portfolioItems.length >= 15}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Item
        </Button>
      </div>

      {/* Featured items alert */}
      {featuredCount >= 5 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You&apos;ve reached the maximum of 5 featured items. Unfeature an
            item to feature another.
          </AlertDescription>
        </Alert>
      )}

      {/* Portfolio Items */}
      {portfolioItems.length > 0 ? (
        <div className="space-y-6">
          {portfolioItems.map((item, index) => (
            <Card
              key={item.id || item.tempId}
              className={cn(
                "p-6 transition-all",
                draggedIndex === index && "opacity-50",
                item.isFeatured && "ring-2 ring-primary"
              )}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="space-y-6">
                {/* Header with drag handle and controls */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    <Folder className="h-5 w-5" />
                    <h4 className="font-medium">
                      {item.title || `Portfolio Item ${index + 1}`}
                    </h4>
                    {item.id && (
                      <Badge variant="secondary" className="text-xs">
                        Saved
                      </Badge>
                    )}
                    {item.isFeatured && (
                      <Badge variant="default" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`featured-${item.id || item.tempId}`}
                        checked={item.isFeatured || false}
                        onCheckedChange={() => toggleFeatured(index)}
                        disabled={!item.isFeatured && featuredCount >= 5}
                      />
                      <Label
                        htmlFor={`featured-${item.id || item.tempId}`}
                        className="text-sm cursor-pointer"
                      >
                        Featured
                      </Label>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePortfolioItem(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`portfolioItems.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Title *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="My Awesome Project" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`portfolioItems.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Project URL (optional)
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://project-demo.com"
                          />
                        </FormControl>
                        <FormDescription>
                          Link to live demo, GitHub repo, or case study
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name={`portfolioItems.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe the project, your role, technologies used, and key achievements..."
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        Explain what the project is about and your contribution
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Media Upload - Using Unified Component */}
                <div className="space-y-3">
                  <FormLabel className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Project Media
                  </FormLabel>

                  <UnifiedMediaUpload
                    control={form.control}
                    name={`portfolioItems.${index}.media`}
                    label=""
                    description="Upload images, videos, or documents showcasing your project (max 10 files)"
                    maxFiles={10}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No portfolio items added yet</p>
          <p className="text-sm">Showcase your best work and projects</p>
        </div>
      )}

      {/* Portfolio Summary */}
      {portfolioItems.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Portfolio Summary</h4>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{portfolioItems.length} items</Badge>
              {featuredCount > 0 && (
                <Badge variant="default">
                  <Star className="h-3 w-3 mr-1" />
                  {featuredCount} featured
                </Badge>
              )}
            </div>
          </div>
          <div className="grid gap-2 text-sm">
            {portfolioItems.map((item, index) => (
              <div
                key={item.id || item.tempId}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground w-6">
                    #{index + 1}
                  </span>
                  <Folder className="h-4 w-4" />
                  <span className="font-medium">
                    {item.title || `Portfolio Item ${index + 1}`}
                  </span>
                  {item.isFeatured && <Star className="h-3 w-3 text-primary" />}
                  {item.url && (
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                <div className="text-muted-foreground">
                  {item.media?.length || 0} files
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
