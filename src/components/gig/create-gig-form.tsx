"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Info, Package, Image as ImageIcon, Loader2 } from "lucide-react";

import { createGig } from "@/lib/actions/gigs";
import { GigFormSchema } from "@/lib/types/forms";

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

// Import our unified components
import FormInput from "@/components/forms/form-input";
import FormTextarea from "@/components/forms/form-textarea";
import UnifiedMediaUpload from "@/components/forms/media-upload";
import UnifiedPackages from "@/components/forms/packages";
import FormCombobox from "@/components/forms/form-combobox";
import { KeyValuePair } from "@/lib/types";
import FormMultiCombobox from "../forms/form-multicombobox";

// Use the same schema but without the id field for create
const CreateGigFormSchema = GigFormSchema.omit({ id: true });
type CreateGigFormData = z.infer<typeof CreateGigFormSchema>;

interface UnifiedCreateGigFormProps {
  categories: KeyValuePair[];
  tags: KeyValuePair[];
}

export default function UnifiedCreateGigForm({
  categories,
  tags,
}: UnifiedCreateGigFormProps) {
  const router = useRouter();

  const form = useForm<CreateGigFormData>({
    resolver: zodResolver(CreateGigFormSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      tags: [],
      features: [
        { title: "Standard Delivery" },
        { title: "Revisions Included" },
        { title: "Source Files" },
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
      media: [],
    },
  });

  const onSubmit = async (values: CreateGigFormData) => {
    try {
      const result = await createGig(values);

      if (result.success) {
        toast.success("Your gig has been published successfully!");
        router.push("/dashboard/gigs");
        router.refresh();
      } else {
        throw new Error(result.error || "Failed to create gig");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create gig";
      toast.error(message);
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: "smooth" });
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
    if (values.features.length > 0 && values.features.every((f) => f.title))
      completed++;
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

        {/* Section 1: Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Tell buyers what you&apos;re offering
            </CardDescription>
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
                label={{
                  singular: "Category",
                  plural: "Categories",
                }}
                icon={Package}
                placeholder="Select a category"
                values={categories}
                description="Choose the most relevant category for your gig"
                required
              />

              <FormMultiCombobox
                control={form.control}
                name="tags"
                label={{
                  singular: "Tag",
                  plural: "Tags",
                }}
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
              Create different tiers to offer buyers options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UnifiedPackages form={form} features={form.watch("features")} />
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
              Upload media files that showcase your work (max 10 files)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UnifiedMediaUpload
              control={form.control}
              name="media"
              maxFiles={10}
              requireImage={true}
              description="The first image will be your gig's thumbnail. Upload images, videos, documents, or audio files to showcase your work."
            />
          </CardContent>
        </Card>

        {/* Submit Section */}
        <div className="flex items-center justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/gigs")}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isLoading} className="min-w-[150px]">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Gig"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
