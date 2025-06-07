import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Define the shape of each option in our select dropdown
interface SelectOption {
  label: string; // What the user sees
  value: string; // What gets stored in the form
}

// Props interface - using generics to maintain type safety with any form shape
interface FormSelectProps<T extends FieldValues = FieldValues> {
  control: Control<T>; // react-hook-form's control object
  name: Path<T>; // The field name (type-safe path to the field)
  label: string; // Label shown above the select
  placeholder?: string; // Placeholder when no value selected
  options: SelectOption[]; // Array of options to choose from
  description?: string; // Optional help text below the field
  required?: boolean; // Shows a red asterisk if true
  disabled?: boolean; // Disables the entire select
  className?: string; // For custom styling
}

export default function FormSelect<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder = "Select an option",
  options,
  description,
  required = false,
  disabled = false,
  className,
}: FormSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {/* Label with required indicator */}
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>

          {/* The actual select component */}
          <Select
            onValueChange={field.onChange} // Update form when selection changes
            defaultValue={field.value} // Set initial value from form
            disabled={disabled}
          >
            <FormControl>
              {/* Trigger button - what users click to open the dropdown */}
              <SelectTrigger
                className={cn(
                  // This makes placeholder text appear muted when no selection
                  !field.value && "text-muted-foreground"
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>

            {/* Dropdown content */}
            <SelectContent>
              {options.map((option) => (
                <SelectItem
                  key={option.value} // React key for list rendering
                  value={option.value} // The value that gets stored
                >
                  {option.label} {/* What the user sees */}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Optional description text */}
          {description && <FormDescription>{description}</FormDescription>}

          {/* Validation error messages appear here */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
