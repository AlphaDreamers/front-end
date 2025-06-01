import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface PasswordStrengthIndicatorProps {
  strength: number;
  color?: string;
  label?: string;
}

const PasswordStrengthIndicator = ({
  strength,
  color,
  label,
}: PasswordStrengthIndicatorProps) => {
  return (
    <div>
      <div className="flex items-center gap-3">
        <Progress value={strength} className="flex-1 h-2" />
        <span className={cn("text-sm font-medium tabular-nums", color)}>
          {strength.toFixed(0)}%
        </span>
      </div>
      {label && (
        <p className={cn("text-xs", color)}>Password strength: {label}</p>
      )}
    </div>
  );
};
export default PasswordStrengthIndicator;
