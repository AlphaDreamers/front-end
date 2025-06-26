"use client";

import { useState } from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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

  const variantStyles = {
    1: {
      gradient: "from-blue-500/20 via-cyan-400/20 to-blue-600/20 dark:from-blue-500/20 dark:via-cyan-400/20 dark:to-blue-600/20",
      border: "border-blue-500/50 dark:border-blue-500/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      textColor: "text-blue-700 dark:text-blue-300",
      glow: "shadow-blue-500/10 dark:shadow-blue-500/25",
      dotGradient: "from-blue-400/60 to-blue-600/60 dark:from-blue-500/40 dark:to-blue-600/40",
    },
    2: {
      gradient: "from-purple-500/20 via-pink-400/20 to-purple-600/20 dark:from-purple-500/20 dark:via-pink-400/20 dark:to-purple-600/20",
      border: "border-purple-500/50 dark:border-purple-500/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      textColor: "text-purple-700 dark:text-purple-300",
      glow: "shadow-purple-500/10 dark:shadow-purple-500/25",
      dotGradient: "from-purple-400/60 to-purple-600/60 dark:from-purple-500/40 dark:to-purple-600/40",
    },
    3: {
      gradient: "from-emerald-500/20 via-green-400/20 to-emerald-600/20 dark:from-emerald-500/20 dark:via-green-400/20 dark:to-emerald-600/20",
      border: "border-emerald-500/50 dark:border-emerald-500/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      textColor: "text-emerald-700 dark:text-emerald-300",
      glow: "shadow-emerald-500/10 dark:shadow-emerald-500/25",
      dotGradient: "from-emerald-400/60 to-emerald-600/60 dark:from-emerald-500/40 dark:to-emerald-600/40",
    },
    4: {
      gradient: "from-amber-500/20 via-yellow-400/20 to-orange-500/20 dark:from-amber-500/20 dark:via-yellow-400/20 dark:to-orange-500/20",
      border: "border-amber-500/50 dark:border-amber-500/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      textColor: "text-amber-700 dark:text-amber-300",
      glow: "shadow-amber-500/10 dark:shadow-amber-500/25",
      dotGradient: "from-amber-400/60 to-orange-500/60 dark:from-amber-500/40 dark:to-orange-500/40",
    },
    5: {
      gradient: "from-red-500/20 via-rose-400/20 to-red-600/20 dark:from-red-500/20 dark:via-rose-400/20 dark:to-red-600/20",
      border: "border-red-500/50 dark:border-red-500/30",
      iconColor: "text-red-600 dark:text-red-400",
      textColor: "text-red-700 dark:text-red-300",
      glow: "shadow-red-500/10 dark:shadow-red-500/25",
      dotGradient: "from-red-400/60 to-red-600/60 dark:from-red-500/40 dark:to-red-600/40",
    },
  };

  const currentVariant = variantStyles[variant];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className={cn(
        "relative border rounded-lg p-4",
        currentVariant.border,
        currentVariant.glow
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2 rounded-lg bg-gradient-to-br",
              currentVariant.gradient
            )}
          >
            <Icon size={18} className={currentVariant.iconColor} />
          </div>
          <Label>{label}</Label>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible((prev) => !prev)}
            className="hover:border"
          >
            {isVisible ? <EyeOff /> : <Eye />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="hover:border"
          >
            {isCopied ? <Check className="text-green-400" /> : <Copy />}
          </Button>
        </div>
      </div>

      {/* Value display */}
      <div className="relative">
        <div
          className={cn(
            "bg-background relative rounded-lg border p-3",
            currentVariant.border
          )}
        >
          <div
            className={cn(
              "text-sm leading-relaxed break-all",
              isVisible && currentVariant.textColor
            )}
          >
            {isVisible ? (
              <span>{value}</span>
            ) : (
              <div className="flex items-center gap-1">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "size-2 rounded-full transition-all duration-200",
                      "bg-gradient-to-r",
                      currentVariant.dotGradient
                    )}
                    style={{
                      animationDelay: `${i * 50}ms`,
                      animation: "pulse 2s infinite",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HiddenField;
