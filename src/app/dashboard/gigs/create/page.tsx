import CreateGigForm from "@/components/create-gig-form";
import { getCategories, me, getTags } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const getCategories = async () => {
  return await prisma.category.findMany({
    select: {
      id: true,
      label: true,
    },
  });
};

const getTags = async () => {
  return await prisma.tag.findMany({
    select: {
      id: true,
      label: true,
    },
  });
};

export default async function GigCreatePage() {
  const user = await me();

  if (!user?.isVerified) {
    redirect("/sign-in?callback-url=/dashboard/gigs/create");
  }

  const [categories, tags] = await Promise.all([getCategories(), getTags()]);

  return <CreateGigForm categories={categories} tags={tags} />;
}
