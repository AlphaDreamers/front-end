"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  User,
  Image as ImageIcon,
  Briefcase,
  Award,
  Link,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Check,
  Plus,
  X,
} from "lucide-react";

import { updateProfile } from "@/lib/actions/profile";
import { UpdateProfileFormSchema, UpdateProfileFormData } from "@/lib/schemas";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import unified form components
import FormInput from "@/components/forms/form-input";
import FormTextarea from "@/components/forms/form-textarea";
import UnifiedImageUpload from "@/components/forms/image-upload";
import FormSocialLinks from "@/components/forms/form-social-links";
import UnifiedPortfolioItems from "@/components/forms/portfolio-items";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import Rating from "../rating";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface UnifiedEditProfileFormProps {
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    headline?: string | null;
    bio?: string | null;
    avatar?: string | null;
    banner?: string | null;
    skills: Array<{
      id: string;
      skillId: string;
      level: number;
      skill: { id: string; title: string };
    }>;
    socialLinks: Array<{
      id: string;
      type: string;
      url: string;
    }>;
    portfolioItems: Array<{
      id: string;
      title: string;
      description?: string | null;
      url?: string | null;
      isFeatured: boolean;
      order: number;
      media: Array<{
        type: "existing";
        id: string;
        url: string;
        mediaType: string;
      }>;
    }>;
    badgeProgress: Array<{
      id: string;
      isFeatured: boolean;
      badge: { id: string; title: string; icon: string; color: string };
    }>;
  };
  availableSkills: Array<{ id: string; title: string }>;
}

export default function UnifiedEditProfileForm({
  user,
  availableSkills,
}: UnifiedEditProfileFormProps) {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert user data to form format
  const formattedUser: UpdateProfileFormData = {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    headline: user.headline || "",
    bio: user.bio || "",
    avatar: user.avatar ? { type: "existing", url: user.avatar } : null,
    banner: user.banner ? { type: "existing", url: user.banner } : null,
    skills: user.skills.map((skill) => ({
      id: skill.id,
      skillId: skill.skillId,
      label: skill.skill.title,
      level: skill.level,
    })),
    socialLinks: user.socialLinks.map((link) => ({
      id: link.id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: link.type as any, // Will be validated by schema
      url: link.url,
    })),
    portfolioItems: user.portfolioItems
      .sort((a, b) => a.order - b.order)
      .map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description || "",
        url: item.url || "",
        isFeatured: item.isFeatured,
        media: item.media,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      })) as any,
  };

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(UpdateProfileFormSchema),
    defaultValues: formattedUser,
  });

  // Calculate form completion percentage
  const calculateProgress = () => {
    const values = form.getValues();
    let completed = 0;
    const total = 6;

    if (values.username && values.firstName && values.lastName) completed++;
    if (values.headline || values.bio) completed++;
    if (values.avatar || values.banner) completed++;
    if (values.skills.length > 0) completed++;
    if (values.socialLinks.length > 0) completed++;
    if (values.portfolioItems.length > 0) completed++;

    return (completed / total) * 100;
  };

  const progress = calculateProgress();

  const onSubmit = async (values: UpdateProfileFormData) => {
    setIsSubmitting(true);

    try {
      const result = await updateProfile(values);

      if (result.success) {
        // Update the session with new user data
        await updateSession({
          username: values.username,
          name: `${values.firstName} ${values.lastName}`,
          image:
            values.avatar?.type === "existing" ? values.avatar.url : undefined,
        });

        toast.success("Profile updated successfully!", {
          description: "Your changes have been saved",
        });

        router.push(`/profile/${values.username}`);
        router.refresh();
      } else {
        throw new Error(result.error || "Failed to update profile");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";

      toast.error("Failed to update profile", {
        description: message,
      });

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
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <p className="text-muted-foreground mt-2">
              Update your profile information and showcase your work
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
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Your basic profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <FormInput
                control={form.control}
                name="username"
                icon={User}
                label="Username"
                placeholder="johndoe"
                description="Your unique username"
                required
              />

              <FormInput
                control={form.control}
                name="firstName"
                icon={User}
                label="First Name"
                placeholder="John"
                required
              />

              <FormInput
                control={form.control}
                name="lastName"
                icon={User}
                label="Last Name"
                placeholder="Doe"
                required
              />
            </div>

            <FormInput
              control={form.control}
              name="headline"
              icon={Briefcase}
              label="Professional Headline"
              placeholder="Full-Stack Developer | React & Node.js Expert"
              description="A brief description of what you do"
            />

            <FormTextarea
              control={form.control}
              name="bio"
              label="Bio"
              icon={Award}
              placeholder="Tell us about yourself, your experience, and what makes you unique..."
              description="Share your story and expertise"
            />
          </CardContent>
        </Card>

        {/* Section 2: Profile Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Profile Images
            </CardTitle>
            <CardDescription>
              Upload your avatar and banner images
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <UnifiedImageUpload
                control={form.control}
                name="avatar"
                label="Avatar"
                description="Square image recommended (max 5MB)"
                aspectRatio="aspect-square"
                maxSizeMB={5}
              />

              <UnifiedImageUpload
                control={form.control}
                name="banner"
                label="Banner"
                description="Wide image recommended (max 10MB)"
                aspectRatio="aspect-[3/1]"
                maxSizeMB={10}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Skills */}
        <Card>
          <CardContent>
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Skills & Expertise
                  </FormLabel>
                  <FormDescription>
                    Add skills and rate your proficiency level
                  </FormDescription>
                  <FormControl>
                    <div className="grid gap-2">
                      {field.value?.length > 0 ? (
                        field.value.map((skill, index) => (
                          <div
                            key={`${skill.id} + ${index}`}
                            className="flex items-center gap-2"
                          >
                            <div
                              className={cn(
                                buttonVariants({ variant: "outline" }),
                                "flex-1 flex justify-between items-center"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                  {skill.label}
                                </span>
                                -
                                <span className="text-sm text-muted-foreground">
                                  {skill.level === 1 && "Beginner"}
                                  {skill.level === 2 && "Basic"}
                                  {skill.level === 3 && "Intermediate"}
                                  {skill.level === 4 && "Advanced"}
                                  {skill.level === 5 && "Expert"}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  Proficiency Level:
                                </span>
                                <Rating
                                  rating={skill.level}
                                  onClick={(level) => {
                                    const skills = form.getValues("skills");
                                    const newSkills = [...skills];
                                    newSkills[index] = {
                                      ...newSkills[index],
                                      level,
                                    };
                                    form.setValue("skills", newSkills);
                                  }}
                                />
                                <span className="text-xs text-muted-foreground">
                                  ({skill.level}/5)
                                </span>
                              </div>
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    const updatedSkills = field.value?.filter(
                                      (s) => s.skillId !== skill.skillId
                                    );
                                    field.onChange(updatedSkills);
                                  }}
                                >
                                  <X />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <span>Remove skill</span>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Start adding skills to showcase your expertise
                        </span>
                      )}

                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button role="combobox" className={cn("w-full")}>
                              <Plus />
                            </Button>
                          </FormControl>
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
                                {availableSkills.map((skill) => (
                                  <CommandItem
                                    value={skill.id}
                                    key={skill.id}
                                    onSelect={() => {
                                      const skillId = skill.id;
                                      const skillTitle = skill.title;
                                      const skills = field.value || [];
                                      if (
                                        skills.some(
                                          (s) => s.skillId === skillId
                                        )
                                      ) {
                                        return;
                                      }

                                      const newSkill = {
                                        tempId: generateTempId(),
                                        skillId,
                                        label: skillTitle,
                                        level: 3, // Default to intermediate
                                      };

                                      form.setValue("skills", [
                                        ...skills,
                                        newSkill,
                                      ]);
                                    }}
                                  >
                                    {skill.title}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        field.value?.some(
                                          (s) => s.skillId === skill.id
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Section 4: Social Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Social Links
            </CardTitle>
            <CardDescription>
              Connect your social media and professional profiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormSocialLinks
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              form={form as any}
            />
          </CardContent>
        </Card>

        {/* Section 5: Portfolio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Portfolio
            </CardTitle>
            <CardDescription>
              Showcase your best work and projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UnifiedPortfolioItems form={form} />
          </CardContent>
        </Card>

        {/* Submit Section */}
        <div className="flex items-center justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/profile")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <div className="flex items-center gap-4">
            {progress >= 50 && (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Looking good!
              </span>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[150px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

const generateTempId = () => `temp_${Date.now()}_${Math.random()}`;
