import { redirect } from "next/navigation";
import Link from "next/link";
import { Settings2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import SearchBar from "@/components/search-bar";
import Pagination from "@/components/pagination";
import { cn } from "@/lib/utils";
import {
  getNotificationCnt,
  getNotifications,
} from "@/lib/actions/notifications";

import { NotificationList } from "@/components/notificatons/notification-list";
import Filters from "@/components/filter-card";
import { auth } from "@/lib/auth";
import Async from "@/components/async";

const NOTIFICATIONS_PER_PAGE = 10;

// Server component for fetching notifications
export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) {
  const session = await auth();

  if (!session) {
    redirect(`/sign-in?callback-url=${encodeURIComponent(`/notifications`)}`);
  }

  const page = parseInt((await searchParams).page || "1", 10);

  return (
    <main className="h-full flex flex-col">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your BlueFrog marketplace activity. Manage your
            notifications and keep track of important updates.
          </p>
        </div>
        <Link
          href="/settings/notifications"
          className={cn(buttonVariants({}), "md:w-auto w-full")}
        >
          <Settings2 className="size-4 mr-2" />
          Notification Settings
        </Link>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 space-y-4">
        {/* Search bar */}
        <SearchBar
          placeholder="Search your notifications..."
          className="w-full"
        />

        {/* Mobile filters - shown as a sheet on small screens */}
        <div className="lg:hidden">
          <Filters filters={[]} />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Desktop filters sidebar */}
        <div className="hidden lg:block">
          <Filters filters={[]} />
        </div>

        {/* Notifications list */}
        <div className="col-span-1 lg:col-span-3">
          <Async
            fetch={async () => {
              return await Promise.all([
                getNotifications({
                  take: NOTIFICATIONS_PER_PAGE,
                  skip: (page - 1) * NOTIFICATIONS_PER_PAGE,
                }),
                getNotificationCnt(),
              ]);
            }}
          >
            {([notifications, cnt]) => (
              <>
                <NotificationList notifications={notifications} />
                <Pagination
                  totalPages={Math.ceil(cnt / NOTIFICATIONS_PER_PAGE)}
                />
              </>
            )}
          </Async>
        </div>
      </div>
    </main>
  );
}
