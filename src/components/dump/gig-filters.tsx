"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface GigFiltersProps {
  onFilterChange: (filters: {
    search: string;
    category: string;
    status: string;
    sort: string;
  }) => void;
}

export function GigFilters({ onFilterChange }: GigFiltersProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    applyFilters(e.target.value, category, status, sort);
  };

  const applyFilters = (
    searchValue: string,
    categoryValue: string,
    statusValue: string,
    sortValue: string
  ) => {
    onFilterChange({
      search: searchValue,
      category: categoryValue,
      status: statusValue,
      sort: sortValue,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search gigs..."
            value={search}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
}
