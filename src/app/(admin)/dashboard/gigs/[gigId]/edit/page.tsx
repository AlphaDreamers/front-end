import GigEditForm from "@/components/GigEditForm";
import { getCategories, getGigById, getGigTags, me } from "@/lib/actions";
import { notFound, redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ gigId: string }>;
}) {
  const user = await me();

  const { gigId } = await params;

  if (!user?.verified) {
    redirect(`/sign-in?callback-url=/dashboard/gigs/${gigId}/edit`);
  }

  const gig = await getGigById(gigId);

  if (!gig) {
    return notFound();
  }

  const tags = await getGigTags();
  const categories = await getCategories();

  return <GigEditForm gig={gig} tags={tags} categories={categories} />;
}
