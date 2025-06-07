"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronRight, LogOut, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

import { navItems, legalNavItems } from "./nav-items";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    email: string;
    isVerified: boolean;
    _count: {
      notifications: number;
    };
  } | null;
}

export default function MobileSidebar({
  isOpen,
  onClose,
  user,
}: MobileSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] p-0">
        <SheetHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <span className="text-2xl">🐸</span>
              <span className="font-bold text-xl">BlueFrog</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-4">
            {/* User Profile Section */}
            {user?.isVerified ? (
              <div className="mb-6">
                <Link
                  href={`/profile/${user.username}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.avatar || undefined}
                      alt={user.username}
                    />
                    <AvatarFallback>
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                {/* Quick Actions */}
                <div className="mt-3 space-y-2">
                  <Link href="/dashboard/gigs/create" onClick={onClose}>
                    <Button className="w-full gap-2" size="sm">
                      <Plus className="h-4 w-4" />
                      Create Gig
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mb-6 space-y-2">
                <Link href="/sign-in" onClick={onClose}>
                  <Button className="w-full" variant="default">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={onClose}>
                  <Button className="w-full" variant="outline">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            <Separator className="mb-4" />

            {/* Navigation Items */}
            <nav className="space-y-1">
              <Accordion type="single" collapsible className="w-full">
                {navItems
                  .filter((item) => item.showInMobile)
                  .filter((item) => !item.requiresAuth || user?.isVerified)
                  .map((item) => {
                    if (item.children && item.children.length > 0) {
                      return (
                        <AccordionItem
                          key={item.href}
                          value={item.href}
                          className="border-none"
                        >
                          <AccordionTrigger
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:no-underline",
                              isActive(item.href)
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-accent"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="h-4 w-4" />
                              {item.label}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pl-10 pr-3 pb-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={onClose}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                                  isActive(child.href)
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                )}
                              >
                                <child.icon className="h-4 w-4" />
                                {child.label}
                              </Link>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    }

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          isActive(item.href)
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-accent"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </div>
                        {item.href === "/notifications" &&
                          user?._count.notifications > 0 && (
                            <Badge
                              variant="destructive"
                              className="h-5 px-1 text-xs"
                            >
                              {user._count.notifications}
                            </Badge>
                          )}
                      </Link>
                    );
                  })}
              </Accordion>
            </nav>

            <Separator className="my-4" />

            {/* Legal Links */}
            <div className="space-y-1">
              <p className="px-3 text-xs font-medium text-muted-foreground mb-2">
                Legal
              </p>
              {legalNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Sign Out */}
            {user?.isVerified && (
              <>
                <Separator className="my-4" />
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    // Handle sign out
                    onClose();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            )}

            {/* Footer */}
            <div className="mt-8 px-3 text-xs text-muted-foreground">
              <p>© 2024 BlueFrog</p>
              <p className="mt-1">Solana Freelance Marketplace</p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
