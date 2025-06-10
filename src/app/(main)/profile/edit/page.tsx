import { redirect, notFound } from "next/navigation";
import { me } from "@/lib/actions/auth";
import EditProfileForm from "@/components/profile/edit/edit-profile-form";
import { getProfileForEdit } from "@/lib/actions/profile";
import { getKeyValueSkills } from "@/lib/actions/profile";
import PageTemplate from "@/components/templates/page-template";

export default async function EditProfilePage() {
  const { user, error } = await me();

  if (!user?.isVerified) {
    redirect(
      `/sign-in?callback-url=${encodeURIComponent(`/notifications`)}&error=${encodeURIComponent(
        error === "INVALID_TOKEN"
          ? "Invalid token. Please log in again"
          : error === "TOKEN_EXPIRED"
            ? "Your session has expired. Please log in again"
            : "You must be logged in to access this page"
      )}`
    );
  }

  const [defaultProfileData, availableSkills] = await Promise.all([
    getProfileForEdit(user.id),
    getKeyValueSkills(),
  ]);

  if (!defaultProfileData) {
    notFound();
  }

  return (
    <PageTemplate
      title="Edit Profile"
      description="Update your profile information and showcase your skills"
    >
      <EditProfileForm
        defaultValues={defaultProfileData}
        profile={defaultProfileData}
        availableSkills={availableSkills}
      />
    </PageTemplate>
  );
}
