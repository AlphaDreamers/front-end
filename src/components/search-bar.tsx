"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  param?: string;
  placeholder?: string;
  className?: string;
  containerClassName?: string;
  debounceMs?: number;
}

const SearchBar = ({
  param = "q",
  placeholder = "Search...",
  className,
  containerClassName,
  debounceMs = 300,
}: SearchBarProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(param, value);
    } else {
      params.delete(param);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, debounceMs);

  return (
    <div className={cn("relative", containerClassName)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />

      <Input
        type="search"
        defaultValue={searchParams.get(param) || ""}
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        className={cn("pl-10 pr-10", className)}
      />
    </div>
  );
};
export default SearchBar;
