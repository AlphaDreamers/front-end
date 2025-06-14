import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import EditProfileForm from "@/components/profile/edit/edit-profile-form";

export default async function EditProfilePage() {
  const session = await auth();

  if (!session) {
    redirect(
      `/sign-in?callback-url=${encodeURIComponent(`/dashboard/profile/edit`)}`
    );
  }

  // Fetch all needed data in parallel for better performance
  const [user, availableSkills] = await Promise.all([
    // Get comprehensive user data
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
            images: {
              include: {
                file: true,
              },
              orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
            },
          },
          orderBy: {
            createdAt: "desc",
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
  const transformedUser = {
    ...user,
    portfolioItems: user.portfolioItems.map((item) => ({
      ...item,
      images: item.images.map((img) => ({
        id: img.id,
        url: img.file.url,
        isPrimary: img.isPrimary,
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
