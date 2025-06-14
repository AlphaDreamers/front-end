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

import { updateGig } from "@/lib/actions/gig";
import { EditGigFormSchema } from "@/lib/schemas";
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

// Import our reusable form components
import FormInput from "@/components/forms/form-input";
import FormTextarea from "@/components/forms/form-textarea";
import FormImageUpload from "@/components/forms/form-image-upload";
import FormPackages from "@/components/forms/form-packages";
import { KeyValuePair } from "@/lib/types";
import Link from "next/link";
import FormCombobox from "../forms/form-combobox";
import FormMultiCombobox from "../forms/form-multicombobox";

interface EditGigFormProps {
  gig: z.infer<typeof EditGigFormSchema>;
  categories: KeyValuePair[];
  tags: KeyValuePair[];
}

export default function EditGigForm({
  gig,
  categories,
  tags,
}: EditGigFormProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof EditGigFormSchema>>({
    resolver: zodResolver(EditGigFormSchema),
    defaultValues: gig,
  });
  const onSubmit = async (values: z.infer<typeof EditGigFormSchema>) =>
    toast.promise(async () => updateGig(values), {
      loading: "Updating gig...",
      success: () => {
        router.push(`/dashboard/gigs`);
        return "Gig updated successfully!";
      },
      error: (err) => {
        const ms = err instanceof Error ? err.message : "Failed to update gig";
        form.setError("root", { message: ms });
        return ms;
      },
    });
  const isLoading = form.formState.isSubmitting;

  const calculateProgress = () => {
    const values = form.getValues();
    let completed = 0;
    const total = 6; // Total number of required sections

    if (values.title && values.description) completed++;
    if (values.categoryId) completed++;
    if (values.tags.length > 0) completed++;
    if (values.features.length > 0) completed++;
    if (values.packages.length > 0) completed++;
    if (values.images.length > 0) completed++;

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
              <ArrowLeft />
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
              placeholder="Describe your service in detail..."
              description="Explain what you offer, your process, and what makes you unique"
              rows={6}
              required
            />

            <div className="grid gap-6 md:grid-cols-2">
              <FormCombobox
                control={form.control}
                name="categoryId"
                label="Category"
                topic={{
                  singular: "Category",
                  plural: "Categories",
                }}
                icon={Package}
                placeholder="Select a framework"
                values={categories}
                description="Choose the most relevant category for your gig"
              />
              <FormMultiCombobox
                control={form.control}
                name="tags"
                label="Tags"
                icon={Package}
                topic={{
                  singular: "Tag",
                  plural: "Tags",
                }}
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
            <FormPackages form={form} features={form.watch("features")} />
          </CardContent>
        </Card>

        {/* Section 3: Gallery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="size-5" />
              Gallery
            </CardTitle>
            <CardDescription>
              Update images that showcase your work (max 8 images)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormImageUpload
              control={form.control}
              name="images"
              maxImages={8}
              description="The first image will be your gig's thumbnail. You can replace existing images or add new ones."
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <span>Update Gig</span>
                <ArrowRight />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
