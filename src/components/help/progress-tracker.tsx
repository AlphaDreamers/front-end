import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

interface ProgressTrackerProps {
  items: {
    label: string;
    status: "Complete" | "In Progress" | "Pending";
    progress: number; // 0-100
    description?: string;
  }[];
}

// Progress tracker component
export const ProgressTracker = ({ items }: ProgressTrackerProps) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{item.label}</span>
            <Badge
              variant={item.status === "Complete" ? "secondary" : "outline"}
            >
              {item.status}
            </Badge>
          </div>
          <Progress value={item.progress} className="h-2" />
          {item.description && (
            <p className="text-xs text-muted-foreground">{item.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};
