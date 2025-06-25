"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, Menu, Search, LogOut, Users, LucideIcon } from "lucide-react";
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
import { SearchToggle } from "./search-provider";
import ThemeToggle from "./theme-toggle";
import { Color } from "@/lib/types";

export default function NavBar() {
  const session = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
            <div className="flex items-center gap-2 lg:gap-4">
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
                          <NavigationMenuTrigger>
                            <span
                              className={cn(
                                "inline-flex items-center gap-2",
                                isActive(item.href) && "text-primary"
                              )}
                            >
                              {item.label}
                            </span>
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                              {item.children.map((child) => (
                                <ListItem
                                  key={child.href}
                                  title={child.label}
                                  href={child.href}
                                  icon={child.icon}
                                  color={child.color}
                                >
                                  {child.description}
                                </ListItem>
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      );
                    }

                    return (
                      <NavigationMenuItem key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                              isActive(item.href) && "text-primary"
                            )}
                          >
                            {item.label}
                          </Link>
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
              <SearchToggle>
                <Button variant="ghost" size="icon" aria-label="Search">
                  <Search />
                </Button>
              </SearchToggle>

              {isAuthenticated && user ? (
                <>
                  {/* Notifications */}
                  <NotificationDropdown />

                  <ThemeToggle />

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
                                  ? `/profile/${encodeURI(user.username)}`
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
                    <span className="hidden md:inline">Sign In</span>
                  </Link>

                  <Link
                    href="/sign-up"
                    className={cn(
                      buttonVariants({
                        variant: "default",
                        size: "sm",
                        className: "hidden sm:inline-flex",
                      })
                    )}
                  >
                    <Users />
                    <span className="hidden md:inline">Create Account</span>
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

function ListItem({
  title,
  children,
  icon: Icon,
  href,
  color,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  icon: LucideIcon;
  color?: Color;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href} className="flex flex-row gap-3 items-start">
          <Icon
            className={cn("min-h-8 min-w-8 p-1.5 rounded-lg aspect-square", {
              "bg-purple-100 text-purple-700": color === "purple",
              "bg-green-100 text-green-700": color === "green",
              "bg-yellow-100 text-yellow-700": color === "yellow",
              "bg-gray-100 text-gray-700": color === "gray",
              "bg-blue-100 text-blue-700": color === "blue",
            })}
          />

          <div>
            <div className="text-sm leading-none font-medium">{title}</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
              {children}
            </p>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
