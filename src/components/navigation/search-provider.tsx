"use client";

import {
  ComponentProps,
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { KeyValuePair } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Slot } from "@radix-ui/react-slot";

interface SearchContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({
  children,
  results,
}: PropsWithChildren<{
  results: KeyValuePair[];
}>) {
  const [open, setOpen] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search gigs..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {results.map((result) => (
              <CommandItem
                key={result.value}
                value={result.value}
                onSelect={(value) => {
                  setOpen(false);
                  push(`/gigs/${value}`);
                }}
              >
                {result.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </SearchContext.Provider>
  );
}

export const SearchToggle = ({
  ...props
}: Omit<ComponentProps<typeof Slot>, "onClick">) => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("SearchToggle must be used within a SearchProvider");
  }
  const { setOpen } = context;

  const toggle = () => setOpen((open) => !open);

  return <Slot onClick={toggle} {...props} />;
};
