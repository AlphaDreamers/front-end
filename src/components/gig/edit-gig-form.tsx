"use client";

import { useState } from "react";
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
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

import { updateGig } from "@/lib/actions";
import { EditGigFormSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import our reusable form components
import FormInput from "@/components/form-fields/form-input";
import FormTextarea from "@/components/form-fields/form-textarea";
import FormSelect from "@/components/form-fields/form-select";
import FormMultiSelect from "@/components/form-fields/form-multi-select";
import FormImageUpload from "@/components/form-fields/form-image-upload";
import FormPackages from "@/components/form-fields/form-packages";

// Define the shape of data we expect from the page
interface EditGigFormProps {
  gig: {
    id: string;
    title: string;
    description: string;
    categoryId: string;
    tags: string[];
    features: Array<{ id: string; label: string }>;
    packages: Array<{
      id: string;
      title: string;
      deliveryTime: number;
      price: number;
      revisions: number;
      featureInclusions: boolean[];
    }>;
    images: Array<{
      type: "existing";
      id: string;
      url: string;
      isPrimary: boolean;
    }>;
  };
  categories: Array<{ id: string; title: string; icon: string; color: string }>;
  tags: Array<{ id: string; title: string }>;
}

export default function EditGigForm({
  gig,
  categories,
  tags,
}: EditGigFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with existing gig data
  const form = useForm<z.infer<typeof EditGigFormSchema>>({
    resolver: zodResolver(EditGigFormSchema),
    defaultValues: {
      id: gig.id,
      title: gig.title,
      description: gig.description,
      categoryId: gig.categoryId,
      tags: gig.tags,
      features: gig.features,
      packages: gig.packages,
      images: gig.images,
    },
  });

  // Calculate form completion percentage for progress bar
  // This is the same logic as the create form
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

  const onSubmit = async (values: z.infer<typeof EditGigFormSchema>) => {
    setIsSubmitting(true);

    try {
      await updateGig(values);

      toast.success("Gig updated successfully!", {
        description: "Your changes have been saved.",
      });

      // Navigate back to the gig details or dashboard
      router.push(`/dashboard/gigs/${gig.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update gig";

      toast.error("Failed to update gig", {
        description: message,
      });

      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Header with Progress */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
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

        {/* Form Errors Alert */}
        {form.formState.errors.root && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}

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
              <FormSelect
                control={form.control}
                name="categoryId"
                label="Category"
                placeholder="Select a category"
                options={categories.map((cat) => ({
                  label: cat.title,
                  value: cat.id,
                }))}
                description="Choose the most relevant category"
                required
              />

              <FormMultiSelect
                control={form.control}
                name="tags"
                label="Tags"
                placeholder="Select tags"
                options={tags.map((tag) => ({
                  label: tag.title,
                  value: tag.id,
                }))}
                description="Add keywords to help buyers find you"
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
              <ImageIcon className="h-5 w-5" />
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

        {/* Submit Section */}
        <div className="flex items-center justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <div className="flex items-center gap-4">
            {progress === 100 && (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Ready to update
              </span>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || progress < 100}
              className="min-w-[150px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Gig"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
