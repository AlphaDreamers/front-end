"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface HiddenFieldProps {
  label: string;
  value: string;
  icon: LucideIcon;
  variant?: 1 | 2 | 3 | 4 | 5;
}

const HiddenField = ({
  label,
  value,
  icon: Icon,
  variant = 2,
}: HiddenFieldProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>
          <Icon
            size={16}
            className={cn({
              "text-blue-500": variant === 1,
              "text-purple-500": variant === 2,
              "text-green-500": variant === 3,
              "text-amber-500": variant === 4,
              "text-red-500": variant === 5,
            })}
          />
          {label}
        </Label>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible((prev) => !prev)}
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              navigator.clipboard.writeText(value);
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 2000);
            }}
          >
            {isCopied ? (
              <Check size={16} className="text-primary" />
            ) : (
              <Copy size={16} />
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-center">
        <div
          className={cn(
            "p-2 bg-accent rounded font-mono text-sm flex-1 text-wrap",
            {
              "text-blue-500": variant === 1,
              "text-purple-500": variant === 2,
              "text-green-500": variant === 3,
              "text-amber-500": variant === 4,
              "text-red-500": variant === 5,
            }
          )}
        >
          {isVisible ? value : "••••••••••••••••••••••••"}
        </div>
      </div>
    </div>
  );
};
export default HiddenField;
