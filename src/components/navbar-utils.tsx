"use client";

import {
  ComponentProps,
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import {
  AlertCircle,
  Computer,
  Loader2,
  Moon,
  Search,
  Sun,
  User,
  Grid,
  MessageSquare,
  LayoutDashboard,
  ShoppingBag,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import { Button } from "./ui/button";
import { useSidebar } from "./ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  getFilteredGigsList,
  getRecentSearches,
  saveRecentSearch,
} from "@/lib/actions";
import { Slot } from "@radix-ui/react-slot";
import { useDebounce } from "use-debounce";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

// Enhanced search result interface to support different types of content
interface SearchResult {
  id: string;
  title: string;
  type: "gig" | "user" | "category";
  description?: string;
  price?: number;
  rating?: number;
  avatar?: string;
  category?: string;
}

interface SearchDialogContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchDialogContext = createContext<SearchDialogContextType | null>(null);

export const SearchDialogContextProvider = ({
  children,
}: PropsWithChildren) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Enhanced debouncing with better performance characteristics
  const [debouncedQuery] = useDebounce(query, 300, {
    leading: false, // Changed to false to reduce unnecessary API calls
    trailing: true,
  });

  // Enhanced state management for different types of search results
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularCategories, setPopularCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load initial data when dialog opens
  useEffect(() => {
    const loadInitialData = async () => {
      if (open && !query) {
        try {
          // Load recent searches and popular categories when dialog opens
          const [recent, popular] = await Promise.all([
            getRecentSearches(),
            // You'll need to implement getPopularCategories
            Promise.resolve([
              "Web Development",
              "Graphic Design",
              "Digital Marketing",
              "Writing",
            ]),
          ]);
          setRecentSearches(recent);
          setPopularCategories(popular);
        } catch (err) {
          console.error("Failed to load initial search data:", err);
        }
      }
    };

    loadInitialData();
  }, [open, query]);

  // Enhanced search functionality with multiple result types
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedQuery.length < 2) {
        setSearchResults([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Enhanced search that could include gigs, users, and categories
        const results = await getFilteredGigsList({
          query: debouncedQuery,
          includeUsers: true, // You might want to add this parameter
          includeCategories: true,
        });

        // Transform results to include type information
        const enhancedResults: SearchResult[] = results.map((item) => ({
          ...item,
          type: item.type || "gig", // Assuming your API returns type information
        }));

        setSearchResults(enhancedResults);
      } catch (err) {
        setError(err as Error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery]);

  // Keyboard shortcut handling with enhanced functionality
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      // Escape to close search
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("");
      setSearchResults([]);
      setError(null);
    }
  }, [open]);

  // Enhanced link click handler with analytics
  const handleLinkClick = async (searchTerm?: string) => {
    if (searchTerm) {
      // Save search term for future reference
      try {
        await saveRecentSearch(searchTerm);
      } catch (err) {
        console.error("Failed to save recent search:", err);
      }
    }
    setOpen(false);
  };

  // Enhanced recent search click handler
  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
    // Don't close dialog, let user see results
  };

  // Quick action for "Search All" functionality
  const handleViewAllResults = () => {
    if (query.trim()) {
      router.push(`/gigs?search=${encodeURIComponent(query.trim())}`);
      handleLinkClick(query.trim());
    }
  };

  return (
    <SearchDialogContext.Provider value={{ open, setOpen }}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 max-h-[85vh] gap-0 max-w-2xl">
          {/* Enhanced search input with better visual design */}
          <div className="relative border-b bg-background">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground size-5" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services, sellers, or categories..."
              className="rounded-none border-0 h-14 pl-12 pr-4 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
            {/* Keyboard shortcut hint */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Badge variant="secondary" className="text-xs">
                ESC
              </Badge>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            {error ? (
              <div className="p-6">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Search Error</AlertTitle>
                  <AlertDescription>
                    {error.message || "Failed to search. Please try again."}
                  </AlertDescription>
                </Alert>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="animate-spin size-8 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Searching marketplace...
                </p>
              </div>
            ) : query.length < 2 ? (
              // Enhanced empty state with recent searches and suggestions
              <div className="p-6 space-y-6">
                <div className="text-center">
                  <Search className="h-12 w-12 text-muted-foreground/50 mb-4 mx-auto" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Search BlueFrog Marketplace
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Find services, sellers, and categories
                  </p>
                </div>

                {/* Recent searches section */}
                {recentSearches.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Recent Searches
                    </div>
                    <div className="space-y-1">
                      {recentSearches.slice(0, 5).map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleRecentSearchClick(search)}
                          className="flex items-center w-full px-3 py-2 text-left rounded-md hover:bg-accent transition-colors text-sm"
                        >
                          <Search className="h-4 w-4 text-muted-foreground mr-3" />
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular categories section */}
                {popularCategories.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      Popular Categories
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularCategories.map((category, index) => (
                        <button
                          key={index}
                          onClick={() => handleRecentSearchClick(category)}
                          className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="flex flex-col min-h-0">
                {/* Results header with count and "View All" option */}
                <div className="px-6 py-4 border-b bg-muted/30 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {searchResults.length} result
                    {searchResults.length === 1 ? "" : "s"} for
                    <span className="font-medium text-foreground ml-1">
                      "{query}"
                    </span>
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewAllResults}
                    className="text-xs"
                  >
                    View All Results
                  </Button>
                </div>

                {/* Enhanced results list with better categorization */}
                <ScrollArea className="flex-1">
                  <div className="p-2">
                    {searchResults.map((result) => (
                      <Link
                        key={`${result.type}-${result.id}`}
                        href={getResultHref(result)}
                        onClick={() => handleLinkClick(query)}
                        className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-accent transition-colors group"
                      >
                        {/* Result type icon */}
                        <div className="flex-shrink-0">
                          {getResultIcon(result.type)}
                        </div>

                        {/* Result content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium truncate group-hover:text-primary">
                              {result.title}
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              {result.type}
                            </Badge>
                          </div>

                          {result.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {result.description}
                            </p>
                          )}

                          {result.type === "gig" && result.price && (
                            <p className="text-xs font-medium text-green-600 mt-1">
                              Starting at ${result.price}
                            </p>
                          )}
                        </div>

                        {/* Additional metadata */}
                        {result.rating && (
                          <div className="flex-shrink-0 text-xs text-muted-foreground">
                            ⭐ {result.rating.toFixed(1)}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              // Enhanced no results state with suggestions
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Results Found</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                  No services found for "{query}". Try different keywords or
                  browse categories.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery("")}
                  >
                    Clear Search
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      router.push("/gigs");
                      setOpen(false);
                    }}
                  >
                    Browse All Services
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {children}
    </SearchDialogContext.Provider>
  );
};

// Helper function to get the appropriate href for different result types
const getResultHref = (result: SearchResult): string => {
  switch (result.type) {
    case "gig":
      return `/gigs/${result.id}`;
    case "user":
      return `/profile/${result.id}`;
    case "category":
      return `/gigs?category=${result.id}`;
    default:
      return `/gigs/${result.id}`;
  }
};

// Helper function to get the appropriate icon for different result types
const getResultIcon = (type: string) => {
  const iconClass = "h-5 w-5 text-muted-foreground";

  switch (type) {
    case "gig":
      return <ShoppingBag className={iconClass} />;
    case "user":
      return <User className={iconClass} />;
    case "category":
      return <Grid className={iconClass} />;
    default:
      return <Search className={iconClass} />;
  }
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

// Enhanced search toggle component with better accessibility
export const SearchToggle = ({ ...props }: ComponentProps<typeof Slot>) => {
  const { setOpen } = useSearchDialog();

  const toggleSearch = () => setOpen((prev) => !prev);

  return <Slot onClick={toggleSearch} {...props} />;
};

// Enhanced sidebar close with better mobile handling
export const SidebarClose = ({ ...props }: ComponentProps<typeof Slot>) => {
  const { toggleSidebar, setOpen } = useSidebar();
  const isMobile = useIsMobile();

  // Auto-close sidebar on mobile when screen size changes
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile, setOpen]);

  return <Slot onClick={toggleSidebar} {...props} />;
};

// Standard sidebar toggle functionality
export const SidebarToggle = ({ ...props }: ComponentProps<typeof Slot>) => {
  const { toggleSidebar } = useSidebar();

  return <Slot onClick={toggleSidebar} {...props} />;
};

// Enhanced theme toggle with better system theme handling
export const ThemeToggle = () => {
  const { setTheme, theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9">
        <div className="h-4 w-4" />
      </Button>
    );
  }

  const getThemeIcon = () => {
    if (theme === "light") return <Sun className="h-4 w-4" />;
    if (theme === "dark") return <Moon className="h-4 w-4" />;
    return <Computer className="h-4 w-4" />;
  };

  const getThemeLabel = () => {
    if (theme === "light") return "Switch to dark mode";
    if (theme === "dark") return "Switch to system theme";
    return "Switch to light mode";
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleThemeChange}
      className="w-9 h-9"
      title={getThemeLabel()}
      aria-label={getThemeLabel()}
    >
      {getThemeIcon()}
    </Button>
  );
};
