import { redirect } from "next/navigation";
import Link from "next/link";
import { Bell, Settings2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import SearchBar from "@/components/search-bar";
import Pagination from "@/components/pagination";
import { cn } from "@/lib/utils";
import {
  getNotificationCnt,
  getNotifications,
} from "@/lib/actions/notifications";

import { NotificationList } from "@/components/notificatons/notification-list";
import Filters, { FilterCardSkeleton } from "@/components/filters";
import { auth } from "@/lib/auth";
import Async from "@/components/async";
import PageTemplate from "@/components/templates/page-template";
import { Card } from "@/components/ui/card";

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
    <PageTemplate
      title="Notifications"
      description="Manage your notifications and stay updated with your BlueFrog marketplace activity."
      actionComponent={
        <Link href="/settings" className={cn(buttonVariants({}))}>
          <Settings2 />
          Notification Settings
        </Link>
      }
    >
      <div className="space-y-2 lg:space-y-8">
        <SearchBar containerClassName="mx-auto max-w-3xl" />

        <div className="flex flex-col lg:flex-row gap-8">
          <Async fetch={async () => {}} fallback={<FilterCardSkeleton />}>
            {() => <Filters filters={[]} className="lg:w-72 h-fit" />}
          </Async>

          <div className="flex-1">
            <Async
              fetch={async () => {
                return await Promise.all([
                  getNotifications({
                    where: {
                      recipientId: session.user.id,
                    },
                    take: NOTIFICATIONS_PER_PAGE,
                    skip: (page - 1) * NOTIFICATIONS_PER_PAGE,
                    orderBy: {
                      createdAt: "desc",
                    },
                  }),
                  getNotificationCnt({
                    where: {
                      recipientId: session.user.id,
                    },
                  }),
                ]);
              }}
            >
              {([notifications, cnt]) => (
                <>
                  {notifications.length > 0 ? (
                    <>
                      <NotificationList notifications={notifications} />

                      <Pagination
                        totalPages={Math.ceil(cnt / NOTIFICATIONS_PER_PAGE)}
                      />
                    </>
                  ) : (
                    <Card>
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Bell className="h-12 w-12 mb-4 text-muted-foreground" />
                        <p className="text-lg font-medium">
                          No notifications found
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          You&apos;re all caught up! Check back later for new
                          updates.
                        </p>
                      </div>
                    </Card>
                  )}
                </>
              )}
            </Async>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}
