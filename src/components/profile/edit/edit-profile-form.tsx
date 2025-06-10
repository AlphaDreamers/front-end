"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import StepIndicator from "@/components/forms/step-indicator";
import EditProfileBasicInfo from "./edit-profile-basic-info";
import EditProfileSkills from "./edit-profile-skills";
import EditProfilePortfolio from "./edit-profile-portfolio";
import EditProfileSocialLinks from "./edit-profile-social-links";

import { UpdateProfileFormSchema } from "@/lib/schemas";
import { updateProfile } from "@/lib/actions/profile";
import { ProfileForEdit, AvailableSkill, KeyValuePair } from "@/lib/types";

interface EditProfileFormProps {
  profile: ProfileForEdit;
  availableSkills: KeyValuePair[];
}

const FORM_STEPS = 4;

export default function EditProfileForm({
  profile,
  availableSkills,
}: EditProfileFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Transform the profile data to match our form schema
  const defaultValues: z.infer<typeof UpdateProfileFormSchema> = {
    // Basic info
    username: profile.username,
    firstName: profile.firstName,
    lastName: profile.lastName,
    headline: profile.headline || "",
    bio: profile.bio || "",
    avatar: profile.avatar ? { type: "existing", url: profile.avatar } : null,
    banner: profile.banner ? { type: "existing", url: profile.banner } : null,

    // Skills
    skills: profile.skills.map((skill) => ({
      id: skill.id,
      skillId: skill.skill.id,
      label: skill.skill.title,
      level: skill.level,
    })),

    // Social links
    socialLinks: profile.socialLinks.map((link) => ({
      id: link.id,
      type: link.type,
      url: link.url,
    })),

    // Portfolio items - transform to match our schema
    portfolioItems: profile.portfolioItems.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description || "",
      url: item.url || "",
      images: item.images.map((img) => ({
        type: "existing" as const,
        id: img.id,
        url: img.file.url,
        isPrimary: img.isPrimary,
      })),
    })),

    // Featured badge
    featuredBadgeId:
      profile.badgeProgress.find((b) => b.isFeatured)?.id || null,
  };

  const form = useForm<z.infer<typeof UpdateProfileFormSchema>>({
    resolver: zodResolver(UpdateProfileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof UpdateProfileFormSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await updateProfile(values);

      if (result.success) {
        toast.success("Your profile picture has been updated");
        router.push(`/profile/${profile.username}`);
      } else {
        throw new Error(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    // Validate current step fields before proceeding
    let fieldsToValidate: (keyof z.infer<typeof UpdateProfileFormSchema>)[] =
      [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = [
          "username",
          "firstName",
          "lastName",
          "headline",
          "bio",
          "avatar",
          "banner",
        ];
        break;
      case 2:
        fieldsToValidate = ["skills"];
        break;
      case 3:
        fieldsToValidate = ["portfolioItems"];
        break;
      case 4:
        fieldsToValidate = ["socialLinks"];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      if (currentStep < FORM_STEPS) {
        setCurrentStep(currentStep + 1);
      } else {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <EditProfileBasicInfo form={form} />;
      case 2:
        return (
          <EditProfileSkills form={form} availableSkills={availableSkills} />
        );
      case 3:
        return <EditProfilePortfolio form={form} />;
      case 4:
        return <EditProfileSocialLinks form={form} />;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Basic Information";
      case 2:
        return "Skills & Expertise";
      case 3:
        return "Portfolio";
      case 4:
        return "Social Links & Badges";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-8">
      <StepIndicator steps={FORM_STEPS} currentStep={currentStep} />

      <Card>
        <CardHeader>
          <CardTitle>{getStepTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStepContent()}

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1 || isSubmitting}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {currentStep < FORM_STEPS ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating Profile...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
