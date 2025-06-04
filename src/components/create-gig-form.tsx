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
} from "lucide-react";

import { createGig } from "@/lib/actions";
import { CreateGigFormSchema } from "@/lib/schemas";
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

interface CreateGigFormProps {
  categories: Array<{ id: string; title: string; icon: string; color: string }>;
  tags: Array<{ id: string; title: string }>;
}

export default function CreateGigForm({
  categories,
  tags,
}: CreateGigFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof CreateGigFormSchema>>({
    resolver: zodResolver(CreateGigFormSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      tags: [],
      features: [
        { label: "Standard Delivery" },
        { label: "Revisions Included" },
        { label: "Source Files" },
      ],
      packages: [
        {
          title: "Basic",
          deliveryTime: 3,
          price: 50,
          revisions: 1,
          featureInclusions: [true, false, false],
        },
        {
          title: "Standard",
          deliveryTime: 2,
          price: 100,
          revisions: 2,
          featureInclusions: [true, true, false],
        },
        {
          title: "Premium",
          deliveryTime: 1,
          price: 200,
          revisions: -1, // Unlimited
          featureInclusions: [true, true, true],
        },
      ],
      images: [],
    },
  });

  // Calculate form completion percentage for progress bar
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

  const onSubmit = async (values: z.infer<typeof CreateGigFormSchema>) => {
    setIsSubmitting(true);

    try {
      await createGig(values);

      toast.success("Gig created successfully!", {
        description: "Your gig is now live and ready for orders.",
      });

      router.push("/dashboard/gigs");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create gig";

      toast.error("Failed to create gig", {
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
          <div>
            <h1 className="text-3xl font-bold">Create New Gig</h1>
            <p className="text-muted-foreground mt-2">
              Fill in the details below to create your service offering
            </p>
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
            <CardDescription>Tell buyers what you're offering</CardDescription>
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
              Create different tiers to offer buyers options
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
              Upload images that showcase your work (max 8 images)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormImageUpload
              control={form.control}
              name="images"
              maxImages={8}
              description="The first image will be your gig's thumbnail"
            />
          </CardContent>
        </Card>

        {/* Submit Section */}
        <div className="flex items-center justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/gigs")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <div className="flex items-center gap-4">
            {progress === 100 && (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Ready to publish
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
                  Creating...
                </>
              ) : (
                "Create Gig"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
