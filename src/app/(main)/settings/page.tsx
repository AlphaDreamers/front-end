import { redirect } from "next/navigation";

import { me } from "@/lib/actions/auth";
import PageTemplate from "@/components/templates/page-template";
import SettingsForm from "@/components/settings/settings-form";
import { getSettings } from "@/lib/actions/settings";

export default async function SettingsPage() {
  const { user, error } = await me();

  if (!user?.isVerified) {
    redirect(
      `/sign-in?callback-url=${encodeURIComponent(`/settings`)}&error=${encodeURIComponent(
        error === "INVALID_TOKEN"
          ? "Invalid token. Please log in again"
          : error === "TOKEN_EXPIRED"
            ? "Your session has expired. Please log in again"
            : "You must be logged in to access this page"
      )}`
    );
  }

  const settings = await getSettings();

  return (
    <PageTemplate
      title="Settings"
      description="Manage your account settings and preferences"
    >
      <SettingsForm settings={settings} />
    </PageTemplate>
  );
}
