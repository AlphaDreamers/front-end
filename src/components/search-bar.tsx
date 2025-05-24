"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search } from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import React from "react";

interface SearchBarProps extends React.ComponentProps<typeof Input> {
  id?: string;
  containerClassName?: string;
}

const SearchBar = ({
  id = "query",
  containerClassName,
  className,
  ...props
}: SearchBarProps) => {
  const searchParams = useSearchParams();
  const path = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(id, term);
    } else {
      params.delete(id);
    }
    replace(`${path}?${params.toString()}`);
  }, 300);

  const query = searchParams.get(id) || "";

  return (
    <div className={cn("relative", containerClassName)}>
      <Button
        className="absolute left-px top-px rounded-[4.5px] rounded-r-none size-[38px]"
        variant="secondary"
        size="icon"
        onClick={() => {
          handleSearch.flush();
        }}
      >
        <Search className="text-muted-foreground size-5" />
      </Button>

      <Input
        type="search"
        placeholder="Search..."
        defaultValue={query}
        onChange={(e) => handleSearch(e.target.value)}
        className={cn("pl-14 h-10 text-xl", className)}
        {...props}
      />
    </div>
  );
};

export default SearchBar;
