"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

import { getMobileNavItems, legalNavItems, NavItem } from "./nav-config";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const session = useSession();

  const pathname = usePathname();

  const isAuthenticated = session.status === "authenticated";

  // Get navigation items based on auth status
  const navItems = getMobileNavItems(isAuthenticated);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const renderNavItem = (item: NavItem, isChild = false) => {
    const itemClasses = cn(
      "flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm transition-colors",
      isChild ? "ml-6" : "",
      isActive(item.href)
        ? "bg-primary/10 text-primary font-medium"
        : "hover:bg-accent"
    );

    if (item.children && item.children.length > 0 && !isChild) {
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
          <AccordionContent className="pb-1">
            <div className="space-y-1">
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ml-6",
                    isActive(child.href)
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <child.icon className="h-4 w-4" />
                  {child.label}
                </Link>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClose}
        className={itemClasses}
      >
        <div className="flex items-center gap-3">
          <item.icon className="h-4 w-4" />
          {item.label}
        </div>
      </Link>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>
            <SheetClose asChild>
              <Link href="/" onClick={onClose} className="font-bold text-3xl">
                <span className="text-primary">Blue</span>
                <span>Frog</span>
              </Link>
            </SheetClose>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)] mt-6">
          <div className="space-y-6 pb-6">
            {/* Main Navigation */}
            <nav className="space-y-1 px-3">
              <Accordion type="single" collapsible className="w-full">
                {navItems.map((item) => renderNavItem(item))}
              </Accordion>
            </nav>

            <Separator />

            {/* Legal Links */}
            <div className="space-y-1 px-3">
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
          </div>
        </ScrollArea>

        <SheetFooter className="text-xs text-muted-foreground">
          <p>© 2025 BlueFrog</p>
          <p>Solana Freelance Marketplace</p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
