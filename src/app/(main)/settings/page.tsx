import { redirect } from "next/navigation";

import { me } from "@/lib/actions/auth";
import PageTemplate from "@/components/templates/page-template";
import SettingsForm from "@/components/settings/settings-form";
import { getSettings } from "@/lib/actions/settings";

export default async function SettingsPage() {
  const user = await me();

  // Middlewere should handle this, this is a safety check
  if (!user?.isVerified) {
    redirect("/sign-in?callback-url=/settings");
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
