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
import { LucideIcon } from "lucide-react";
import { Control } from "react-hook-form";

interface FormInputProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  icon?: LucideIcon;
  description?: string;
  required?: boolean;
}

export function FormInput({
  control,
  name,
  label,
  placeholder,
  type = "text",
  icon: Icon,
  description,
  required = false,
}: FormInputProps) {
  return (
    <FormField
      control={control}
      name={name}
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
                />
              ) : (
                <Input
                  {...field}
                  type={type}
                  placeholder={placeholder}
                  className={Icon ? "pl-10" : ""}
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
}
