import { redirect } from "next/navigation";
import { me } from "@/lib/actions/auth";
import { prisma } from "@/lib/prisma";
import CreateGigForm from "@/components/create-gig-form";

export default async function GigCreatePage() {
  const user = await me();

  if (!user?.isVerified) {
    redirect("/sign-in?callback-url=/dashboard/gigs/create");
  }

  // Fetch all needed data in parallel for better performance
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      select: {
        id: true,
        title: true,
        icon: true,
        color: true,
      },
      orderBy: {
        title: "asc",
      },
    }),
    prisma.tag.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: "asc",
      },
    }),
  ]);

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <CreateGigForm categories={categories} tags={tags} />
    </div>
  );
}
