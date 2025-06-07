"use client";

import { useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { Check, ChevronsUpDown, X } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MultiSelectOption {
  label: string;
  value: string;
}

interface FormMultiSelectProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: MultiSelectOption[];
  description?: string;
  required?: boolean;
  disabled?: boolean;
  maxItems?: number; // Limit how many items can be selected
  className?: string;
}

export default function FormMultiSelect<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder = "Select options",
  options,
  description,
  required = false,
  disabled = false,
  maxItems,
  className,
}: FormMultiSelectProps<T>) {
  // Local state for controlling the popover open/close
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // The multi-select needs to handle different data formats
        // It might receive strings or objects with id/title properties
        const selectedValues = Array.isArray(field.value) ? field.value : [];

        // Find the full option objects for selected values
        // This handles both string arrays and object arrays
        const selectedOptions = options.filter((option) =>
          selectedValues.some((val) => {
            // If the stored value is a string, compare directly
            if (typeof val === "string") {
              return val === option.value;
            }
            // If it's an object (like for tags), compare the id
            return val.id === option.value;
          })
        );

        // Function to toggle an option on/off
        const toggleOption = (option: MultiSelectOption) => {
          const currentValues = selectedValues;

          // Check if this option is already selected
          const isSelected = currentValues.some((val) =>
            typeof val === "string"
              ? val === option.value
              : val.id === option.value
          );

          let newValues;
          if (isSelected) {
            // Remove the option if it's already selected
            newValues = currentValues.filter((val) =>
              typeof val === "string"
                ? val !== option.value
                : val.id !== option.value
            );
          } else {
            // Add the option if we're under the max limit
            if (maxItems && currentValues.length >= maxItems) {
              return; // Don't add if we've hit the limit
            }

            // For the gig form, tags need to be stored as objects
            // This is why we create objects with id and title
            newValues = [
              ...currentValues,
              { id: option.value, title: option.label },
            ];
          }

          field.onChange(newValues);
        };

        // Function to remove a specific selected option
        const removeOption = (optionValue: string) => {
          const newValues = selectedValues.filter((val) =>
            typeof val === "string"
              ? val !== optionValue
              : val.id !== optionValue
          );
          field.onChange(newValues);
        };

        return (
          <FormItem className={className}>
            {/* Label with optional required indicator and max items count */}
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
              {maxItems && (
                <span className="text-muted-foreground text-xs ml-2">
                  (max {maxItems})
                </span>
              )}
            </FormLabel>

            {/* The main multi-select component */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                      "w-full justify-between",
                      !selectedValues.length && "text-muted-foreground"
                    )}
                  >
                    {/* Show count of selected items or placeholder */}
                    <span className="truncate">
                      {selectedValues.length > 0
                        ? `${selectedValues.length} selected`
                        : placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>

              {/* Dropdown content with search */}
              <PopoverContent className="w-full p-0">
                <Command>
                  {/* Search input to filter options */}
                  <CommandInput placeholder="Search..." />
                  <CommandList>
                    <CommandEmpty>No options found.</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => {
                        const isSelected = selectedValues.some((val) =>
                          typeof val === "string"
                            ? val === option.value
                            : val.id === option.value
                        );
                        // Disable unselected options if we've hit the max
                        const isDisabled =
                          !isSelected &&
                          maxItems &&
                          selectedValues.length >= maxItems;

                        return (
                          <CommandItem
                            key={option.value}
                            onSelect={() => toggleOption(option)}
                            disabled={isDisabled}
                            className="cursor-pointer"
                          >
                            {/* Checkmark for selected items */}
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                isSelected ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {/* Option label with reduced opacity if disabled */}
                            <span className={cn(isDisabled && "opacity-50")}>
                              {option.label}
                            </span>
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Display selected items as removable badges */}
            {selectedOptions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="gap-1"
                  >
                    {option.label}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent form submission
                        removeOption(option.value);
                      }}
                      className="ml-1 hover:text-destructive"
                      disabled={disabled}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
