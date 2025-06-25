import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Check, ChevronsUpDown, LucideIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { KeyValuePair } from "@/lib/types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

export interface FormComboboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: {
    singular: string;
    plural: string;
  };
  placeholder?: string;
  icon: LucideIcon;
  description?: string;
  required?: boolean;
  className?: string;
  values: KeyValuePair[];
}

const FormCombobox = <T extends FieldValues>({
  control,
  name,
  icon: Icon,
  label,
  required = false,
  values,
  description,
  className,
}: FormComboboxProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          <FormLabel>
            <Icon className="size-4" />
            {label.singular}
            {required && <span className="text-xs text-destructive">*</span>}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? values.find((val) => val.value === field.value)?.label
                    : `Select ${label.singular.toLowerCase()}`}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
              <Command>
                <CommandInput
                  placeholder={`Search ${label.singular.toLowerCase()}...`}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No {label.plural} found.</CommandEmpty>
                  <CommandGroup>
                    {values.map((val) => (
                      <CommandItem
                        value={val.label}
                        key={val.value}
                        onSelect={() => {
                          field.onChange(val.value);
                        }}
                      >
                        {val.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            val.value === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormCombobox;
