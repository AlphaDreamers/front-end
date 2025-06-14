"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
} from "lucide-react";

import { updateProfile } from "@/lib/actions/profile";
import { UpdateProfileFormSchema } from "@/lib/schemas";

import { Button } from "@/components/ui/button";
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

// Import form components
import FormInput from "@/components/forms/form-input";
import FormTextarea from "@/components/forms/form-textarea";
import FormImageUpload from "@/components/forms/form-image-upload";
import FormSkills from "@/components/forms/form-skills";
import FormSocialLinks from "@/components/forms/form-social-links";
import FormPortfolioItems from "@/components/forms/form-portfolio-items";
import FormFeaturedBadge from "@/components/forms/form-featured-badge";
import Image from "next/image";

interface EditProfileFormProps {
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    headline?: string;
    bio?: string;
    avatar?: string;
    banner?: string;
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
      description?: string;
      url?: string;
      images: Array<{
        id: string;
        url: string;
        isPrimary: boolean;
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

export default function EditProfileForm({
  user,
  availableSkills,
}: EditProfileFormProps) {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert user data to form format
  const formattedUser = {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    headline: user.headline || "",
    bio: user.bio || "",
    avatar: user.avatar
      ? { type: "existing" as const, url: user.avatar }
      : null,
    banner: user.banner
      ? { type: "existing" as const, url: user.banner }
      : null,
    skills: user.skills.map((skill) => ({
      id: skill.id,
      skillId: skill.skillId,
      label: skill.skill.title,
      level: skill.level,
    })),
    socialLinks: user.socialLinks.map((link) => ({
      id: link.id,
      type: link.type,
      url: link.url,
    })),
    portfolioItems: user.portfolioItems.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description || "",
      url: item.url || "",
      images: item.images.map((img) => ({
        type: "existing" as const,
        id: img.id,
        url: img.url,
        isPrimary: img.isPrimary,
      })),
    })),
    featuredBadgeId: user.badgeProgress.find((bp) => bp.isFeatured)?.id || null,
  };

  const form = useForm<z.infer<typeof UpdateProfileFormSchema>>({
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

  const onSubmit = async (values: z.infer<typeof UpdateProfileFormSchema>) => {
    setIsSubmitting(true);

    try {
      const result = await updateProfile(values);

      if (result.success) {
        // Update the session with new user data

        // Build a description listing only the fields that were updated
        const updatedFields: Array<React.ReactNode> = [];

        if (result.user.username !== user.username) {
          updatedFields.push(
            <li key="username">
              <strong>Username:</strong> {result.user.username}
            </li>
          );
        }
        if (result.user.headline !== user.headline) {
          updatedFields.push(
            <li key="headline">
              <strong>Headline:</strong> {result.user.headline}
            </li>
          );
        }
        if (result.user.firstName !== user.firstName) {
          updatedFields.push(
            <li key="firstName">
              <strong>First Name:</strong> {result.user.firstName}
            </li>
          );
        }
        if (result.user.lastName !== user.lastName) {
          updatedFields.push(
            <li key="lastName">
              <strong>Last Name:</strong> {result.user.lastName}
            </li>
          );
        }
        if (result.user.bio !== user.bio) {
          updatedFields.push(
            <li key="bio">
              <strong>Bio:</strong> {result.user.bio}
            </li>
          );
        }
        if (
          result.user.avatar !== user.avatar &&
          (values.avatar && "url" in values.avatar
            ? values.avatar.url
            : null) !== null
        ) {
          updatedFields.push(
            <li key="avatar">
              <strong>Avatar updated</strong>
            </li>
          );
        }
        if (
          result.user.banner !== user.banner &&
          (values.banner && "url" in values.banner
            ? values.banner.url
            : null) !== null
        ) {
          updatedFields.push(
            <li key="banner">
              <strong>Banner updated</strong>
            </li>
          );
        }

        const desc =
          updatedFields.length > 0 ? (
            <ul className="list-disc pl-4">{updatedFields}</ul>
          ) : (
            "Your changes have been saved"
          );

        await updateSession({
          user: {
            username: result.user.username,
            name: `${result.user.firstName} ${result.user.lastName}`,
            image: result.user.avatar,
          },
        });

        toast.success("Profile updated successfully!", {
          description: desc,
        });
        //
        //router.push("/dashboard/profile");
        //router.refresh();
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
            />{" "}
            <FormTextarea
              control={form.control}
              name="bio"
              label="Bio"
              placeholder="Tell us about yourself, your experience, and what makes you unique..."
              description="Share your story and expertise"
              rows={4}
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
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar</FormLabel>
                    <FormControl>
                      <FormImageUpload
                        control={form.control}
                        name="avatar"
                        label=""
                        description="Square image recommended (max 5MB)"
                        singleImage
                        className="aspect-square max-w-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="banner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner</FormLabel>
                    <FormControl>
                      <FormImageUpload
                        control={form.control}
                        name="banner"
                        label=""
                        singleImage
                        description="Wide image recommended (max 10MB)"
                        className="aspect-[3/1] max-w-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Skills & Expertise
            </CardTitle>
            <CardDescription>
              Showcase your skills and proficiency levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormSkills form={form} availableSkills={availableSkills} />
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
            <FormSocialLinks form={form} />
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
            <FormPortfolioItems form={form} />
          </CardContent>
        </Card>

        {/* Section 6: Featured Badge */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Featured Badge
            </CardTitle>
            <CardDescription>
              Choose a badge to highlight on your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormFeaturedBadge
              form={form}
              badges={user.badgeProgress.map((bp) => ({
                id: bp.id,
                title: bp.badge.title,
                icon: bp.badge.icon,
                color: bp.badge.color,
              }))}
            />
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
