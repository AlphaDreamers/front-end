import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { cn } from "@/lib/utils";

interface FormOtpInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  length: number;
  description?: string;
  className?: string;
}

const FormOtpInput = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  length,
  className,
}: FormOtpInputProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col gap-4 items-center", className)}>
          <FormLabel className="text-center text-lg font-semibold">
            {label}
          </FormLabel>
          <FormControl>
            <InputOTP maxLength={length} {...field}>
              <InputOTPGroup>
                {[...Array(length)].map((_, i) => (
                  <InputOTPSlot key={i} index={i} className="size-12" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormOtpInput;
