
import { redirect } from "next/navigation";
import UnifiedCreateGigForm from "@/components/gig/create-gig-form";
import { auth } from "@/lib/auth";
import PageTemplate from "@/components/templates/page-template";
import { getKeyValueTags } from "@/lib/actions/tags";
import { getKeyValueCategories } from "@/lib/actions/category";

export default async function GigCreatePage() {
  const session = await auth();

  if (!session) {
    redirect(
      `/sign-in?callback-url=${encodeURIComponent(`/dashboard/gigs/create`)}`
    );
  }

  const [categories, tags] = await Promise.all([
    getKeyValueCategories(),
    getKeyValueTags(),
  ]);

  return (
    <PageTemplate
      title="Create New Gig"
      description="Fill in the details below to create your service offering"
    >
      <UnifiedCreateGigForm categories={categories} tags={tags} />
    </PageTemplate>
  );
}