"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Check, Plus, X, Award, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

import { UpdateProfileFormSchema } from "@/lib/schemas";
import { updateProfile } from "@/lib/actions";

import Rating from "../rating";

interface EditProfileFormProps {
  skills: Prisma.SkillGetPayload<{
    select: {
      id: true;
      label: true;
    };
  }>[];
  defaultValues: Prisma.UserGetPayload<{
    select: {
      username: true;
      avatar: true;
      banner: true;
      headline: true;
      bio: true;
      firstName: true;
      lastName: true;
      skills: {
        select: {
          id: true;
          level: true;
          skillId: true;
        };
      };
      socialLinks: {
        select: {
          id: true;
          url: true;
          type: true;
        };
      };
      portfolioItems: {
        select: {
          id: true;
          title: true;
          description: true;
          url: true;
          images: {
            select: {
              id: true;
              url: true;
              isPrimary: true;
            };
          };
        };
      };
      badgeProgress: {
        select: {
          id: true;
          isFeatured: true;
          highestTier: true;
          badge: {
            select: {
              title: true;
              description: true;
            };
          };
        };
      };
    };
  }>;
}

export default function EditProfileForm({
  defaultValues,
  skills,
}: EditProfileFormProps) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(UpdateProfileFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof UpdateProfileFormSchema>) =>
    toast.promise(async () => updateProfile(values), {
      loading: "Updating profile...",
      success: "Profile updated successfully!",
      error: "Failed to update profile. Please try again.",
    });

  const [open, setOpen] = useState(false);

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto flex flex-col gap-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <p className="text-muted-foreground">
              Update your profile information
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Update your personal information and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
                <div className="flex flex-col items-center gap-4">
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center">
                        <FormLabel>Avatar</FormLabel>
                        <FormControl>
                          <div className="flex flex-col items-center gap-2">
                            <Image
                              src={field.value || "/avatar-fallback.png"}
                              alt="Profile Avatar"
                              className="h-32 w-32 rounded-full object-cover border-2 border-primary"
                              width={128}
                              height={128}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                field.onChange(null);
                              }}
                            >
                              Change Avatar
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription className="text-center">
                          Upload a profile picture to represent you
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="banner"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center">
                        <FormLabel>Banner Image</FormLabel>
                        <FormControl>
                          <div className="flex flex-col items-center gap-2">
                            <Image
                              src={field.value || "/banner-fallback.jpg"}
                              alt="Profile Avatar"
                              className="h-32 w-32 object-cover rounded border-2 border-primary"
                              width={128}
                              height={128}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                field.onChange(null);
                              }}
                            >
                              Change Banner
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription className="text-center">
                          Upload a banner image to enhance your profile
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} />
                        </FormControl>
                        <FormDescription>
                          This will be your unique identifier on the platform
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your first name"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Your first name as it appears on your profile
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your last name"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Your last name as it appears on your profile
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="headline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Headline</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your professional headline"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A brief description of your professional focus
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about yourself"
                            rows={4}
                            className="resize-none h-28"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Describe your expertise and experience
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>
                Showcase your skills, certificates, and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        {field.value.map((skill, index) => (
                          <FormField
                            key={index}
                            control={form.control}
                            name={`skills.${index}.level`}
                            render={({ field: rating }) => (
                              <FormItem className="group">
                                <FormControl className="flex items-center justify-between border px-4 py-2 rounded">
                                  <div>
                                    <span className="text-sm font-medium">
                                      {skill.label}
                                    </span>

                                    <div className="flex items-center gap-2">
                                      <Rating
                                        rating={skill.level}
                                        onClick={(rating) => {
                                          const updatedSkills = [
                                            ...field.value,
                                          ];
                                          updatedSkills[index] = {
                                            ...updatedSkills[index],
                                            level: rating,
                                          };
                                          field.onChange(updatedSkills);
                                        }}
                                      />

                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => {
                                          const updatedSkills = [
                                            ...field.value,
                                          ];
                                          updatedSkills.splice(index, 1);
                                          field.onChange(updatedSkills);
                                        }}
                                      >
                                        <X />
                                      </Button>
                                    </div>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        ))}
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-full"
                            >
                              Add Skill
                              <Plus className="opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search skills..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>No skills found.</CommandEmpty>
                                <CommandGroup>
                                  {skills.map((skill) => (
                                    <CommandItem
                                      key={skill.id}
                                      value={skill.id}
                                      onSelect={() => {
                                        const newSkill = {
                                          ...skill,
                                          level: 1,
                                        };

                                        field.onChange(
                                          field.value
                                            ? [...field.value, newSkill]
                                            : [newSkill]
                                        );
                                        setOpen(false);
                                      }}
                                    >
                                      {skill.label}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          field.value?.some(
                                            (s) => s.id === skill.id
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
                    </FormControl>
                    <FormDescription>
                      Select your skills from the list
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>
                Showcase your skills, certificates, and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="featuredBadge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Badges</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        {defaultValues.badgeProgress.map((badge) => (
                          <FormItem key={badge.id} className="relative">
                            <RadioGroupItem
                              value={badge.id}
                              id={badge.id}
                              className="peer sr-only"
                            />
                            <FormLabel className="flex items-center gap-3 p-4 rounded-lg border-2 border-muted/30 bg-muted/10 cursor-pointer transition-all hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10">
                              <div
                                className={`h-12 w-12 rounded-full flex items-center justify-center border-2 bg-gradient-to-br shadow-lg`}
                              >
                                <Award />
                              </div>

                              <div className="flex-1">
                                <div className="font-medium">
                                  {badge.badge.title}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {badge.badge.description}
                                </div>
                                <div className="text-xs capitalize mt-1 inline-block px-2 py-0.5 rounded-full bg-muted/20">
                                  {badge.highestTier}
                                </div>
                              </div>
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Select badges to showcase your achievements
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={router.back}>
            <ArrowLeft />
            Back
          </Button>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
