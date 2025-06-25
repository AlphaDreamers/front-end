// src/app/profile/[username]/edit/page.tsx
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import EditProfileForm from "@/components/profile/edit-profile-form";
import { MediaType } from "@prisma/client";

export default async function EditProfilePage() {
  const session = await auth();

  if (!session) {
    redirect(
      `/sign-in?callback-url=${encodeURIComponent(`/dashboard/profile/edit`)}`
    );
  }

  // Fetch all needed data in parallel for better performance
  const [user, availableSkills] = await Promise.all([
    // Get comprehensive user data with the new media structure
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        skills: {
          include: {
            skill: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: {
            skill: {
              title: "asc",
            },
          },
        },
        socialLinks: {
          orderBy: {
            type: "asc",
          },
        },
        portfolioItems: {
          include: {
            // Using the many-to-many relationship with MediaFile
            files: {
              orderBy: {
                order: "asc", // Preserve the order of media files
              },
            },
          },
          orderBy: {
            order: "asc", // Order portfolio items by their order field
          },
        },
        badgeProgress: {
          where: {
            // Only include badges that user has earned (has some progress)
            currentProgress: {
              gt: 0,
            },
          },
          include: {
            badge: {
              select: {
                id: true,
                title: true,
                icon: true,
                color: true,
              },
            },
          },
          orderBy: [{ isFeatured: "desc" }, { highestTier: "desc" }],
        },
      },
    }),

    // Get all available skills for the dropdown
    prisma.skill.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: "asc",
      },
    }),
  ]);

  if (!user) {
    redirect("/sign-in");
  }

  // Transform user data for the form component
  // This transformation handles the new media structure
  const transformedUser = {
    ...user,
    portfolioItems: user.portfolioItems.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      url: item.url,
      isFeatured: item.isFeatured,
      order: item.order,
      // Transform media files to the format expected by the form
      media: item.files.map((file) => ({
        type: "existing" as const,
        id: file.id,
        url: file.url,
        mediaType: file.type as MediaType,
      })),
    })),
  };
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <EditProfileForm
        user={transformedUser}
        availableSkills={availableSkills}
      />
    </div>
  );
}
