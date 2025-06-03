"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  id?: string;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
  debounceMs?: number;
}

export function SearchBar({
  id = "q",
  placeholder = "Search...",
  className,
  containerClassName,
  debounceMs = 300,
}: SearchBarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get(id) || "");

  // Sync with URL changes (e.g., from filters or back button)
  useEffect(() => {
    setQuery(searchParams.get(id) || "");
  }, [searchParams, id]);

  // Debounced URL update
  const updateUrl = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(id, value);
    } else {
      params.delete(id);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, debounceMs);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    updateUrl(value);
  };

  const handleClear = () => {
    setQuery("");
    updateUrl("");
  };

  return (
    <div className={cn("relative", containerClassName)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />

      <Input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className={cn("pl-10 pr-10", className)}
      />

      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}
