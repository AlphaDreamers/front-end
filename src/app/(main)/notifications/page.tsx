import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Settings2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import SearchBar from "@/components/search-bar";
import Pagination from "@/components/pagination";
import { cn } from "@/lib/utils";
import { me } from "@/lib/actions/auth";
import { getNotifications } from "@/lib/actions/notifications";

import { NotificationType } from "@prisma/client";
import {
  NotificationList,
  NotificationListSkeleton,
} from "@/components/notificatons/notification-list";
import Filters from "@/components/filter-card";

const NOTIFICATIONS_PER_PAGE = 10;

interface SearchParams {
  page?: string;
  search?: string;
  types?: string;
  status?: string;
  from?: string;
  to?: string;
}

// Parse search params into filters
function parseSearchParams(params: SearchParams): {
  filters: NotificationFiltersType;
  page: number;
} {
  const filters: NotificationFiltersType = {};

  // Parse notification types
  if (params.types) {
    const types = params.types.split(",") as NotificationType[];
    filters.type = types;
  }

  // Parse read status
  if (params.status) {
    if (params.status === "read") {
      filters.isRead = true;
    } else if (params.status === "unread") {
      filters.isRead = false;
    }
  }

  // Parse date range
  if (params.from || params.to) {
    filters.dateRange = {
      from: params.from ? new Date(params.from) : new Date(0),
      to: params.to ? new Date(params.to) : new Date(),
    };
  }

  // Parse search query
  if (params.search) {
    filters.search = params.search;
  }

  // Parse page number
  const page = params.page ? parseInt(params.page, 10) : 1;

  return { filters, page };
}

// Server component for fetching notifications
async function NotificationsContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { user, error } = await me();

  if (!user?.isVerified) {
    redirect(
      `/sign-in?callback-url=${encodeURIComponent(`/notifications`)}&error=${encodeURIComponent(
        error === "INVALID_TOKEN"
          ? "Invalid token. Please log in again"
          : error === "TOKEN_EXPIRED"
            ? "Your session has expired. Please log in again"
            : "You must be logged in to access this page"
      )}`
    );
  }

  const { filters, page } = parseSearchParams(searchParams);

  const { notifications, total } = await getNotifications(filters, {
    page,
    limit: NOTIFICATIONS_PER_PAGE,
    orderBy: "createdAt",
    orderDirection: "desc",
  });

  const totalPages = Math.ceil(total / NOTIFICATIONS_PER_PAGE);

  return (
    <>
      <NotificationList notifications={notifications} />
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </>
  );
}

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Check authentication
  const { user } = await me();
  if (!user?.isVerified) {
    redirect("/sign-in?callback-url=/notifications");
  }

  const params = await searchParams;

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
          <Suspense fallback={<NotificationListSkeleton />}>
            <NotificationsContent searchParams={params} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

// Loading state
export function NotificationsPageSkeleton() {
  return (
    <main className="h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your BlueFrog marketplace activity. Manage your
            notifications and keep track of important updates.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="hidden lg:block" />
        <div className="col-span-1 lg:col-span-3">
          <NotificationListSkeleton />
        </div>
      </div>
    </main>
  );
}
