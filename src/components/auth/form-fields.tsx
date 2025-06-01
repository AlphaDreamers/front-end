import { LucideIcon } from "lucide-react";
import { Control, FieldValues, Path } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import PasswordInput from "@/components/password-input";

interface FormInputProps<T extends FieldValues = FieldValues> {
  control: Control<T, unknown, T>;
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  icon?: LucideIcon;
  description?: string;
  required?: boolean;
  onFocus?: () => void;
}
const FormInput = <T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  icon: Icon,
  description,
  required = false,
  onFocus,
}: FormInputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            {label}
            {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative">
              {Icon && (
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              )}
              {type === "password" ? (
                <PasswordInput
                  {...field}
                  placeholder={placeholder}
                  className={Icon ? "pl-10" : ""}
                  onFocus={onFocus}
                />
              ) : (
                <Input
                  {...field}
                  type={type}
                  placeholder={placeholder}
                  className={Icon ? "pl-10" : ""}
                  onFocus={onFocus}
                />
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default FormInput;
