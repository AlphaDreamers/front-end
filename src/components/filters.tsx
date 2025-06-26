/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import {
  Filter,
  X,
  Calendar as CalendarIcon,
  Sliders,
  SlidersHorizontal,
  Star,
  Folder,
  ShieldCheck,
  ArrowUpDown,
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

import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Calendar } from "./ui/calendar";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Skeleton } from "./ui/skeleton";

// Type Definitions
interface BaseFilter {
  id: string;
  label: string;
  paramKey: string;
  defaultValue?: string | null;
  description?: string;
  icon?: string;
  required?: boolean;
}

interface SelectFilter extends BaseFilter {
  type: "select";
  options: Array<{
    value: string;
    label: string;
    count?: number;
  }>;
  multiple?: boolean;
  placeholder?: string;
}

interface RangeFilter extends BaseFilter {
  type: "range";
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  formatDisplay?: "currency" | "number" | "percentage";
}

interface RatingFilter extends BaseFilter {
  type: "rating";
  maxRating?: number;
  allowHalf?: boolean;
  minSelectable?: number;
  showLabel?: boolean;
}

interface DateFilter extends BaseFilter {
  type: "date";
  mode: "single" | "range";
  minDate?: string;
  maxDate?: string;
  format?: string;
  presets?: Array<{
    label: string;
    value: string;
  }>;
}

interface ToggleFilter extends BaseFilter {
  type: "toggle";
  onLabel?: string;
  offLabel?: string;
  defaultChecked?: boolean;
}

interface SortFilter extends BaseFilter {
  type: "sort";
  options: Array<{
    value: string;
    label: string;
    direction?: "asc" | "desc";
  }>;
  defaultOption?: string;
}

export type FilterType =
  | SelectFilter
  | RangeFilter
  | RatingFilter
  | DateFilter
  | ToggleFilter
  | SortFilter;

interface FiltersProps {
  filters: FilterType[];
  className?: string;
  mobileBreakpoint?: number;
  showClearAll?: boolean;
  title?: string;
  preserveParams?: string[];
}

// Helper function to parse URL param values based on filter type
const parseParamValue = (value: string | null, filter: FilterType): any => {
  if (!value) return null;

  switch (filter.type) {
    case "select":
      return filter.multiple ? value.split(",").filter(Boolean) : value;
    case "range":
      const [min, max] = value.split("-").map(Number);
      return [isNaN(min) ? filter.min : min, isNaN(max) ? filter.max : max];
    case "rating":
      const rating = Number(value);
      return isNaN(rating) ? 0 : rating;
    case "toggle":
      return value === "true";
    case "date":
      // Handle preset values or ISO dates
      if (value.match(/^\d+d$/)) return value;
      return value;
    case "sort":
      return value;
    default:
      return value;
  }
};

// Helper function to encode values for URL params
const encodeParamValue = (value: any, filter: FilterType): string | null => {
  if (value === null || value === undefined) return null;

  switch (filter.type) {
    case "select":
      if (filter.multiple) {
        return Array.isArray(value) && value.length > 0
          ? value.join(",")
          : null;
      }
      return value || null;
    case "range":
      if (
        Array.isArray(value) &&
        (value[0] !== filter.min || value[1] !== filter.max)
      ) {
        return `${value[0]}-${value[1]}`;
      }
      return null;
    case "rating":
      return value > 0 ? String(value) : null;
    case "toggle":
      return value ? "true" : null;
    case "date":
      return value || null;
    case "sort":
      return value !== filter.defaultOption ? value : null;
    default:
      return String(value);
  }
};

// Individual filter component
const FilterItem = ({
  filter,
  value,
  onChange,
}: {
  filter: FilterType;
  value: any;
  onChange: (value: any) => void;
}) => {
  // Local state for immediate UI updates
  const [localValue, setLocalValue] = useState(value);

  const [date, setDate] = useState<Date | undefined>(() => {
    if (!localValue) return undefined;
    // Handle preset values
    if (typeof localValue === "string" && localValue.match(/^\d+d$/)) {
      const days = parseInt(localValue);
      const d = new Date();
      d.setDate(d.getDate() - days);
      return d;
    }
    return new Date(localValue);
  });

  // Sync local state when URL changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced onChange for range filters
  const debouncedOnChange = useDebouncedCallback((newValue: any) => {
    onChange(newValue);
  }, 300);

  const handleChange = (newValue: any) => {
    setLocalValue(newValue);
    if (filter.type === "range") {
      debouncedOnChange(newValue);
    } else {
      onChange(newValue);
    }
  };

  // Helper to get icon component based on filter type
  const getFilterIcon = (filter: FilterType) => {
    const defaultIcons: Record<string, any> = {
      select: Folder,
      range: Sliders,
      rating: Star,
      date: CalendarIcon,
      toggle: ShieldCheck,
      sort: ArrowUpDown,
    };

    return defaultIcons[filter.type] || Filter;
  };

  switch (filter.type) {
    case "select":
      if (filter.multiple) {
        const IconComponent = getFilterIcon(filter);
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <IconComponent className="h-4 w-4 text-purple-500" />
              <Label className="text-sm font-medium">{filter.label}</Label>
              {localValue?.length > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                >
                  {localValue.length}
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              {filter.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${filter.id}-${option.value}`}
                    checked={localValue?.includes(option.value) || false}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...(localValue || []), option.value]
                        : (localValue || []).filter(
                            (v: string) => v !== option.value
                          );
                      handleChange(newValue.length > 0 ? newValue : null);
                    }}
                    className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <Label
                    htmlFor={`${filter.id}-${option.value}`}
                    className="text-sm flex-1 cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  {option.count !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {option.count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      } else {
        return (
          <div className="space-y-3">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <Select value={localValue || ""} onValueChange={handleChange}>
              <SelectTrigger>
                <SelectValue placeholder={filter.placeholder || "Select..."} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      }

    case "range":
      const rangeValue = localValue || [filter.min, filter.max];
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{filter.label}</span>
            {(rangeValue[0] > filter.min || rangeValue[1] < filter.max) && (
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
              >
                Active
              </Badge>
            )}
          </div>
          <div className="px-2">
            <Slider
              value={rangeValue}
              onValueChange={(value) => handleChange(value)}
              min={filter.min}
              max={filter.max}
              step={filter.step || 1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>
                {filter.prefix}
                {rangeValue[0]}
                {filter.suffix}
              </span>
              <span>
                {filter.prefix}
                {rangeValue[1]}
                {filter.suffix}
              </span>
            </div>
          </div>
        </div>
      );

    case "rating":
      const ratingValue = localValue || 0;
      const stars = Array.from(
        { length: filter.maxRating || 5 },
        (_, i) => i + 1
      );

      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{filter.label}</span>
            {ratingValue > 0 && (
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
              >
                {ratingValue}+ stars
              </Badge>
            )}
          </div>
          <div className="flex gap-1">
            {stars.map((star) => (
              <button
                key={star}
                onClick={() => handleChange(ratingValue === star ? 0 : star)}
                className="p-1 hover:bg-muted rounded transition-colors"
                disabled={!!filter.minSelectable && star < filter.minSelectable}
              >
                <Star
                  className={cn(
                    "h-4 w-4",
                    star <= ratingValue
                      ? "fill-purple-500 text-purple-500"
                      : "text-muted-foreground",
                    filter.minSelectable &&
                      star < filter.minSelectable &&
                      "opacity-30"
                  )}
                />
              </button>
            ))}
          </div>
          {filter.description && (
            <p className="text-xs text-muted-foreground">
              {filter.description}
            </p>
          )}
        </div>
      );

    case "date":
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">{filter.label}</span>
            {localValue && (
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
              >
                Active
              </Badge>
            )}
          </div>
          {filter.presets && (
            <div className="flex flex-wrap gap-2">
              {filter.presets.map((preset) => (
                <Button
                  key={preset.value}
                  variant="outline"
                  size="sm"
                  // here preset.value must be converted to a Date object or ISO string
                  onClick={() => {
                    const presetDate = preset.value.match(/^\d+d$/)
                      ? new Date(
                          Date.now() -
                            parseInt(preset.value) * 24 * 60 * 60 * 1000
                        )
                      : new Date(preset.value);
                    handleChange(presetDate.toISOString());
                  }}
                  className="text-xs"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? (
                  format(date, filter.format || "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  handleChange(newDate ? newDate.toISOString() : null);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      );

    case "toggle":
      const ToggleIcon = getFilterIcon(filter);
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ToggleIcon className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">{filter.label}</span>
              {localValue && (
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                >
                  {filter.onLabel || "On"}
                </Badge>
              )}
            </div>
            <Switch
              checked={localValue || false}
              onCheckedChange={handleChange}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
          {filter.description && (
            <p className="text-xs text-muted-foreground">
              {filter.description}
            </p>
          )}
        </div>
      );

    case "sort":
      const SortIcon = getFilterIcon(filter);
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <SortIcon className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">{filter.label}</span>
            {localValue !== filter.defaultOption && (
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
              >
                Active
              </Badge>
            )}
          </div>
          <Select
            value={localValue || filter.defaultOption || ""}
            onValueChange={handleChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    default:
      return null;
  }
};

// Main Filters component
const Filters = ({
  filters,
  className,
  mobileBreakpoint = 1024,
  showClearAll = true,
  title = "Filters",
  preserveParams = [],
}: FiltersProps) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Track window width for responsive behavior
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [mobileBreakpoint]);

  // Get current filter values from URL
  const filterValues = useMemo(() => {
    const values: Record<string, any> = {};
    filters.forEach((filter) => {
      const paramValue = searchParams.get(filter.paramKey);
      values[filter.id] = parseParamValue(paramValue, filter);
    });
    return values;
  }, [filters, searchParams]);

  // Handle individual filter changes
  const handleFilterChange = (filter: FilterType, value: any) => {
    const params = new URLSearchParams(searchParams);
    const encodedValue = encodeParamValue(value, filter);

    if (encodedValue === null) {
      params.delete(filter.paramKey);
    } else {
      params.set(filter.paramKey, encodedValue);
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    return filters.filter((filter) => {
      const value = filterValues[filter.id];
      const encoded = encodeParamValue(value, filter);
      return encoded !== null;
    }).length;
  }, [filters, filterValues]);

  // Clear all filters
  const handleClearAll = () => {
    const params = new URLSearchParams(searchParams);
    filters.forEach((filter) => {
      if (!preserveParams.includes(filter.paramKey)) {
        params.delete(filter.paramKey);
      }
    });
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {filters.map((filter) => (
        <FilterItem
          key={filter.id}
          filter={filter}
          value={filterValues[filter.id]}
          onChange={(value) => handleFilterChange(filter, value)}
        />
      ))}

      {showClearAll && activeFilterCount > 0 && (
        <Button
          variant="outline"
          onClick={handleClearAll}
          className="w-full text-purple-600 border-purple-200 hover:bg-purple-50 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900/20"
        >
          <X className="mr-2 h-4 w-4" />
          Clear All Filters ({activeFilterCount})
        </Button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className={cn("", className)}>
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </div>
              {activeFilterCount > 0 && (
                <Badge className="bg-purple-600 hover:bg-purple-700">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh]">
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-purple-500" />
                {title}
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4 overflow-y-auto">
              <FilterContent />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  return (
    <div className={cn("mx-auto", className)}>
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
            <Filter className="h-5 w-5 text-purple-500" />
            {title}
            {activeFilterCount > 0 && (
              <Badge className="bg-purple-600 hover:bg-purple-700">
                {activeFilterCount} active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FilterContent />
        </CardContent>
      </Card>
    </div>
  );
};

export default Filters;

export const FilterCardSkeleton = () => {
  return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
};
