import { User } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Star } from "lucide-react";

interface UserDetailsProps {
  user: User;
}

const UserDetails = ({ user }: UserDetailsProps) => {
  return (
    <div className="flex items-center gap-3 w-fit">
      <div className="flex items-center gap-2">
        <Link href={`/profile/${user.username}`}>
          <Image
            src={user.avatar || "/avatar-fallback.png"}
            alt={user.username}
            width={32}
            height={32}
            className="min-w-8 min-h-8 rounded-full border-1 border-primary"
          />
        </Link>
        <Link href={`/profile/${user.username}`}>
          <p className="text-foreground text-sm font-medium">{user.username}</p>
          <p className="text-muted-foreground text-xs">{user.username}</p>
        </Link>
      </div>
      {user.badge && (
        <Badge className="ml-auto">
          <Star />
          {user.badge.title}
        </Badge>
      )}
    </div>
  );
};

export default UserDetails;
