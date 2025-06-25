import { LucideIcon } from "lucide-react";
import { Badge } from "../ui/badge";

interface StepListProps {
  steps: {
    title: string;
    description: string;
    number?: number;
    items?: string[];
    badges?: string[];
    icon?: LucideIcon;
  }[];
}

export const StepList = ({ steps }: StepListProps) => {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div
          key={index}
          className="flex items-start gap-4 p-4 border rounded-lg"
        >
          <Badge className="mt-1">{step.number || index + 1}</Badge>
          <div className="flex-1">
            <h4 className="font-semibold mb-2">{step.title}</h4>
            <p className="text-sm text-muted-foreground">{step.description}</p>
            {step.items && (
              <div className="text-xs text-muted-foreground mt-2 space-y-1">
                {step.items.map((item, i) => (
                  <p key={i}>• {item}</p>
                ))}
              </div>
            )}
            {step.badges && (
              <div className="flex gap-2 mt-2">
                {step.badges.map((badge, i) => (
                  <Badge key={i} variant="outline">
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
