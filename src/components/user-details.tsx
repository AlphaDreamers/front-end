import { User } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

interface UserDetailsProps {
  user: User;
  className?: string;
}

const UserDetails = ({ user, className }: UserDetailsProps) => {
  const Icon = user.badge
    ? ((LucideIcons[user.badge.icon] ||
        LucideIcons.Award) as LucideIcons.LucideIcon)
    : null;
  return (
    <div className={cn("flex items-center gap-3 w-fit", className)}>
      <div className="flex items-center gap-2">
        <Link href={`/profile/${user.username}`}>
          <Image
            src={user.avatar || "/avatar-fallback.png"}
            alt={user.username}
            width={32}
            height={32}
            className="min-w-10 min-h-10 rounded-full border-1 border-primary"
          />
        </Link>
        <Link href={`/profile/${user.username}`}>
          <p className="text-foreground text-sm font-medium">{user.username}</p>
          <p className="text-muted-foreground text-xs">@{user.username}</p>
        </Link>
      </div>
      {user.badge && (
        <Badge className="ml-auto">
          {Icon && <Icon />}
          {user.badge.title}
        </Badge>
      )}
    </div>
  );
};

export default UserDetails;
