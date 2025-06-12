"use client";

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
import { LucideIcon } from "lucide-react";
import { calculatePasswordStrength } from "@/lib/utils";
import PasswordInput from "../password-input";
import PasswordStrengthIndicator from "../password-strength-indicator";

interface FormInputProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "password-with-indicator"
    | "password-confirmation";
  icon: LucideIcon;
  description?: string;
  required?: boolean;
  className?: string;
}

export default function FormInput<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  icon: Icon,
  description,
  required = false,
  className,
}: FormInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {label}
            {required && <span className="text-xs text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            {type === "password-with-indicator" ? (
              <div className="flex flex-col ga-2">
                <PasswordInput {...field} placeholder={placeholder} />
                <PasswordStrengthIndicator
                  strength={calculatePasswordStrength(field.value)}
                />
              </div>
            ) : type === "password" ? (
              <PasswordInput {...field} placeholder={placeholder} />
            ) : type === "password-confirmation" ? (
              <Input type="password" {...field} placeholder={placeholder} />
            ) : (
              <Input type={type} {...field} placeholder={placeholder} />
            )}
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
