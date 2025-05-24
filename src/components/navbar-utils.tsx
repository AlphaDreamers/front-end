"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Prisma } from "@prisma/client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import Link from "next/link";
import { Computer, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// Type definitions
interface SearchDialogContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SearchDialogContextProviderProps {
  children: React.ReactNode;
  gigs: Prisma.GigGetPayload<{
    select: {
      id: true;
      title: true;
    };
  }>[];
  param?: string;
}

interface SearchToggleProps {
  className?: string;
}

// Create context for search dialog state
const SearchDialogContext = createContext<SearchDialogContextType | null>(null);

/**
 * Provider component for search dialog context
 * Manages search state and URL parameters
 */
export const SearchDialogContextProvider = ({
  children,
  gigs,
  param = "search",
}: SearchDialogContextProviderProps) => {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const path = usePathname();
  const { replace } = useRouter();

  // Debounced search handler to update URL parameters
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set(param, term);
    } else {
      params.delete(param);
    }

    replace(`${path}?${params.toString()}`);
  }, 300);

  return (
    <SearchDialogContext.Provider value={{ open, setOpen }}>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search..."
          defaultValue={searchParams.get(param) || ""}
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {gigs.map((gig) => (
              <CommandItem key={gig.id} asChild>
                <Link href={`/gigs/${gig.id}`}>{gig.title}</Link>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {children}
    </SearchDialogContext.Provider>
  );
};

// Custom hook for accessing search dialog context
const useSearchDialog = () => {
  const context = useContext(SearchDialogContext);

  if (!context) {
    throw new Error(
      "useSearchDialog must be used within a SearchDialogProvider"
    );
  }

  return context;
};

/**
 * Search toggle button component
 * Shows different variants for mobile and desktop
 */
export const MobileSearchToggle = ({ className }: SearchToggleProps) => {
  const { setOpen } = useSearchDialog();

  const toggleSearch = () => setOpen((prev) => !prev);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSearch}
      className={cn(className)}
    >
      <Search />
    </Button>
  );
};

export const DesktopSearchToggle = ({ className }: SearchToggleProps) => {
  const { setOpen } = useSearchDialog();

  const toggleSearch = () => setOpen((prev) => !prev);

  return (
    <Button
      variant="secondary"
      size="sm"
      className={cn("relative rounded-xl text-muted-foreground", className)}
      onClick={toggleSearch}
    >
      <Search className="size-4 opacity-50" />
      <div>Search...</div>
      <div className="w-24" />
    </Button>
  );
};

/**
 * Sidebar close button component
 * Used for closing mobile sidebar
 */
export const SidebarClose = () => {
  const { toggleSidebar, setOpen } = useSidebar();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile, setOpen]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="md:hidden"
    >
      <X />
    </Button>
  );
};

/**
 * Sidebar toggle button component
 * Used for opening mobile sidebar
 */
export const SidebarToggle = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      className="md:hidden"
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
    >
      <Menu />
    </Button>
  );
};

/**
 * Theme toggle component
 * Cycles between light, dark, and system themes
 */
export const ThemeToggle = () => {
  const { setTheme, theme, systemTheme } = useTheme();

  const handleThemeChange = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme(systemTheme === "dark" ? "light" : "dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleThemeChange}
      className="hidden md:flex"
    >
      {theme === "light" ? <Sun /> : theme === "dark" ? <Moon /> : <Computer />}
    </Button>
  );
};
