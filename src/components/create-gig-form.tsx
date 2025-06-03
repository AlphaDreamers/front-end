"use client";

import Image from "next/image";
import {
  X,
  Plus,
  ChevronsUpDown,
  Check,
  Info,
  ListChecks,
  Loader2,
  LucideIcon,
  Package,
  Save,
  Image as ImageIcon,
  Award,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Checkbox } from "./ui/checkbox";

import { createGig } from "@/lib/actions";
import { CreateGigFormSchema } from "@/lib/schemas";

interface CreateGigFormProps {
  categories: Prisma.CategoryGetPayload<{
    select: { id: true; label: true };
  }>[];
  tags: Prisma.TagGetPayload<{
    select: { id: true; label: true };
  }>[];
}

type TabType = "basic-info" | "features" | "packages" | "images";

const CreateGigForm = ({ categories, tags }: CreateGigFormProps) => {
  const { push } = useRouter();

  const form = useForm({
    resolver: zodResolver(CreateGigFormSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      tags: [{ id: "" }],
      features: [
        {
          label: "Standard Delivery",
        },
        {
          label: "Revisions",
        },
        {
          label: "Source Files",
        },
      ],
      packages: [
        {
          title: "Basic",
          deliveryTime: 3,
          price: 5,
          revisions: 1,
          featureInclusions: [true, false, false],
        },
        {
          title: "Standard",
          deliveryTime: 2,
          price: 10,
          revisions: 2,
          featureInclusions: [true, true, false],
        },
        {
          title: "Premium",
          deliveryTime: 1,
          price: 20,
          revisions: 3,
          featureInclusions: [true, true, true],
        },
      ],
      images: [],
    },
  });

  const onSubmit = (values: z.infer<typeof CreateGigFormSchema>) =>
    toast.promise(async () => createGig(values), {
      loading: "Creating gig...",
      success: () => {
        push("/dashboard/gigs");

        return "Gig created successfully!";
      },
      error: (err) => {
        const ms = err instanceof Error ? err.message : "Something went wrong";

        form.setError("root", {
          type: "manual",
          message: ms,
        });

        return ms;
      },
    });

  const isLoading = form.formState.isSubmitting;

  const [tab, setTab] = useState<TabType>("basic-info");

  const handleTabNext = () => {
    if (tab === "basic-info") {
      setTab("features");
    } else if (tab === "features") {
      setTab("packages");
    } else if (tab === "packages") {
      setTab("images");
    }
  };

  const handleTabPrevious = () => {
    if (tab === "features") {
      setTab("basic-info");
    } else if (tab === "packages") {
      setTab("features");
    } else if (tab === "images") {
      setTab("packages");
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Create New Gig</h1>
          <p className="text-muted-foreground mt-1">
            Define your service and set your pricing
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs
            className="flex flex-col lg:flex-row gap-8"
            value={tab}
            onValueChange={(val) => setTab(val as TabType)}
          >
            <TabsList className="w-full flex flex-row lg:flex-col lg:w-64 min-h-fit">
              {sections.map((section) => {
                return (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className="flex items-center w-full lg:min-h-10"
                  >
                    <div className="flex-1 flex items-center gap-2">
                      <section.icon />
                      <span className={"text-sm font-medium"}>
                        {section.label}
                      </span>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="flex-1 space-y-4">
              <TabsContent value="basic-info">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">
                      Basic Information
                    </CardTitle>
                    <CardDescription>
                      Provide the essential details about your gig
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gig Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="I will design a professional logo for your business"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Create a clear, concise title that describes your
                            service.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your service in detail..."
                              className="resize-none min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Provide a detailed description of your service,
                            including what clients will receive and your
                            process.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Category</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? categories.find(
                                        (cat) => cat.id === field.value
                                      )?.label
                                    : "Select category"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search category..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    No category found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {categories.map((cat) => (
                                      <CommandItem
                                        value={cat.label}
                                        key={cat.id}
                                        onSelect={() => {
                                          form.setValue("categoryId", cat.id);
                                        }}
                                      >
                                        {cat.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            cat.id === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Choose a category that best fits your gig. This
                            helps buyers find your service.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-2 gap-4">
                              {field.value?.map((tag, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <FormField
                                    control={form.control}
                                    name={`tags.${index}.id`}
                                    render={({ field }) => (
                                      <FormItem className="flex-1 flex flex-col">
                                        <Popover>
                                          <PopoverTrigger asChild>
                                            <FormControl>
                                              <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                  "w-full justify-between",
                                                  !field.value &&
                                                    "text-muted-foreground"
                                                )}
                                              >
                                                {field.value
                                                  ? tags.find(
                                                      (tag) =>
                                                        tag.id === field.value
                                                    )?.label
                                                  : "Select tag"}
                                                <ChevronsUpDown className="opacity-50" />
                                              </Button>
                                            </FormControl>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                            <Command>
                                              <CommandInput
                                                placeholder="Search tag..."
                                                className="h-9"
                                              />
                                              <CommandList>
                                                <CommandEmpty>
                                                  No tags found.
                                                </CommandEmpty>
                                                <CommandGroup>
                                                  {tags.map((tag) => (
                                                    <CommandItem
                                                      value={tag.label}
                                                      key={tag.id}
                                                      onSelect={() => {
                                                        form.setValue(
                                                          `tags.${index}.id`,
                                                          tag.id
                                                        );
                                                      }}
                                                    >
                                                      {tag.label}
                                                      <Check
                                                        className={cn(
                                                          "ml-auto",
                                                          tag.id === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                        )}
                                                      />
                                                    </CommandItem>
                                                  ))}
                                                </CommandGroup>
                                              </CommandList>
                                            </Command>
                                          </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <Button
                                    variant="destructive"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const updatedTags = field.value.filter(
                                        (t) => t !== tag
                                      );
                                      if (updatedTags.length !== 0) {
                                        form.setValue("tags", updatedTags);
                                      }
                                    }}
                                    disabled={field.value.length <= 1}
                                  >
                                    <X />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                className="mr-12"
                                onClick={(e) => {
                                  e.preventDefault();
                                  form.setValue("tags", [
                                    ...field.value,
                                    {
                                      id: "",
                                    },
                                  ]);
                                }}
                              >
                                <Plus />
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Add relevant keywords to help buyers find your gig.
                            Press Enter or click Add after each tag.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">
                      Gig Features
                    </CardTitle>
                    <CardDescription>
                      Add features that your gig will offer to buyers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="features"
                      render={({ field: fField }) => (
                        <FormItem>
                          <FormLabel>Features</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {fField.value?.map((_, index) => (
                                <FormField
                                  key={index}
                                  control={form.control}
                                  name={`features.${index}.label`}
                                  render={({ field: singleFField }) => (
                                    <FormItem>
                                      <FormControl>
                                        <div className="flex items-center gap-2">
                                          <Input
                                            placeholder="e.g. Responsive Design"
                                            {...singleFField}
                                          />
                                          <Button
                                            variant="destructive"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              if (fField.value.length >= 1) {
                                                fField.onChange(
                                                  fField.value.filter(
                                                    (_, i) => i !== index
                                                  )
                                                );
                                                const packages =
                                                  form.getValues("packages");
                                                packages.forEach(
                                                  (pck, pkgIndex) => {
                                                    form.setValue(
                                                      `packages.${pkgIndex}.featureInclusions`,
                                                      pck.featureInclusions.filter(
                                                        (_, i) => i !== index
                                                      )
                                                    );
                                                  }
                                                );
                                              }
                                            }}
                                            disabled={fField.value.length <= 1}
                                          >
                                            <X />
                                          </Button>
                                        </div>
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              ))}

                              <Button
                                variant="outline"
                                className="mr-12"
                                onClick={(e) => {
                                  e.preventDefault();

                                  fField.onChange([
                                    ...fField.value,
                                    { label: "" },
                                  ]);
                                  const packages = form.getValues("packages");
                                  packages.forEach((pck, pkgIndex) => {
                                    form.setValue(
                                      `packages.${pkgIndex}.featureInclusions`,
                                      [...pck.featureInclusions, false]
                                    );
                                  });
                                }}
                              >
                                <Plus />
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Add features that your gig will offer to buyers. You
                            can add multiple features.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="packages">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">
                      Pricing Packages
                    </CardTitle>
                    <CardDescription>
                      Define what you offer in each package and set your prices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="packages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Packages</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                              {field.value.map((pkg, index) => (
                                <Card key={index} className="bg-accent">
                                  <CardHeader>
                                    <CardTitle className="text-lg font-semibold">
                                      {pkg.title || `Package ${index + 1}`}
                                    </CardTitle>
                                    <CardDescription>
                                      Customize your{" "}
                                      {pkg.title || `Package ${index + 1}`}{" "}
                                      package
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="flex flex-col gap-4">
                                    <FormField
                                      control={form.control}
                                      name={`packages.${index}.title`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Package Name</FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="Enter package name"
                                              {...field}
                                            />
                                          </FormControl>
                                          <FormDescription>
                                            This name will be visible to buyers.
                                            Make it descriptive and appealing.
                                          </FormDescription>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                      <FormField
                                        control={form.control}
                                        name={`packages.${index}.deliveryTime`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>
                                              Delivery Time (days)
                                            </FormLabel>
                                            <FormControl>
                                              <Input
                                                type="number"
                                                min="1"
                                                {...field}
                                                onChange={(e) =>
                                                  field.onChange(
                                                    e.target.valueAsNumber
                                                  )
                                                }
                                              />
                                            </FormControl>
                                            <FormDescription>
                                              Specify the delivery time for this
                                              package.
                                            </FormDescription>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        control={form.control}
                                        name={`packages.${index}.revisions`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Revisions</FormLabel>
                                            <FormControl>
                                              <Input
                                                type="number"
                                                min="0"
                                                {...field}
                                                onChange={(e) =>
                                                  field.onChange(
                                                    e.target.valueAsNumber
                                                  )
                                                }
                                              />
                                            </FormControl>
                                            <FormDescription>
                                              Specify the number of revisions
                                              included.
                                            </FormDescription>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>

                                    <FormField
                                      control={form.control}
                                      name={`packages.${index}.price`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Price (SOL)</FormLabel>
                                          <FormControl>
                                            <Input
                                              type="number"
                                              min="0.01"
                                              step="0.01"
                                              {...field}
                                              onChange={(e) =>
                                                field.onChange(
                                                  e.target.valueAsNumber
                                                )
                                              }
                                            />
                                          </FormControl>
                                          <FormDescription>
                                            Set the price for this package in
                                            SOL.
                                          </FormDescription>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name={`packages.${index}.featureInclusions`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>
                                            Package Features
                                          </FormLabel>
                                          <FormControl>
                                            <div className="flex flex-col gap-2">
                                              {field.value?.map((_, fIndex) => (
                                                <FormField
                                                  key={fIndex}
                                                  control={form.control}
                                                  name={`packages.${index}.featureInclusions.${fIndex}`}
                                                  render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-1 space-y-0 rounded-md border p-2 shadow">
                                                      <FormControl>
                                                        <Checkbox
                                                          checked={field.value}
                                                          onCheckedChange={
                                                            field.onChange
                                                          }
                                                        />
                                                      </FormControl>
                                                      <FormLabel>
                                                        {
                                                          form.getValues()
                                                            .features[fIndex]
                                                            .label
                                                        }
                                                      </FormLabel>
                                                      <FormMessage />
                                                    </FormItem>
                                                  )}
                                                />
                                              ))}
                                            </div>
                                          </FormControl>
                                          <FormDescription>
                                            Select the features included in this
                                            package.
                                          </FormDescription>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </CardContent>
                                </Card>
                              ))}
                              <Button
                                size="lg"
                                variant="outline"
                                onClick={() =>
                                  field.onChange([
                                    ...field.value,
                                    {
                                      title: "",
                                      deliveryTime: 1,
                                      revisions: 0,
                                      price: 0,
                                      featureInclusions: Array(
                                        field.value[0]?.featureInclusions
                                          ?.length || 0
                                      ).fill(false),
                                    },
                                  ])
                                }
                              >
                                Add Package
                                <Plus />
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Define the packages you offer for your gig. Each
                            package can have a different price, delivery time,
                            and included features.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="images">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">
                      Gig Images
                    </CardTitle>
                    <CardDescription>
                      Upload images that showcase your work and attract buyers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field: iField }) => (
                        <FormItem>
                          <FormLabel>Upload Images</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {iField.value.map((_, singleIIndex) => (
                                <FormField
                                  key={singleIIndex}
                                  control={form.control}
                                  name={`images.${singleIIndex}`}
                                  render={({ field: singleIField }) => (
                                    <FormItem key={singleIIndex}>
                                      <FormControl>
                                        <Button
                                          variant="outline"
                                          className="relative aspect-square min-w-full h-full p-0 group"
                                        >
                                          <Image
                                            src={URL.createObjectURL(
                                              singleIField.value.file
                                            )}
                                            alt={singleIField.value.file.name}
                                            fill
                                            className="object-cover rounded"
                                          />
                                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                            <Button
                                              variant="destructive"
                                              size="icon"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                const updatedImages =
                                                  iField.value.filter(
                                                    (_, i) => i !== singleIIndex
                                                  );
                                                if (
                                                  updatedImages.length !== 0
                                                ) {
                                                  iField.onChange(
                                                    updatedImages
                                                  );
                                                }
                                              }}
                                            >
                                              <X />
                                            </Button>
                                            <Button
                                              variant={
                                                iField.value[singleIIndex]
                                                  .isPrimary
                                                  ? "default"
                                                  : "secondary"
                                              }
                                              size="icon"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                const updatedImages =
                                                  iField.value.map((img, i) => {
                                                    return {
                                                      ...img,
                                                      isPrimary:
                                                        i === singleIIndex,
                                                    };
                                                  });
                                                iField.onChange(updatedImages);
                                              }}
                                            >
                                              <Award />
                                            </Button>
                                          </div>
                                        </Button>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              ))}
                              <Button className="relative aspect-square min-w-full h-full p-0">
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  className="absolute opacity-0 rounded min-w-full min-h-full"
                                  onChange={(e) => {
                                    const files = e.target.files;
                                    if (files) {
                                      const fileArray = Array.from(files).map(
                                        (file) => ({
                                          file,
                                          isPrimary: false,
                                        })
                                      );

                                      iField.onChange([
                                        ...iField.value,
                                        ...fileArray,
                                      ]);

                                      e.target.value = "";
                                    }
                                  }}
                                />
                                <Plus className="size-12" />
                              </Button>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <div className="flex flex-col-reverse sm:flex-row justify-between gap-4">
                <div className="flex gap-2">
                  <Link
                    className={buttonVariants({
                      variant: "destructive",
                    })}
                    href="/dashboard/gigs"
                  >
                    Cancel
                  </Link>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    disabled={isLoading || tab === "basic-info"}
                    onClick={handleTabPrevious}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={isLoading || tab === "packages"}
                    onClick={handleTabNext}
                  >
                    Next
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="ml-auto"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <Save className="mr-2" />
                        Save & Publish
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Tabs>
        </form>
      </Form>
    </div>
  );
};

export default CreateGigForm;

const sections: {
  id: TabType;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    id: "basic-info",
    label: "Basic Info",
    icon: Info,
  },
  {
    id: "features",
    label: "Features",
    icon: ListChecks,
  },
  {
    id: "packages",
    label: "Packages",
    icon: Package,
  },
  {
    id: "images",
    label: "Images",
    icon: ImageIcon,
  },
];
