import { redirect } from "next/navigation";

import PageTemplate from "@/components/templates/page-template";
import SettingsForm from "@/components/settings/settings-form";
import { getSettings } from "@/lib/actions/settings";
import { auth } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect(`/sign-in?callback-url=${encodeURIComponent(`/settings`)}`);
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
