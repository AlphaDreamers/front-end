import Link from "next/link";
import {
  Bell,
  Grid,
  MessageSquare,
  LayoutDashboard,
  User,
  Wallet,
  Settings,
  LogOut,
  LayoutDashboardIcon,
  Search,
  X,
  Menu,
  ListOrdered,
  Bookmark,
  ShoppingBag,
  Plus,
  Briefcase,
} from "lucide-react";
import Image from "next/image";
import { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Collapsible } from "./ui/collapsible";
import { Skeleton } from "./ui/skeleton";

import CategoryItem from "./category-item";
import {
  SearchDialogContextProvider,
  SidebarClose,
  SidebarToggle,
  ThemeToggle,
  SearchToggle,
} from "./navbar-utils";
import { getCategoryTree, signOut } from "@/lib/actions";
import { me } from "@/lib/actions/auth";
import Async from "./async";

const NAVBAR_HEIGHT = 58;

// Updated sidebar navigation with better organization
const SIDEBAR_NAV_ITEMS = [
  {
    href: "/dashboard",
    icon: <LayoutDashboard />,
    label: "Dashboard",
    authRequired: true,
  },
  { href: "/gigs", icon: <Grid />, label: "Browse Gigs", authRequired: false },
  {
    href: "/dashboard/gigs",
    icon: <ShoppingBag />,
    label: "My Services",
    authRequired: true,
  },
  {
    href: "/dashboard/orders",
    icon: <ListOrdered />,
    label: "Orders",
    authRequired: true,
  },
  {
    href: "/dashboard/chats",
    icon: <MessageSquare />,
    label: "Messages",
    authRequired: true,
  },
  {
    href: "/dashboard/wallet",
    icon: <Wallet />,
    label: "Wallet",
    authRequired: true,
  },
  {
    href: "/bookmarks",
    icon: <Bookmark />,
    label: "Bookmarks",
    authRequired: true,
  },
];

export default async function Navbar({ children }: PropsWithChildren) {
  const user = await me();
  const isAuth = user?.isVerified === true;
  const notificationCnt = user?._count.notifications || 0;

  return (
    <SearchDialogContextProvider>
      <nav
        className="fixed w-full top-0 z-50 bg-background border-b"
        style={{ height: `${NAVBAR_HEIGHT}px` }}
      >
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Left Section - Logo and Mobile Menu */}
          <div className="flex items-center gap-2">
            <SidebarToggle>
              <Button className="md:hidden" variant="ghost" size="icon">
                <Menu />
              </Button>
            </SidebarToggle>
            <Link href="/" className="text-2xl font-semibold">
              <span className="text-blue-500">Blue</span>
              <span>Frog</span>
            </Link>

            <SearchToggle>
              <Button
                variant="secondary"
                size="sm"
                className="relative rounded-xl text-muted-foreground hidden md:inline-flex"
              >
                <Search className="size-4 opacity-50" />
                <div>Search services...</div>
                <div className="w-24" />
              </Button>
            </SearchToggle>
          </div>

          {/* Center Section - Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Always visible - Browse marketplace */}
            <Link
              href="/gigs"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              <Grid />
              Browse Services
            </Link>

            {/* Authenticated user navigation */}
            {isAuth && (
              <>
                {/* Quick access to create new service */}
                <Link
                  href="/dashboard/gigs/create"
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  <Plus />
                  Create Service
                </Link>

                {/* Messages with notification indicator */}
                <Link
                  href="/dashboard/chats"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "relative"
                  )}
                >
                  <MessageSquare />
                  Messages
                  {notificationCnt > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-[18px] h-[18px] text-[0.75rem] bg-red-500 text-white rounded-full animate-pulse">
                      {notificationCnt}
                    </span>
                  )}
                </Link>

                {/* Dashboard access */}
                <Link
                  href="/dashboard"
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  <LayoutDashboard />
                  Dashboard
                </Link>
              </>
            )}

            {/* Unauthenticated user helpful links */}
            {!isAuth && (
              <Link
                href="/gigs"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <Briefcase />
                How it Works
              </Link>
            )}
          </div>

          {/* Right Section - User Profile or Auth Links */}
          <div className="flex items-center gap-2">
            <SearchToggle>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full"
              >
                <Search />
              </Button>
            </SearchToggle>
            <SearchToggle>
              <Button
                variant="secondary"
                size="icon"
                className="hidden md:inline-flex rounded-xl"
              >
                <Search className="size-4 opacity-50" />
              </Button>
            </SearchToggle>

            {isAuth ? (
              <AuthenticatedControls notificationCnt={notificationCnt} />
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/sign-in"
                  className={cn(buttonVariants({ variant: "ghost" }))}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className={cn(buttonVariants({ variant: "default" }))}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Sidebar */}
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between w-full px-2">
            <Link href="/" className="text-4xl font-semibold">
              <span className="text-blue-500">Blue</span>
              <span>Frog</span>
            </Link>
            <SidebarClose>
              <Button variant="ghost" size="icon" className="md:hidden">
                <X />
              </Button>
            </SidebarClose>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* Authentication status in mobile */}
          {!isAuth && (
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/sign-in">
                      <User />
                      Sign In
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/sign-up">
                      <Plus />
                      Get Started
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          )}

          {/* Main Navigation Items - filtered based on auth status */}
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {SIDEBAR_NAV_ITEMS.filter(
                (item) => !item.authRequired || isAuth
              ).map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      {item.icon}
                      {item.label}
                      {item.href === "/dashboard/chats" &&
                        notificationCnt > 0 && (
                          <span className="ml-auto text-xs bg-red-500 text-white rounded-full px-1.5 py-0.5">
                            {notificationCnt}
                          </span>
                        )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Quick action for authenticated users */}
              {isAuth && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/gigs/create">
                      <Plus />
                      Create New Service
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroup>

          {/* Categories section */}
          <SidebarGroup>
            <SidebarGroupLabel>Categories</SidebarGroupLabel>
            <SidebarMenu>
              <Async fallback={<CategoriesSkeletion />} fetch={getCategoryTree}>
                {(categories) =>
                  categories.map((item) => (
                    <Collapsible key={item.label} className="group/collapsible">
                      <CategoryItem item={item} />
                    </Collapsible>
                  ))
                }
              </Async>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarGroup>
            <SidebarMenu>
              {isAuth && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/settings">
                      <Settings />
                      Settings
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <ThemeToggle />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>

      {/* Spacer to prevent content from being hidden under the navbar */}
      <div style={{ height: `${NAVBAR_HEIGHT}px` }}></div>
      {children}
    </SearchDialogContextProvider>
  );
}

// Enhanced authenticated user controls with better wallet integration
const AuthenticatedControls = async ({
  notificationCnt,
}: {
  notificationCnt: number;
}) => {
  const user = await me();

  if (!user) {
    return null;
  }

  return (
    <>
      {/* Quick Wallet Access - Important for Solana platform */}
      <Link
        href="/dashboard/wallet"
        className={cn(
          buttonVariants({ size: "icon", variant: "ghost" }),
          "rounded-full relative"
        )}
      >
        <Wallet />
      </Link>

      {/* Notifications Bell */}
      <Link
        href="/notifications"
        className={cn(
          buttonVariants({ size: "icon", variant: "ghost" }),
          "rounded-full relative"
        )}
      >
        <Bell />
        {notificationCnt > 0 && (
          <span className="absolute -top-0.5 -right-0.5 text-xs bg-primary rounded-full text-primary-foreground aspect-square size-5 flex items-center justify-center">
            {notificationCnt}
          </span>
        )}
      </Link>

      {/* User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline" className="rounded-full">
            <Image
              src={user?.avatar || "/avatar-fallback.png"}
              alt="User Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel className="flex flex-col gap-1">
            <p className="text-sm font-medium">{user.username}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href={`/profile/${user.username}`}>
              <User />
              My Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <LayoutDashboardIcon />
              Dashboard
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/dashboard/gigs">
              <ShoppingBag />
              My Services
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/dashboard/orders">
              <ListOrdered />
              Orders
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/dashboard/wallet">
              <Wallet />
              Wallet & Payments
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <Settings />
              Settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive" onClick={signOut}>
            <LogOut />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

const CategoriesSkeletion = () => {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="ml-4 mr-4 h-6" />
      <div className="flex flex-col gap-2">
        <Skeleton className="mr-4 ml-8 h-6" />
        <div className="flex flex-col gap-2">
          <Skeleton className="mr-4 ml-12 h-6" />
          <Skeleton className="mr-4 ml-12 h-6" />
        </div>
        <Skeleton className="mr-4 ml-8 h-6" />
      </div>
      <Skeleton className="ml-4 mr-4 h-6" />
      <Skeleton className="ml-4 mr-4 h-6" />
      <div className="flex flex-col gap-2">
        <Skeleton className="mr-4 ml-8 h-6" />
        <Skeleton className="mr-4 ml-8 h-6" />
      </div>
    </div>
  );
};
