// src/components/navigation/search-command.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  User, 
  Briefcase,
  Loader2,
  ArrowRight,
  Clock,
  TrendingUp,
  Hash
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock search results - in a real app, these would come from an API
const mockSearchResults = {
  gigs: [
    {
      id: "1",
      title: "Professional Logo Design",
      seller: "@designpro",
      price: "0.5 SOL",
      rating: 4.8,
      category: "Design",
    },
    {
      id: "2",
      title: "Smart Contract Development",
      seller: "@solandev",
      price: "2 SOL",
      rating: 5.0,
      category: "Development",
    },
  ],
  users: [
    {
      id: "1",
      username: "designpro",
      name: "Design Pro",
      isVerified: true,
      badge: "Top Seller",
    },
    {
      id: "2",
      username: "solandev",
      name: "Solana Developer",
      isVerified: true,
      badge: null,
    },
  ],
  categories: [
    { id: "1", name: "Web Development", count: 156 },
    { id: "2", name: "Graphic Design", count: 243 },
    { id: "3", name: "Smart Contracts", count: 89 },
  ],
  recent: [
    "logo design",
    "solana development",
    "NFT marketplace",
  ],
  popular: [
    "website development",
    "smart contract audit",
    "UI/UX design",
  ],
};

export default function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Simulate search delay
  useEffect(() => {
    if (search.length > 2) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setShowResults(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowResults(false);
    }
  }, [search]);

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const handleSelect = (type: string, id: string) => {
    onOpenChange(false);
    setSearch("");
    
    switch (type) {
      case "gig":
        router.push(`/gigs/${id}`);
        break;
      case "user":
        router.push(`/profile/${id}`);
        break;
      case "category":
        router.push(`/gigs?category=${id}`);
        break;
      case "search":
        router.push(`/gigs?q=${encodeURIComponent(id)}`);
        break;
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search gigs, users, or categories..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        {/* Loading State */}
        {isLoading && (
          <CommandEmpty>
            <div className="flex flex-col items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Searching...</p>
            </div>
          </CommandEmpty>
        )}

        {/* No Results */}
        {!isLoading && showResults && search.length > 2 && (
          <>
            <CommandEmpty>
              <div className="flex flex-col items-center justify-center py-6">
                <Search className="h-6 w-6 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No results found for "{search}"
                </p>
              </div>
            </CommandEmpty>

            {/* Search Results */}
            <CommandGroup heading="Gigs">
              {mockSearchResults.gigs.map((gig) => (
                <CommandItem
                  key={gig.id}
                  value={gig.title}
                  onSelect={() => handleSelect("gig", gig.id)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{gig.title}</p>
                      <p className="text-xs text-muted-foreground">
                        by {gig.seller} • {gig.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {gig.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      ⭐ {gig.rating}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Sellers">
              {mockSearchResults.users.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.username}
                  onSelect={() => handleSelect("user", user.username)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                  {user.badge && (
                    <Badge variant="default" className="text-xs">
                      {user.badge}
                    </Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Categories">
              {mockSearchResults.categories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.name}
                  onSelect={() => handleSelect("category", category.id)}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {category.count} gigs
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Default State - Recent & Popular Searches */}
        {!isLoading && !showResults && (
          <>
            <CommandGroup heading="Recent Searches">
              {mockSearchResults.recent.map((query) => (
                <CommandItem
                  key={query}
                  value={query}
                  onSelect={() => handleSelect("search", query)}
                  className="flex items-center gap-3"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{query}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Popular Searches">
              {mockSearchResults.popular.map((query) => (
                <CommandItem
                  key={query}
                  value={query}
                  onSelect={() => handleSelect("search", query)}
                  className="flex items-center gap-3"
                >
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{query}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {/* Search All Results */}
        {showResults && search.length > 2 && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => handleSelect("search", search)}
                className="flex items-center justify-between"
              >
                <span className="text-sm">Search all results for "{search}"</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>

      {/* Footer with keyboard shortcut hint */}
      <div className="border-t px-3 py-2">
        <p className="text-xs text-muted-foreground">
          Press{" "}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>{" "}
          to open search anytime
        </p>
      </div>
    </CommandDialog>
  );
}