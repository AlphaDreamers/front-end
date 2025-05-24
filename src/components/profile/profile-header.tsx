import Image from "next/image";
import { Check, Edit, Shield } from "lucide-react";
import Link from "next/link";
import { Prisma } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

import ContactSellerFormDialog from "./contact-seller-form-dialog";

interface ProfileHeaderProps {
  user: Prisma.UserGetPayload<{
    select: {
      id: true;
      username: true;
      firstName: true;
      lastName: true;
      avatar: true;
      banner: true;
      isKycVerified: true;
      headline: true;
      bio: true;
      badgeProgress: {
        select: {
          isFeatured: true;
          highestTier: true;
          badge: {
            select: {
              title: true;
            };
          };
        };
      };
    };
  }>;
  isMe: boolean;
  isAuth: boolean;
}

export function ProfileHeader({ user, isMe }: ProfileHeaderProps) {
  const featuredBadge = user.badgeProgress.find((badge) => badge.isFeatured);

  return (
    <div className="overflow-hidden rounded-t-xl">
      {/* Banner Image */}
      <Image
        src={user.banner || "/banner-fallback.jpg"}
        alt="Profile Banner"
        width={1200}
        height={400}
        className="h-48 w-full object-cover border-b"
      />

      <div className="-mt-16 px-6 pb-6">
        <div className="flex flex-col items-start sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <Image
              src={user.avatar || "/avatar-fallback.png"}
              alt="Profile Picture"
              width={128}
              height={128}
              className="size-32 rounded-full border-4 border-accent bg-accent/50 object-cover"
            />

            <div className="mb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                {user.isKycVerified && (
                  <Badge>
                    <Check /> Verified
                  </Badge>
                )}
              </div>
              <div className="text-muted-foreground">@{user.username}</div>
              {featuredBadge && (
                <div className="mt-1 flex items-center">
                  <Badge variant="outline">
                    <Shield /> {featuredBadge?.highestTier}{" "}
                    {featuredBadge?.badge.title}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2 sm:mt-0">
            {isMe ? (
              <Link href="/profile/edit" className={buttonVariants({})}>
                <Edit /> Edit Profile
              </Link>
            ) : (
              <ContactSellerFormDialog user={user} />
            )}
          </div>
        </div>

        {user.headline && (
          <div className="mt-6">
            <h2 className="text-xl font-medium text-muted-foreground">
              {user.headline}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
