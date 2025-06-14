"use client";

import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import {
  Plus,
  X,
  Image as ImageIcon,
  ExternalLink,
  Folder,
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
import FormImageUpload from "./form-image-upload";
import { Badge } from "@/components/ui/badge";

interface FormPortfolioItemsProps {
  form: UseFormReturn<any>;
}

// Generate a unique temp ID
const generateTempId = () => `temp_${Date.now()}_${Math.random()}`;

export default function FormPortfolioItems({ form }: FormPortfolioItemsProps) {
  const portfolioItems = form.watch("portfolioItems") || [];

  const addPortfolioItem = () => {
    const newItem = {
      tempId: generateTempId(),
      title: "",
      description: "",
      url: "",
      images: [],
    };

    form.setValue("portfolioItems", [...portfolioItems, newItem]);
  };

  const removePortfolioItem = (index: number) => {
    const newItems = portfolioItems.filter((_, i) => i !== index);
    form.setValue("portfolioItems", newItems);
  };

  const updatePortfolioItem = (index: number, field: string, value: any) => {
    const newItems = [...portfolioItems];
    newItems[index] = { ...newItems[index], [field]: value };
    form.setValue("portfolioItems", newItems);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Portfolio Items</h3>
          <p className="text-sm text-muted-foreground">
            Showcase your best work and projects
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

      {/* Portfolio Items */}
      {portfolioItems.length > 0 ? (
        <div className="space-y-6">
          {portfolioItems.map((item, index) => (
            <Card key={item.id || item.tempId} className="p-6">
              <div className="space-y-6">
                {/* Header with remove button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Folder className="h-5 w-5" />
                    <h4 className="font-medium">
                      {item.title || `Portfolio Item ${index + 1}`}
                    </h4>
                    {item.id && (
                      <Badge variant="secondary" className="text-xs">
                        Existing
                      </Badge>
                    )}
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

                {/* Basic Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`portfolioItems.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="My Awesome Project"
                            onChange={(e) => {
                              field.onChange(e);
                              updatePortfolioItem(
                                index,
                                "title",
                                e.target.value
                              );
                            }}
                          />
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
                            onChange={(e) => {
                              field.onChange(e);
                              updatePortfolioItem(index, "url", e.target.value);
                            }}
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe the project, your role, technologies used, and key achievements..."
                          rows={3}
                          onChange={(e) => {
                            field.onChange(e);
                            updatePortfolioItem(
                              index,
                              "description",
                              e.target.value
                            );
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Explain what the project is about and your contribution
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Images */}
                <div className="space-y-3">
                  <FormLabel className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Project Images
                  </FormLabel>
                  <FormField
                    control={form.control}
                    name={`portfolioItems.${index}.images`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormImageUpload
                            control={form.control}
                            name={`portfolioItems.${index}.images`}
                            label=""
                            description="Upload images showcasing your project (max 8 images)"
                            maxImages={8}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Preview */}
                {(item.title || item.url || item.description) && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h5 className="font-medium mb-2">Preview</h5>
                    <div className="space-y-2 text-sm">
                      {item.title && (
                        <p>
                          <strong>Title:</strong> {item.title}
                        </p>
                      )}
                      {item.url && (
                        <p>
                          <strong>URL:</strong>{" "}
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {item.url}
                          </a>
                        </p>
                      )}
                      {item.description && (
                        <p>
                          <strong>Description:</strong> {item.description}
                        </p>
                      )}
                      <p>
                        <strong>Images:</strong> {item.images?.length || 0}{" "}
                        uploaded
                      </p>
                    </div>
                  </div>
                )}
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
            <Badge variant="secondary">{portfolioItems.length} items</Badge>
          </div>
          <div className="grid gap-2 text-sm">
            {portfolioItems.map((item, index) => (
              <div
                key={item.id || item.tempId}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  <span className="font-medium">
                    {item.title || `Portfolio Item ${index + 1}`}
                  </span>
                  {item.url && (
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ImageIcon className="h-3 w-3" />
                  <span className="text-xs">
                    {item.images?.length || 0} images
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
