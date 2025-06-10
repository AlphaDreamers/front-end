import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Shield, Star, Award } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { DetailedUser } from "@/lib/types";

interface ProfileHeaderProps {
  user: DetailedUser;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="relative">
      <div className="h-48 md:h-64 relative rounded-xl overflow-hidden">
        <Image
          src={user.banner || "/banner-fallback.jpg"}
          alt="Profile Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-20 px-6">
        {/* Avatar */}
        <div className="relative z-10">
          <Image
            src={user.avatar || "/avatar-fallback.png"}
            alt={user.firstName}
            width={160}
            height={160}
            className="size-28 md:size-32 rounded-full"
          />
        </div>

        {/* User Details */}
        <div className="relative z-99 flex-1 text-center md:text-left space-y-3">
          <div>
            <div className="flex items-center gap-3 justify-center md:justify-start text-nowrap">
              <h1 className="text-3xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              {user.isKycVerified && (
                <Badge className="bg-green-600/10 text-green-600 border-green-600/20">
                  <Shield className="size-3 mr-1" />
                  Verified
                </Badge>
              )}
              {user.badge && (
                <Badge
                  variant="secondary"
                  style={{
                    backgroundColor: `${user.badge.color}15`,
                    color: user.badge.color,
                    borderColor: user.badge.color,
                  }}
                >
                  {user.badge.tier}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">@{user.username}</p>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>

          {user.headline && (
            <p className="text-lg text-muted-foreground">{user.headline}</p>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            <span>
              Member since{" "}
              {formatDistanceToNow(user.joinedAt, { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className="flex gap-6 text-center">
          <div>
            <div className="flex items-center gap-1 text-xl font-bold">
              <Star className="size-5 text-amber-500 fill-amber-500" />
              {user.avgRating.toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground text-nowrap">
              {user.ratingCnt} reviews
            </p>
          </div>

          <div>
            <p className="text-xl font-bold">{user.ordersCnt}</p>
            <p className="text-sm text-muted-foreground">Orders</p>
          </div>
        </div>
      </div>
    </div>
  );
}
