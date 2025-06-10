import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { me } from "@/lib/actions/auth";
import CreateGigForm from "@/components/create-gig-form";

export default async function GigCreatePage() {
  const { user, error } = await me();

  if (!user?.isVerified) {
    redirect(
      `/sign-in?callback-url=${encodeURIComponent(`/dashboard/gigs/create`)}&error=${encodeURIComponent(
        error === "INVALID_TOKEN"
          ? "Invalid token. Please log in again"
          : error === "TOKEN_EXPIRED"
            ? "Your session has expired. Please log in again"
            : "You must be logged in to access this page"
      )}`
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
