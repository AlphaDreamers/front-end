import { redirect, notFound } from "next/navigation";
import { me } from "@/lib/actions/auth";
import EditGigForm from "@/components/gig/edit-gig-form";
import { getUpdateGigFormGig } from "@/lib/actions/gig";
import { getKeyValueCategories } from "@/lib/actions/category";
import { getKeyValueTags } from "@/lib/actions/tags";

interface EditGigPageProps {
  params: Promise<{ gigId: string }>;
}

export default async function EditGigPage({ params }: EditGigPageProps) {
  const user = await me();
  const { gigId } = await params;

  if (!user?.isVerified) {
    redirect(`/sign-in?callbackUrl=/dashboard/gigs/${gigId}/edit`);
  }

  const gig = await getUpdateGigFormGig(gigId);
  if (!gig) {
    notFound();
  }

  const [categories, allTags] = await Promise.all([
    getKeyValueCategories(),
    getKeyValueTags(),
  ]);

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold">Edit Gig</h1>
        <p className="text-muted-foreground">
          Update your service details and settings
        </p>
      </div>

      <EditGigForm gig={gig} categories={categories} tags={allTags} />
    </div>
  );
}
