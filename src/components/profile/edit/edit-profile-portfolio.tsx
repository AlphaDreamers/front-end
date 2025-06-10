"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Plus, X, Edit2, ExternalLink, Image as ImageIcon } from "lucide-react";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import FormImageUpload from "@/components/forms/form-image-upload";

import { UpdateProfileFormSchema } from "@/lib/schemas";

interface EditProfilePortfolioProps {
  form: UseFormReturn<z.infer<typeof UpdateProfileFormSchema>>;
}

export default function EditProfilePortfolio({
  form,
}: EditProfilePortfolioProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Local state for the portfolio item being edited
  const [tempItem, setTempItem] = useState({
    title: "",
    description: "",
    url: "",
    images: [] as any[],
  });

  const portfolioItems = form.watch("portfolioItems");

  const openDialog = (index?: number) => {
    if (index !== undefined) {
      // Editing existing item
      const item = portfolioItems[index];
      setTempItem({
        title: item.title,
        description: item.description,
        url: item.url,
        images: [...item.images],
      });
      setEditingIndex(index);
    } else {
      // Adding new item
      setTempItem({
        title: "",
        description: "",
        url: "",
        images: [],
      });
      setEditingIndex(null);
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingIndex(null);
    setTempItem({
      title: "",
      description: "",
      url: "",
      images: [],
    });
  };

  const savePortfolioItem = () => {
    const currentItems = form.getValues("portfolioItems");

    if (editingIndex !== null) {
      // Update existing item
      currentItems[editingIndex] = {
        ...currentItems[editingIndex],
        ...tempItem,
      };
    } else {
      // Add new item
      currentItems.push({
        tempId: `temp_${Date.now()}`,
        ...tempItem,
      });
    }

    form.setValue("portfolioItems", currentItems);
    closeDialog();
  };

  const removePortfolioItem = (index: number) => {
    const currentItems = form.getValues("portfolioItems");
    form.setValue(
      "portfolioItems",
      currentItems.filter((_, i) => i !== index)
    );
  };

  const getPrimaryImage = (images: any[]) => {
    const primary = images.find((img) => img.isPrimary);
    if (primary) {
      return primary.type === "existing"
        ? primary.url
        : URL.createObjectURL(primary.file);
    }
    if (images.length > 0) {
      const firstImage = images[0];
      return firstImage.type === "existing"
        ? firstImage.url
        : URL.createObjectURL(firstImage.file);
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="portfolioItems"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Portfolio</FormLabel>
            <FormDescription>
              Showcase your best work to potential clients
            </FormDescription>
            <FormControl>
              <div className="space-y-4">
                {/* Portfolio Items Grid */}
                {portfolioItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {portfolioItems.map((item, index) => (
                      <Card
                        key={item.id || item.tempId || index}
                        className="overflow-hidden"
                      >
                        <div className="aspect-video relative bg-muted">
                          {getPrimaryImage(item.images) ? (
                            <img
                              src={getPrimaryImage(item.images)!}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ImageIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium line-clamp-1">
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => openDialog(index)}
                            >
                              <Edit2 className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            {item.url && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePortfolioItem(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center border-dashed">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No portfolio items yet. Add your best work to showcase
                      your skills.
                    </p>
                  </Card>
                )}

                {/* Add Portfolio Item Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => openDialog()}
                  disabled={portfolioItems.length >= 10}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Portfolio Item
                  {portfolioItems.length >= 10 && " (Maximum reached)"}
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Portfolio Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? "Edit" : "Add"} Portfolio Item
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={tempItem.title}
                onChange={(e) =>
                  setTempItem({ ...tempItem, title: e.target.value })
                }
                placeholder="Project title"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={tempItem.description}
                onChange={(e) =>
                  setTempItem({ ...tempItem, description: e.target.value })
                }
                placeholder="Describe your project..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Project URL (optional)
              </label>
              <Input
                value={tempItem.url}
                onChange={(e) =>
                  setTempItem({ ...tempItem, url: e.target.value })
                }
                placeholder="https://example.com"
                type="url"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Images</label>
              <FormImageUpload
                control={
                  {
                    register: () => ({}),
                    unregister: () => {},
                    getFieldState: () => ({ invalid: false, error: undefined }),
                    _defaultValues: {},
                    _fields: {},
                    _formState: {} as any,
                    _names: {} as any,
                    _proxyFormState: {} as any,
                    _subjects: {} as any,
                    _state: {} as any,
                  } as any
                }
                name="tempImages"
                label=""
                description="Upload images of your work"
                maxImages={5}
                value={tempItem.images}
                onChange={(images) => setTempItem({ ...tempItem, images })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={savePortfolioItem}
              disabled={!tempItem.title.trim() || tempItem.images.length === 0}
            >
              {editingIndex !== null ? "Save Changes" : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
