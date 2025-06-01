"use client";

import { type ComponentProps, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PasswordInput = ({
  className,
  ...props
}: Omit<ComponentProps<typeof Input>, "type">) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={className}
        {...props}
      />
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={(e) => {
          e.preventDefault();
          setShowPassword((prev) => !prev);
        }}
        disabled={props.disabled}
        type="button"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>
    </div>
  );
};

export default PasswordInput;
