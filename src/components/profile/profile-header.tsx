// src/components/profile/profile-header.tsx
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Shield, Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfileUser } from "@/lib/types";

interface ProfileHeaderProps {
  user: ProfileUser;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 md:h-64">
        <Image
          src={user.banner || "/banner-fallback.jpg"}
          alt="Profile Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
      </div>

      <div className="relative px-6 pb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16">
          <Image
            src={user.avatar || "/avatar-fallback.png"}
            alt={user.firstName}
            width={128}
            height={128}
            className="size-32 rounded-full border-4 border-background"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              {user.featuredBadge && (
                <Badge variant="secondary">
                  {user.featuredBadge.tier} {user.featuredBadge.title}
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground">@{user.username}</p>

            {user.isKycVerified && (
              <Badge className="bg-green-600">
                <Shield className="size-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <Stat value={user.stats.totalGigs} label="Gigs" />
            <Stat
              value={user.stats.averageRating.toFixed(1)}
              label="Rating"
              icon={<Star className="size-4 text-yellow-500 fill-yellow-500" />}
            />
            <Stat value={user.stats.totalReviews} label="Reviews" />
            <Stat value={user.stats.completedOrders} label="Orders" />
          </div>
        </div>

        {user.headline && (
          <h2 className="text-xl font-medium mt-4">{user.headline}</h2>
        )}

        {user.bio && <p className="text-muted-foreground mt-2">{user.bio}</p>}

        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <Calendar className="size-4" />
          <span>
            Joined {formatDistanceToNow(user.joinedAt, { addSuffix: true })}
          </span>
        </div>
      </div>
    </Card>
  );
}

function Stat({
  value,
  label,
  icon,
}: {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-2xl font-bold flex items-center justify-center gap-1">
        {icon}
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
