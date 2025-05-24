import React, { Suspense } from "react";
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
} from "lucide-react";
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
import { getCurrentUser, signOut } from "@/lib/actions";
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
import CategoryItem from "./category-item";
import { prisma } from "@/lib/prisma";
import {
  SearchDialogContextProvider,
  MobileSearchToggle,
  DesktopSearchToggle,
  SidebarClose,
  SidebarToggle,
  ThemeToggle,
} from "./navbar-utils";
import Image from "next/image";

// Constants
const NAVBAR_HEIGHT = 58;

// Props interface
interface NavbarProps {
  search?: string;
}

export default async function Navbar({ search }: NavbarProps) {
  // Authentication state
  const user = await getCurrentUser();
  const isAuth = user?.isVerified === true;
  const notificationCnt = user?._count.notifications || 0;

  // Fetch gigs data for search
  const gigs = await prisma.gig.findMany({
    where: {
      title: {
        contains: search,
      },
    },
    select: {
      id: true,
      title: true,
    },
  });

  return (
    <SearchDialogContextProvider gigs={gigs}>
      {/* Main Navigation Bar */}
      <nav
        className="fixed w-full top-0 z-50 bg-background border-b"
        style={{ height: `${NAVBAR_HEIGHT}px` }}
      >
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Left Section - Logo and Mobile Menu */}
          <div className="flex items-center gap-2">
            <SidebarToggle />
            <Link href="/" className="text-xl font-semibold text-primary">
              FreelanceCrypto
            </Link>
            <DesktopSearchToggle className="hidden md:inline-flex" />
          </div>

          {/* Center Section - Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/gigs"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              <Grid />
              Browse Gigs
            </Link>

            {!isAuth && (
              <>
                <Link
                  href="/messages"
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  <MessageSquare />
                  Messages
                  {notificationCnt > 0 && (
                    <span className="absolute -top-2 -right-2 flex items-center justify-center w-[18px] h-[18px] text-[0.75rem] bg-[#F56565] text-white rounded-full animate-pulse">
                      {notificationCnt}
                    </span>
                  )}
                </Link>

                <Link
                  href=""
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  <LayoutDashboard />
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Right Section - User Profile or Auth Links */}
          <div className="flex items-center gap-2">
            <MobileSearchToggle className="md:hidden" />

            {isAuth ? (
              <AuthenticatedControls notificationCnt={notificationCnt} />
            ) : (
              <AuthLinks />
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Sidebar */}
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between w-full px-2">
            <Link href="/" className="text-2xl font-semibold">
              FreelanceCrypto
            </Link>
            <SidebarClose />
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* Main Navigation Items */}
          <SidebarGroup>
            <SidebarMenu>
              <NavigationItems />
            </SidebarMenu>
          </SidebarGroup>

          {/* Categories Section with Loading State */}
          <Suspense fallback={<div>Loading...</div>}>
            <CategoriesSection />
          </Suspense>
        </SidebarContent>

        <SidebarFooter>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/settings">
                    <Settings />
                    Settings
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
    </SearchDialogContextProvider>
  );
}

// Component for authenticated user controls
const AuthenticatedControls = async ({
  notificationCnt,
}: {
  notificationCnt: number;
}) => {
  const user = await getCurrentUser();

  return (
    <>
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
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/profile/wallet">
              <LayoutDashboardIcon />
              Dashboard
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/profile/wallet">
              <Wallet />
              Wallet
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings />
              Settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive" onClick={signOut}>
            <LogOut />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

// Component for authentication links
const AuthLinks = () => (
  <div className="flex items-center gap-2">
    <Link href="/sign-in" className={cn(buttonVariants({ variant: "ghost" }))}>
      Sign In
    </Link>
    <Link href="/sign-up" className={cn(buttonVariants({ variant: "ghost" }))}>
      Sign Up
    </Link>
  </div>
);

// Component for navigation items in sidebar
const NavigationItems = () => {
  const items = [
    { href: "/gigs", icon: <Grid />, label: "Browse Gigs" },
    { href: "/gigs", icon: <Grid />, label: "Orders" },
    { href: "/gigs", icon: <Grid />, label: "Messages" },
    { href: "/gigs", icon: <Grid />, label: "Bookmarks" },
    { href: "/gigs", icon: <Grid />, label: "Dashboard" },
  ];

  return (
    <>
      {items.map((item) => (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton asChild>
            <Link href={item.href}>
              {item.icon}
              {item.label}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
};

// Categories section component
const CategoriesSection = async () => {
  // Fetch nested categories from database
  const categories = await prisma.category.findMany({
    where: {
      parentId: null,
    },
    select: {
      id: true,
      label: true,
      children: {
        select: {
          id: true,
          label: true,
          children: {
            select: {
              id: true,
              label: true,
              children: {
                select: {
                  id: true,
                  label: true,
                  children: {
                    select: {
                      id: true,
                      label: true,
                      children: {
                        select: {
                          id: true,
                          label: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Categories</SidebarGroupLabel>
      <SidebarMenu>
        {categories.map((item) => (
          <Collapsible key={item.label} className="group/collapsible">
            <CategoryItem item={item} />
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
