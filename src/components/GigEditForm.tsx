"use client";

import { useUser } from "@/components/SessionProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { updateGig } from "@/lib/actions";
import { EditGigFormSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, GigTag, Prisma } from "@prisma/client";
import {
  Award,
  Check,
  ChevronsUpDown,
  Clock,
  Plus,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface GigFormProps {
  tags: GigTag[];
  categories: Category[];
  gig: Prisma.GigGetPayload<{
    include: {
      images: true;
      category: true;
      tags: true;
      packages: {
        include: {
          orders: true;
          features: true;
        };
      };
    };
  }>;
}

const GigEditForm = ({ tags, categories, gig }: GigFormProps) => {
  const { user, isLoading } = useUser();
  const { push } = useRouter();
  const path = usePathname();

  const form = useForm({
    resolver: zodResolver(EditGigFormSchema),
    defaultValues: gig,
  });

  const onSubmit = async (data: z.infer<typeof EditGigFormSchema>) => {
    toast.promise(async () => updateGig(data), {
      loading: "Updating gig...",
      success: (data) => {
        toast.success("Gig updated successfully");
        redirect(`/gigs/${data.id}`);
      },
      error: (err) => {
        if (err instanceof Error) {
          return err.message;
        }
        return "Something went wrong";
      },
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoading && !user?.verified) {
    push(`/sign-in?callback-url=${path}`);
  }

  return (
    <main>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 text-primary">Update Gig</h1>
        <p className="text-muted-foreground mb-6">
          Update your gig details, images, and packages
        </p>
      </div>

      <Tabs defaultValue="basic-info">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Card>
              <TabsContent value="basic-info" className="space-y-6">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Provide details about your gig
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="I will create crypto art NFTs..."
                          />
                        </FormControl>
                        <FormDescription>Be specific and clear</FormDescription>
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
                                placeholder="Search categories..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>
                                  No categories found.
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
                          This is the language that will be used in the
                          dashboard.
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
                            {...field}
                            className="resize-none h-[100px]"
                            placeholder="Describe your service in detail..."
                          />
                        </FormControl>
                        <FormDescription>
                          Minimum 120 characters
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tags</FormLabel>
                        <div className="flex items-center gap-2 flex-wrap">
                          {field.value.map((tag) => (
                            <Button
                              key={tag.label}
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                field.onChange(
                                  field.value.filter(
                                    (t) => t.label !== tag.label
                                  )
                                )
                              }
                            >
                              {tag.label}
                              <X size={16} />
                            </Button>
                          ))}
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  role="combobox"
                                  variant="outline"
                                  size="sm"
                                  className={cn(
                                    "justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <Plus className="mx-auto" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search tags..."
                                  className="h-9"
                                />
                                <CommandList>
                                  <CommandEmpty>No tags found.</CommandEmpty>
                                  <CommandGroup>
                                    {tags.map((tag) => (
                                      <CommandItem
                                        value={tag.label}
                                        key={tag.label}
                                        onSelect={() => {
                                          if (
                                            field.value.some(
                                              (t) => t.label === tag.label
                                            )
                                          ) {
                                            field.onChange(
                                              field.value.filter(
                                                (t) => t.label !== tag.label
                                              )
                                            );
                                          } else {
                                            field.onChange([
                                              ...field.value,
                                              tag,
                                            ]);
                                          }
                                        }}
                                      >
                                        {tag.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            field.value.some(
                                              (t) => t.label === tag.label
                                            )
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
                        </div>
                        <FormDescription>
                          Select up to 5 tags to help buyers find your gig
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </TabsContent>

              <TabsContent value="images" className="space-y-6">
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                  <CardDescription>
                    Upload images to showcase your gig
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-2">
                            {field.value &&
                              field.value.map((image, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  className="aspect-square min-w-full h-full p-0 overflow-hidden relative"
                                >
                                  <Image
                                    src={image.url}
                                    alt="Gig Image"
                                    width={100}
                                    height={100}
                                    className="object-cover w-full h-full"
                                  />

                                  <Button
                                    variant={
                                      image.isPrimary ? "default" : "secondary"
                                    }
                                    size="icon"
                                    className={cn(
                                      "absolute top-2 right-12 size-8"
                                    )}
                                    onClick={() => {
                                      field.onChange(
                                        field.value.map((i) =>
                                          i === image
                                            ? { ...i, isPrimary: true }
                                            : { ...i, isPrimary: false }
                                        )
                                      );
                                    }}
                                  >
                                    <Award className={cn("min-w-6 min-h-6")} />
                                  </Button>

                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 p-1 bg-destructive size-8"
                                    onClick={() =>
                                      field.onChange(
                                        field.value.filter((i) => i !== image)
                                      )
                                    }
                                  >
                                    <X className="min-w-6 min-h-6" />
                                  </Button>
                                </Button>
                              ))}
                            <Button
                              variant="outline"
                              className="aspect-square min-w-full h-full"
                              onClick={() => {
                                const newImage = prompt("Enter image URL");
                                if (newImage) {
                                  field.onChange([
                                    ...field.value,
                                    {
                                      url: newImage,
                                      alt: "Gig Image",
                                      sortOrder: field.value.length + 1,
                                      isPrimary: false,
                                    },
                                  ]);
                                }
                              }}
                            >
                              <Plus
                                size={24}
                                className="text-muted-foreground"
                              />
                              <p className="text-xs text-muted-foreground">
                                Add Image
                              </p>
                            </Button>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormMessage />
                </CardContent>
              </TabsContent>

              <TabsContent value="packages" className="space-y-6">
                <CardHeader>
                  <CardTitle>Packages</CardTitle>
                  <CardDescription>
                    Create packages to offer different levels of service
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <FormField
                    control={form.control}
                    name="packages"
                    render={({ field }) => (
                      <div className="space-y-2">
                        {field.value &&
                          field.value.map((_, pIndex) => (
                            <Card key={pIndex}>
                              <CardHeader className="flex items-center justify-between">
                                <CardTitle>Package {pIndex + 1}</CardTitle>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => {
                                    field.onChange(
                                      field.value.filter(
                                        (_, index) => index !== pIndex
                                      )
                                    );
                                  }}
                                >
                                  <X size={16} />
                                </Button>
                              </CardHeader>

                              <CardContent className="space-y-4">
                                <FormField
                                  control={form.control}
                                  name={`packages.${pIndex}.title`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center gap-2">
                                        <Sparkles size={12} />
                                        Title
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Package Title"
                                          {...field}
                                        />
                                      </FormControl>
                                      <FormDescription>
                                        Set a title for this package
                                      </FormDescription>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`packages.${pIndex}.price`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center gap-2">
                                        <Sparkles size={12} />
                                        Price
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          placeholder="0.00"
                                          {...field}
                                          onChange={(e) =>
                                            field.onChange(
                                              parseFloat(e.target.value)
                                            )
                                          }
                                        />
                                      </FormControl>
                                      <FormDescription>
                                        Set a price for this package
                                      </FormDescription>
                                    </FormItem>
                                  )}
                                />

                                <div className="flex gap-2">
                                  <FormField
                                    control={form.control}
                                    name={`packages.${pIndex}.deliveryTime`}
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormLabel className="flex items-center gap-2">
                                          <Clock size={12} />
                                          Delivery (days)
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            placeholder="1"
                                            {...field}
                                            onChange={(e) =>
                                              field.onChange(
                                                parseFloat(e.target.value)
                                              )
                                            }
                                          />
                                        </FormControl>
                                        <FormDescription>
                                          Set the delivery time for this package
                                        </FormDescription>
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control}
                                    name={`packages.${pIndex}.revisions`}
                                    render={({ field }) => (
                                      <FormItem className="flex-1">
                                        <FormLabel className="flex items-center gap-2">
                                          <RefreshCw size={12} />
                                          Revisions
                                        </FormLabel>
                                        <FormControl>
                                          <Input
                                            type="number"
                                            placeholder="2"
                                            {...field}
                                            onChange={(e) =>
                                              field.onChange(
                                                parseFloat(e.target.value)
                                              )
                                            }
                                          />
                                        </FormControl>
                                        <FormDescription>
                                          Set the number of revisions for this
                                          package
                                        </FormDescription>
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <FormField
                                  control={form.control}
                                  name={`packages.${pIndex}.description`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center gap-2">
                                        <Sparkles size={12} />
                                        Description
                                      </FormLabel>
                                      <FormControl>
                                        <Textarea
                                          rows={3}
                                          placeholder="Describe what's included..."
                                          {...field}
                                          className="resize-none h-[100px]"
                                        />
                                      </FormControl>
                                      <FormDescription>
                                        Describe what this package includes
                                      </FormDescription>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`packages.${pIndex}.features`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="flex items-center gap-2">
                                        <Sparkles size={12} />
                                        Features
                                      </FormLabel>
                                      <FormControl>
                                        <div className="space-y-2">
                                          {field.value &&
                                            field.value.map(
                                              (feature, fIndex) => (
                                                <div
                                                  className="flex items-center gap-2"
                                                  key={feature.title}
                                                >
                                                  <FormField
                                                    control={form.control}
                                                    name={`packages.${pIndex}.features.${fIndex}.included`}
                                                    render={({ field }) => (
                                                      <FormItem>
                                                        <FormControl>
                                                          <Checkbox
                                                            className="size-6"
                                                            checked={
                                                              field.value
                                                            }
                                                            onCheckedChange={
                                                              field.onChange
                                                            }
                                                          />
                                                        </FormControl>
                                                      </FormItem>
                                                    )}
                                                  />
                                                  <FormField
                                                    key={fIndex}
                                                    control={form.control}
                                                    name={`packages.${pIndex}.features.${fIndex}.title`}
                                                    render={({ field }) => (
                                                      <FormItem>
                                                        <FormControl>
                                                          <Input
                                                            placeholder="Feature Title"
                                                            {...field}
                                                            onChange={(e) => {
                                                              for (
                                                                let i = 0;
                                                                i <
                                                                form.getValues(
                                                                  "packages"
                                                                ).length;
                                                                i++
                                                              ) {
                                                                form.setValue(
                                                                  `packages.${i}.features.${fIndex}.title`,
                                                                  e.target.value
                                                                );
                                                              }
                                                            }}
                                                          />
                                                        </FormControl>
                                                      </FormItem>
                                                    )}
                                                  />
                                                </div>
                                              )
                                            )}

                                          <Button
                                            className="w-full"
                                            size="sm"
                                            onClick={() => {
                                              for (
                                                let i = 0;
                                                i <
                                                form.getValues("packages")
                                                  .length;
                                                i++
                                              ) {
                                                form.setValue(
                                                  `packages.${i}.features`,
                                                  [
                                                    ...field.value,
                                                    {
                                                      title: "",
                                                      included: true,
                                                    },
                                                  ]
                                                );
                                              }
                                            }}
                                          >
                                            <Plus size={14} />
                                            Add Feature
                                          </Button>
                                        </div>
                                      </FormControl>
                                      <FormDescription>
                                        List the features included in this
                                        package
                                      </FormDescription>
                                    </FormItem>
                                  )}
                                />
                              </CardContent>
                            </Card>
                          ))}

                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            field.onChange([
                              ...field.value,
                              {
                                title: "",
                                description: "",
                                price: 0,
                                deliveryTime: 1,
                                revisions: 1,
                                features: [{ title: "", description: "" }],
                              },
                            ]);
                          }}
                        >
                          <Plus size={14} />
                          Add Package
                        </Button>
                      </div>
                    )}
                  />
                </CardContent>
              </TabsContent>

              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    "Create Gig"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </Tabs>
    </main>
  );
};

export default GigEditForm;
