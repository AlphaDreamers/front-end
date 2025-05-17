"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  id?: string;
  className?: string;
}

const SearchBar = ({ id = "query", className }: SearchBarProps) => {
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
    <div className={cn("relative", className)}>
      <Button
        className="absolute left-px top-px rounded-[4.5px] rounded-r-none size-[34px]"
        variant="secondary"
        size="icon"
      >
        <Search className="text-muted-foreground" />
      </Button>

      <Input
        type="search"
        placeholder="Search..."
        defaultValue={query}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-12"
      />
    </div>
  );
};

export default SearchBar;
