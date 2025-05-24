import CreateGigForm from "@/components/forms/create-gig-form";
import { getCategories, getCurrentUser, getTags } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function GigCreatePage() {
  const user = await getCurrentUser();

  if (!user?.isVerified) {
    redirect("/sign-in?callback-url=/dashboard/gigs/create");
  }

  const [categories, tags] = await Promise.all([getCategories(), getTags()]);

  return <CreateGigForm categories={categories} tags={tags} />;
}
