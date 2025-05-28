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
} from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "./ui/button";
import { useSidebar } from "./ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

import { getFilteredGigsList } from "@/lib/actions";
import { Slot } from "@radix-ui/react-slot";
import { useDebounce } from "use-debounce";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

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

  const [debouncedQuery] = useDebounce(query, 300, {
    leading: true,
    trailing: true,
  });
  const [data, setData] = useState<
    {
      id: string;
      title: string;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (debouncedQuery.length < 2) {
        setData([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const gigs = await getFilteredGigsList({
          query: debouncedQuery,
        });
        setData(gigs);
      } catch (err) {
        setError(err as Error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [debouncedQuery]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("");
      setData([]);
      setError(null);
    }
  }, [open]);

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <SearchDialogContext.Provider value={{ open, setOpen }}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 max-h-[80vh] gap-0">
          <div className="relative border-b">
            <Search className="absolute left-0 translate-x-1/2 top-1/2 -translate-y-1/2 text-muted-foreground size-5" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search gigs..."
              className="rounded-b-none h-12 pl-10"
              autoFocus
            />
          </div>

          <div className="flex-1">
            {error ? (
              <div className="p-4">
                <Alert variant="destructive">
                  <AlertCircle />
                  <AlertTitle>Search Error</AlertTitle>
                  <AlertDescription>
                    {error.message ||
                      "Failed to search gigs. Please try again."}
                  </AlertDescription>
                </Alert>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="animate-spin size-8 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Searching...</p>
              </div>
            ) : query.length < 2 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Start Searching
                </h3>
                <p className="text-sm text-muted-foreground">
                  Type at least 2 characters to search for gigs
                </p>
              </div>
            ) : data.length > 0 ? (
              <div className="flex flex-col h-full">
                <div className="px-4 py-3 border-b bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    {data.length} result{data.length === 1 ? "" : "s"} for
                    &quot;
                    {query}&quot;
                  </p>
                </div>
                <ScrollArea className="max-h-[50vh]">
                  <div className="p-2">
                    {data.map((gig) => (
                      <Link
                        key={gig.id}
                        href={`/gigs/${gig.id}`}
                        onClick={handleLinkClick}
                        className="flex items-center px-3 py-3 rounded-md hover:bg-accent transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{gig.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Results Found</h3>
                <p className="text-sm text-muted-foreground">
                  No gigs found for &ldquo;{query}&ldquo;. Try different
                  keywords.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {children}
    </SearchDialogContext.Provider>
  );
};

const useSearchDialog = () => {
  const context = useContext(SearchDialogContext);

  if (!context) {
    throw new Error(
      "useSearchDialog must be used within a SearchDialogProvider"
    );
  }

  return context;
};

export const SearchToggle = ({ ...props }: ComponentProps<typeof Slot>) => {
  const { setOpen } = useSearchDialog();

  const toggleSearch = () => setOpen((prev) => !prev);

  return <Slot onClick={toggleSearch} {...props} />;
};

export const SidebarClose = ({ ...props }: ComponentProps<typeof Slot>) => {
  const { toggleSidebar, setOpen } = useSidebar();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile, setOpen]);

  return <Slot onClick={toggleSidebar} {...props} />;
};

export const SidebarToggle = ({ ...props }: ComponentProps<typeof Slot>) => {
  const { toggleSidebar } = useSidebar();

  return <Slot onClick={toggleSidebar} {...props} />;
};

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
