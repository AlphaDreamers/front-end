"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Info,
  Package,
  Image as ImageIcon,
  Loader2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { updateGig } from "@/lib/actions/gigs";
import { GigFormSchema } from "@/lib/types/forms";
import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";

import FormInput from "@/components/forms/form-input";
import FormTextarea from "@/components/forms/form-textarea";
import MediaUpload from "@/components/forms/media-upload";
import Packages from "@/components/forms/packages";
import FormCombobox from "@/components/forms/form-combobox";
import Link from "next/link";
import { KeyValuePair } from "@/lib/types";
import FormMultiCombobox from "../forms/form-multicombobox";

type EditGigFormData = z.infer<typeof GigFormSchema>;

interface EditGigFormProps {
  gig: EditGigFormData;
  categories: KeyValuePair[];
  tags: KeyValuePair[];
}

export default function EditGigForm({
  gig,
  categories,
  tags,
}: EditGigFormProps) {
  const router = useRouter();

  const form = useForm<EditGigFormData>({
    resolver: zodResolver(GigFormSchema),
    defaultValues: gig,
  });

  const onSubmit = async (values: EditGigFormData) => {
    try {
      const result = await updateGig(values);

      if (result.success) {
        toast.success("Gig updated successfully!");
        router.push(`/dashboard/gigs`);
        router.refresh();
      } else {
        throw new Error(result.error || "Failed to update gig");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update gig";
      toast.error(message);
      form.setError("root", { message });
    }
  };

  const isLoading = form.formState.isSubmitting;

  const calculateProgress = () => {
    const values = form.getValues();
    let completed = 0;
    const total = 6;

    if (values.title && values.description) completed++;
    if (values.categoryId) completed++;
    if (values.tags.length > 0) completed++;
    if (values.features.length > 0) completed++;
    if (values.packages.length > 0) completed++;
    if (values.media.length > 0) completed++;

    return (completed / total) * 100;
  };

  const progress = calculateProgress();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Header with Progress */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/gigs"
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  size: "icon",
                })
              )}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Edit Gig</h1>
              <p className="text-muted-foreground mt-2">
                Update your service details and settings
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Section 1: Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Update your service details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormInput
              control={form.control}
              name="title"
              icon={Package}
              label="Gig Title"
              placeholder="I will design a professional logo for your business"
              description="Create a clear, searchable title that describes your service"
              required
            />

            <FormTextarea
              control={form.control}
              name="description"
              label="Description"
              icon={Package}
              placeholder="Describe your service in detail..."
              description="Explain what you offer, your process, and what makes you unique"
              required
            />

            <div className="grid gap-6 md:grid-cols-2">
              <FormCombobox
                control={form.control}
                name="categoryId"
                label={{ singular: "Category", plural: "Categories" }}
                icon={Package}
                placeholder="Select a category"
                values={categories}
                description="Choose the most relevant category for your gig"
                required
              />

              <FormMultiCombobox
                control={form.control}
                name="tags"
                label={{ singular: "Tag", plural: "Tags" }}
                icon={Package}
                placeholder="Select tags"
                values={tags}
                description="Add keywords to help buyers find your gig"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Packages & Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Packages & Pricing
            </CardTitle>
            <CardDescription>
              Update your service tiers and pricing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Packages form={form} features={form.watch("features")} />
          </CardContent>
        </Card>

        {/* Section 3: Gallery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Gallery
            </CardTitle>
            <CardDescription>
              Update media files that showcase your work (max 10 files)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MediaUpload
              control={form.control}
              name="media"
              maxFiles={10}
              requireImage={true}
              description="The first image will be your gig's thumbnail. Upload images, videos, documents, or audio files."
            />
          </CardContent>
        </Card>

        {/* Form Error Display */}
        {form.formState.errors.root && (
          <div className="rounded-md bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              {form.formState.errors.root.message}
            </p>
          </div>
        )}

        {/* Submit Section */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                Update Gig
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
