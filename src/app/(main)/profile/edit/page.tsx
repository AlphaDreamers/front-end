import EditProfileForm from "@/components/profile/edit-profile-form";
import { me } from "@/lib/actions/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await me();

  if (!user?.isVerified) {
    redirect("/sign-in?callback-url=/profile/edit");
  }

  const userData = await prisma.user.findFirst({
    where: {
      id: user.id,
    },
    select: {
      username: true,
      avatar: true,
      banner: true,
      headline: true,
      bio: true,
      firstName: true,
      lastName: true,
      skills: {
        select: {
          id: true,
          level: true,
          skillId: true,
        },
      },
      socialLinks: {
        select: {
          id: true,
          url: true,
          type: true,
        },
      },
      portfolioItems: {
        select: {
          id: true,
          title: true,
          description: true,
          url: true,
          images: {
            select: {
              id: true,
              url: true,
              isPrimary: true,
            },
          },
        },
      },
      badgeProgress: {
        select: {
          id: true,
          isFeatured: true,
          highestTier: true,
          badge: {
            select: {
              title: true,
              description: true,
            },
          },
        },
      },
    },
  });

  const skills = await prisma.skill.findMany({
    select: {
      id: true,
      label: true,
    },
  });

  return (
    <EditProfileForm
      defaultValues={{
        ...userData,
        badgeProgress: await prisma.userBadgeProgress.findMany({
          select: {
            id: true,
            isFeatured: true,
            highestTier: true,
            badge: {
              select: {
                title: true,
                description: true,
              },
            },
          },
          take: 8,
        }),
      }}
      skills={skills}
    />
  );
}
