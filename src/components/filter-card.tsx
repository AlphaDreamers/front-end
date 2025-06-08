"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import {
  Filter,
  X,
  ChevronDown,
  Check,
  Calendar as CalendarIcon,
  Sliders,
  SlidersHorizontal,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Calendar } from "./ui/calendar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

// Types
type FilterValue =
  | string
  | string[]
  | number
  | boolean
  | [number, number]
  | Date
  | null;

interface BaseFilter {
  id: string;
  label: string;
  type: "select" | "multi" | "range" | "toggle" | "date";
}

interface SelectFilter extends BaseFilter {
  type: "select";
  options: { label: string; value: string }[];
}

interface MultiFilter extends BaseFilter {
  type: "multi";
  options: { label: string; value: string }[];
}

interface RangeFilter extends BaseFilter {
  type: "range";
  min: number;
  max: number;
  step?: number;
  format?: (value: number) => string;
}

interface ToggleFilter extends BaseFilter {
  type: "toggle";
}

interface DateFilter extends BaseFilter {
  type: "date";
}

export type FilterType =
  | SelectFilter
  | MultiFilter
  | RangeFilter
  | ToggleFilter
  | DateFilter;

interface FiltersProps {
  filters: FilterType[];
  className?: string;
}

export default function Filters({ filters, className }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Parse filters from URL
  const activeFilters = useMemo(() => {
    const result: Record<string, FilterValue> = {};

    filters.forEach((filter) => {
      if (filter.type === "multi") {
        const values = searchParams.getAll(filter.id);
        if (values.length > 0) result[filter.id] = values;
      } else if (filter.type === "range") {
        const min = searchParams.get(`${filter.id}-min`);
        const max = searchParams.get(`${filter.id}-max`);
        if (min || max) {
          result[filter.id] = [
            min ? Number(min) : filter.min,
            max ? Number(max) : filter.max,
          ];
        }
      } else if (filter.type === "toggle") {
        const value = searchParams.get(filter.id);
        if (value === "true") result[filter.id] = true;
      } else if (filter.type === "date") {
        const value = searchParams.get(filter.id);
        if (value) result[filter.id] = new Date(value);
      } else {
        const value = searchParams.get(filter.id);
        if (value) result[filter.id] = value;
      }
    });

    return result;
  }, [searchParams, filters]);

  // Update URL with debouncing for smooth UX
  const updateFilters = useDebouncedCallback(
    (updates: Record<string, FilterValue>) => {
      const params = new URLSearchParams(searchParams);

      // Clear old values
      filters.forEach((filter) => {
        params.delete(filter.id);
        if (filter.type === "range") {
          params.delete(`${filter.id}-min`);
          params.delete(`${filter.id}-max`);
        }
      });

      // Set new values
      Object.entries({ ...activeFilters, ...updates }).forEach(
        ([key, value]) => {
          if (value === null || value === undefined || value === false) {
            return; // Don't include in URL
          }

          const filter = filters.find((f) => f.id === key);
          if (!filter) return;

          if (filter.type === "multi" && Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
          } else if (filter.type === "range" && Array.isArray(value)) {
            params.set(`${key}-min`, value[0].toString());
            params.set(`${key}-max`, value[1].toString());
          } else if (filter.type === "date" && value instanceof Date) {
            params.set(key, value.toISOString());
          } else if (filter.type === "toggle" && value === true) {
            params.set(key, "true");
          } else if (value) {
            params.set(key, value.toString());
          }
        }
      );

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    300
  );

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const activeCount = Object.keys(activeFilters).length;

  const FilterContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sliders className="h-5 w-5" />
          Filters
          {activeCount > 0 && <Badge variant="secondary">{activeCount}</Badge>}
        </h3>

        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 pb-4 border-b">
          {Object.entries(activeFilters).map(([key, value]) => {
            const filter = filters.find((f) => f.id === key);
            if (!filter) return null;

            let displayValue = "";
            if (filter.type === "multi" && Array.isArray(value)) {
              displayValue = `${value.length} selected`;
            } else if (filter.type === "range" && Array.isArray(value)) {
              const format = filter.format || ((v: number) => v.toString());
              displayValue = `${format(value[0])} - ${format(value[1])}`;
            } else if (filter.type === "date" && value instanceof Date) {
              displayValue = format(value, "MMM d, yyyy");
            } else if (filter.type === "toggle") {
              displayValue = "On";
            } else if (filter.type === "select") {
              const option = filter.options.find((o) => o.value === value);
              displayValue = option?.label || value.toString();
            } else {
              displayValue = value.toString();
            }

            return (
              <Badge key={key} variant="secondary" className="gap-1">
                <span className="text-xs">{filter.label}:</span>
                <span className="font-medium">{displayValue}</span>
                <button
                  onClick={() => updateFilters({ [key]: null })}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Filter Controls */}
      <div className="space-y-4">
        {filters.map((filter) => (
          <FilterControl
            key={filter.id}
            filter={filter}
            value={activeFilters[filter.id]}
            onChange={(value) => updateFilters({ [filter.id]: value })}
          />
        ))}
      </div>
    </div>
  );

  // Mobile: Sheet
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className={cn("gap-2", className)}>
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeCount}
              </Badge>
            )}
          </Button>
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="sr-only">Filters</DrawerTitle>
          </DrawerHeader>
          <div className="p-6">{FilterContent}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Inline
  return (
    <div className={cn("rounded-lg border bg-card p-6", className)}>
      {FilterContent}
    </div>
  );
}

// Individual Filter Controls
interface FilterControlProps {
  filter: Filter;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

function FilterControl({ filter, value, onChange }: FilterControlProps) {
  switch (filter.type) {
    case "select":
      return (
        <SelectFilterControl
          filter={filter}
          value={value as string}
          onChange={onChange}
        />
      );
    case "multi":
      return (
        <MultiFilterControl
          filter={filter}
          value={value as string[]}
          onChange={onChange}
        />
      );
    case "range":
      return (
        <RangeFilterControl
          filter={filter}
          value={value as [number, number]}
          onChange={onChange}
        />
      );
    case "toggle":
      return (
        <ToggleFilterControl
          filter={filter}
          value={value as boolean}
          onChange={onChange}
        />
      );
    case "date":
      return (
        <DateFilterControl
          filter={filter}
          value={value as Date}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
}

// Select Filter
function SelectFilterControl({
  filter,
  value,
  onChange,
}: {
  filter: SelectFilter;
  value?: string;
  onChange: (value: FilterValue) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{filter.label}</Label>
      <Select value={value || ""} onValueChange={(v) => onChange(v || null)}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="value">Any</SelectItem>
          {filter.options.map((option) => (
            <SelectItem key={option.value} value={option.value || "value"}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Multi-select Filter
function MultiFilterControl({
  filter,
  value = [],
  onChange,
}: {
  filter: MultiFilter;
  value?: string[];
  onChange: (value: FilterValue) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue.length > 0 ? newValue : null);
  };

  return (
    <div className="space-y-2">
      <Label>{filter.label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="text-left truncate">
              {value.length === 0
                ? `Select ${filter.label.toLowerCase()}`
                : `${value.length} selected`}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No options found.</CommandEmpty>
              <CommandGroup>
                {filter.options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleOption(option.value)}
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      <div
                        className={cn(
                          "h-4 w-4 border rounded-sm flex items-center justify-center",
                          value.includes(option.value) &&
                            "bg-primary border-primary"
                        )}
                      >
                        {value.includes(option.value) && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <span>{option.label}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Range Filter
function RangeFilterControl({
  filter,
  value,
  onChange,
}: {
  filter: RangeFilter;
  value?: [number, number];
  onChange: (value: FilterValue) => void;
}) {
  const currentValue = value || [filter.min, filter.max];
  const format = filter.format || ((v: number) => v.toString());

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label>{filter.label}</Label>
        <span className="text-sm text-muted-foreground">
          {format(currentValue[0])} - {format(currentValue[1])}
        </span>
      </div>
      <div className="space-y-4">
        <Slider
          min={filter.min}
          max={filter.max}
          step={filter.step || 1}
          value={currentValue}
          onValueChange={(value) => onChange(value as [number, number])}
        />
        <div className="flex gap-2">
          <Input
            type="number"
            min={filter.min}
            max={currentValue[1]}
            value={currentValue[0]}
            onChange={(e) => {
              const newMin = Number(e.target.value);
              if (!isNaN(newMin)) {
                onChange([newMin, currentValue[1]]);
              }
            }}
            className="h-8"
          />
          <span className="flex items-center text-muted-foreground">to</span>
          <Input
            type="number"
            min={currentValue[0]}
            max={filter.max}
            value={currentValue[1]}
            onChange={(e) => {
              const newMax = Number(e.target.value);
              if (!isNaN(newMax)) {
                onChange([currentValue[0], newMax]);
              }
            }}
            className="h-8"
          />
        </div>
      </div>
    </div>
  );
}

// Toggle Filter
function ToggleFilterControl({
  filter,
  value = false,
  onChange,
}: {
  filter: ToggleFilter;
  value?: boolean;
  onChange: (value: FilterValue) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={filter.id}>{filter.label}</Label>
      <Switch
        id={filter.id}
        checked={value}
        onCheckedChange={(checked) => onChange(checked || null)}
      />
    </div>
  );
}

// Date Filter
function DateFilterControl({
  filter,
  value,
  onChange,
}: {
  filter: DateFilter;
  value?: Date;
  onChange: (value: FilterValue) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{filter.label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => onChange(date || null)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export const FilterCardSkeletion = () => {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-6 w-24 bg-gray-300 rounded" />
        <div className="h-6 w-16 bg-gray-300 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-32 bg-gray-300 rounded" />
        <div className="h-10 w-full bg-gray-300 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-32 bg-gray-300 rounded" />
        <div className="h-10 w-full bg-gray-300 rounded" />
      </div>
    </div>
  );
};
