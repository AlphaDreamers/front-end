"use client";

import { Bell } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NotificationDropdown() {
  const session = useSession();

  if (session.status !== "authenticated") {
    return null;
  }
  const unreadCount = session.data.user.unreadNotifications;

  return (
    <Link
      href="/dashboard/notifications"
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "relative"
      )}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive/75 rounded-full">
          {unreadCount > 99 ? "99+" : unreadCount}
        </div>
      )}
    </Link>
  );
}
