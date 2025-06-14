"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, Menu, Search, LogOut, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

import MobileSidebar from "./mobile-sidebar";
import NotificationDropdown from "./notification-dropdown";
import { getMainNavItems, userMenuItems } from "./nav-config";

export default function NavBar() {
  const session = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isAuthenticated = session.status === "authenticated";
  const user = session.data?.user;

  // Get navigation items based on auth status
  const navItems = getMainNavItems(isAuthenticated);

  // Handle scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-200",
          scrolled
            ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            : "bg-background"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left Section: Logo and Main Nav */}
            <div className="flex items-center gap-8">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Logo */}

              <Link href="/" className="font-bold text-3xl">
                <span className="text-primary">Blue</span>
                <span>Frog</span>
              </Link>

              {/* Desktop Navigation */}
              <NavigationMenu className="hidden lg:flex">
                <NavigationMenuList>
                  {navItems.map((item) => {
                    if (item.children && item.children.length > 0) {
                      return (
                        <NavigationMenuItem key={item.href}>
                          <NavigationMenuTrigger
                            className={cn(
                              isActive(item.href) && "text-primary"
                            )}
                          >
                            <Link href={item.href}>{item.label}</Link>
                          </NavigationMenuTrigger>

                          <NavigationMenuContent>
                            <ul className="grid w-[300px] gap-1 p-1 md:w-[400px] md:grid-cols-2">
                              {item.children.map((child) => (
                                <NavigationMenuLink
                                  asChild
                                  key={child.href}
                                  className="h-14"
                                >
                                  <Link
                                    href={child.href}
                                    className={cn(
                                      "flex flex-col items-center gap-2 p-2 text-sm font-medium transition-colors",
                                      isActive(child.href) && "bg-accent"
                                    )}
                                  >
                                    <child.icon className="h-4 w-4" />
                                    <div className="text-sm font-medium leading-none">
                                      {child.label}
                                    </div>
                                  </Link>
                                </NavigationMenuLink>
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      );
                    }

                    return (
                      <NavigationMenuItem key={item.href}>
                        <NavigationMenuLink
                          asChild
                          className={cn(isActive(item.href) && "text-primary")}
                        >
                          <Link href={item.href}>{item.label}</Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Right Section: Search, Actions, User Menu */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>

              {isAuthenticated && user ? (
                <>
                  {/* Notifications */}
                  <NotificationDropdown
                    unreadCount={user.unreadNotifications || 0}
                  />

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-9 w-9 rounded-full"
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar} alt={user.username} />
                          <AvatarFallback>
                            {user.firstName?.[0]}
                            {user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            @{user.username}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {/* User Menu Items */}
                      <DropdownMenuGroup>
                        {userMenuItems.map((item) => (
                          <DropdownMenuItem key={item.href} asChild>
                            <Link
                              href={
                                item.href === "/profile"
                                  ? `/profile/${user.username}`
                                  : item.href
                              }
                            >
                              <item.icon />
                              {item.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator />

                      {/* Sign Out */}
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => signOut()}
                      >
                        <LogOut />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className={cn(
                      buttonVariants({
                        variant: "ghost",
                        size: "sm",
                      })
                    )}
                  >
                    <LogIn />
                    <span>Sign In</span>
                  </Link>

                  <Link
                    href="/sign-up"
                    className={cn(
                      buttonVariants({
                        size: "sm",
                      })
                    )}
                  >
                    <Plus />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
