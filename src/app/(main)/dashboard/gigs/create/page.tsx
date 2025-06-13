import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import CreateGigForm from "@/components/create-gig-form";
import { auth } from "@/lib/auth";

export default async function GigCreatePage() {
  const session = await auth();

  if (!session) {
    redirect(
      `/sign-in?callback-url=${encodeURIComponent(`/dashboard/gigs/create`)}`
    );
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
