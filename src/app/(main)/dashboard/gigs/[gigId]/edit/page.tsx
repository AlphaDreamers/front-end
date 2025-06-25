import { redirect, notFound } from "next/navigation";
import GigEditForm from "@/components/gig/edit-gig-form";
import { getGigForEdit } from "@/lib/actions/gigs";
import { getKeyValueCategories } from "@/lib/actions/category";
import { getKeyValueTags } from "@/lib/actions/tags";
import { auth } from "@/lib/auth";

interface EditGigPageProps {
  params: Promise<{ gigId: string }>;
}

export default async function EditGigPage({ params }: EditGigPageProps) {
  const { gigId } = await params;
  const session = await auth();

  if (!session) {
    redirect(`/sign-in?callbackUrl=/dashboard/gigs/${gigId}/edit`);
  }

  const gig = await getGigForEdit(gigId);

  if (gig.success === false) {
    throw new Error(gig.error || "Failed to fetch gig for editing");
  }

  if (!gig) {
    notFound();
  }

  const [categories, allTags] = await Promise.all([
    getKeyValueCategories(),
    getKeyValueTags(),
  ]);

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <GigEditForm gig={gig.data} categories={categories} tags={allTags} />
    </div>
  );
}
