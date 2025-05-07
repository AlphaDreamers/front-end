"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./ui";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  id?: string;
}

const SearchBar = ({ id = "query" }: SearchBarProps) => {
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
    <div className="relative">
      <Button
        className="absolute left-px top-1/2 rounded-[4.5px] -translate-y-1/2 rounded-r-none size-[34px]"
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
