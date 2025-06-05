import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface PasswordStrengthIndicatorProps {
  strength: number;
}

const PasswordStrengthIndicator = ({
  strength,
}: PasswordStrengthIndicatorProps) => {
  const getStrengthConfig = (strength: number) => {
    if (strength >= 75) {
      return {
        color: "text-green-600",
        label: "Strong",
        progressColor: "bg-green-600",
      };
    } else if (strength >= 50) {
      return {
        color: "text-yellow-600",
        label: "Medium",
        progressColor: "bg-yellow-600",
      };
    } else {
      return {
        color: "text-red-600",
        label: "Weak",
        progressColor: "bg-red-600",
      };
    }
  };

  const { color, label, progressColor } = getStrengthConfig(strength);

  return (
    <div>
      <div className="flex items-center gap-3">
        <Progress
          value={strength}
          className="flex-1 h-2"
          style={
            {
              "--progress-foreground": progressColor,
            } as React.CSSProperties
          }
        />
        <span className={cn("text-sm font-medium tabular-nums", color)}>
          {strength.toFixed(0)}%
        </span>
      </div>
      <p className={cn("text-xs mt-1", color)}>Password strength: {label}</p>
    </div>
  );
};

export default PasswordStrengthIndicator;
