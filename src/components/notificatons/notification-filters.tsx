// src/components/notifications/notification-filters.tsx

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { NotificationType } from "@prisma/client";
import {
  getNotificationTypeFilters,
  getReadStatusFilters,
} from "@/lib/utils/notifications";

interface NotificationFiltersProps {
  className?: string;
  asSheet?: boolean;
}

export function NotificationFilters({
  className,
  asSheet = false,
}: NotificationFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse current filters from URL
  const currentTypes = searchParams.get("types")?.split(",") || [];
  const currentReadStatus = searchParams.get("status") || "all";
  const currentDateFrom = searchParams.get("from");
  const currentDateTo = searchParams.get("to");

  // Local state for filters
  const [selectedTypes, setSelectedTypes] = useState<NotificationType[]>(
    currentTypes as NotificationType[]
  );
  const [readStatus, setReadStatus] = useState(currentReadStatus);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: currentDateFrom ? new Date(currentDateFrom) : undefined,
    to: currentDateTo ? new Date(currentDateTo) : undefined,
  });

  // Update URL with new filters
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Update type filter
    if (selectedTypes.length > 0) {
      params.set("types", selectedTypes.join(","));
    } else {
      params.delete("types");
    }

    // Update read status filter
    if (readStatus !== "all") {
      params.set("status", readStatus);
    } else {
      params.delete("status");
    }

    // Update date range filters
    if (dateRange.from) {
      params.set("from", format(dateRange.from, "yyyy-MM-dd"));
    } else {
      params.delete("from");
    }

    if (dateRange.to) {
      params.set("to", format(dateRange.to, "yyyy-MM-dd"));
    } else {
      params.delete("to");
    }

    // Reset to page 1 when filters change
    params.set("page", "1");

    router.push(`/notifications?${params.toString()}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedTypes([]);
    setReadStatus("all");
    setDateRange({ from: undefined, to: undefined });
    router.push("/notifications");
  };

  // Check if any filters are active
  const hasActiveFilters =
    selectedTypes.length > 0 ||
    readStatus !== "all" ||
    dateRange.from !== undefined ||
    dateRange.to !== undefined;

  // Toggle notification type
  const toggleNotificationType = (type: NotificationType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Notification Types */}
      <div>
        <h3 className="text-sm font-medium mb-3">Notification Types</h3>
        <div className="space-y-2">
          {getNotificationTypeFilters().map((filter) => {
            const Icon = filter.icon;
            return (
              <label
                key={filter.value}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-800/50 p-2 rounded-md transition-colors"
              >
                <Checkbox
                  checked={selectedTypes.includes(
                    filter.value as NotificationType
                  )}
                  onCheckedChange={() =>
                    toggleNotificationType(filter.value as NotificationType)
                  }
                  className="border-gray-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                />
                <Icon className={cn("size-4", filter.color)} />
                <span className="text-sm">{filter.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Read Status */}
      <div>
        <h3 className="text-sm font-medium mb-3">Status</h3>
        <RadioGroup value={readStatus} onValueChange={setReadStatus}>
          {getReadStatusFilters().map((filter) => (
            <label
              key={filter.value}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-800/50 p-2 rounded-md transition-colors"
            >
              <RadioGroupItem
                value={filter.value}
                className="border-gray-600 text-violet-600"
              />
              <span className="text-sm">{filter.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Date Range */}
      <div>
        <h3 className="text-sm font-medium mb-3">Date Range</h3>
        <div className="space-y-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  "border-gray-700 hover:bg-gray-800",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  format(dateRange.from, "PP")
                ) : (
                  <span>From date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700">
              <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) =>
                  setDateRange((prev) => ({ ...prev, from: date }))
                }
                initialFocus
                className="bg-gray-900"
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  "border-gray-700 hover:bg-gray-800",
                  !dateRange.to && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.to ? (
                  format(dateRange.to, "PP")
                ) : (
                  <span>To date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-700">
              <Calendar
                mode="single"
                selected={dateRange.to}
                onSelect={(date) =>
                  setDateRange((prev) => ({ ...prev, to: date }))
                }
                initialFocus
                disabled={(date) =>
                  dateRange.from ? date < dateRange.from : false
                }
                className="bg-gray-900"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4 border-t border-gray-700">
        <Button
          onClick={applyFilters}
          className="w-full bg-violet-600 hover:bg-violet-700"
        >
          Apply Filters
        </Button>
        {hasActiveFilters && (
          <Button
            onClick={clearFilters}
            variant="outline"
            className="w-full border-gray-700 hover:bg-gray-800"
          >
            <X className="size-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );

  // Render as sheet for mobile
  if (asSheet) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="w-full border-gray-700 hover:bg-gray-800"
          >
            <Filter className="size-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-violet-600 text-white rounded-full">
                {selectedTypes.length +
                  (readStatus !== "all" ? 1 : 0) +
                  (dateRange.from || dateRange.to ? 1 : 0)}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-gray-900 border-gray-700">
          <SheetHeader>
            <SheetTitle>Filter Notifications</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Render as card for desktop
  return (
    <Card className={cn("bg-gray-900 border-gray-700", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Filters</span>
          {hasActiveFilters && (
            <Button
              size="sm"
              variant="ghost"
              onClick={clearFilters}
              className="h-auto p-1 text-xs hover:bg-gray-800"
            >
              Clear all
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FilterContent />
      </CardContent>
    </Card>
  );
}
