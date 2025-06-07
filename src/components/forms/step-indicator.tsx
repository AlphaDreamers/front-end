import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: number;
  currentStep: number;
  className?: string;
}

const StepIndicator = ({
  steps,
  currentStep,
  className,
}: StepIndicatorProps) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      {Array.from({ length: steps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <div key={index} className="flex items-center">
            <div
              className={cn(
                "flex size-12 items-center justify-center rounded-full border-2 transition-all",
                isCompleted &&
                  "border-primary bg-primary text-primary-foreground",
                isCurrent &&
                  "border-primary bg-background text-primary ring-2 ring-primary ring-offset-2 ring-offset-background",
                !isCompleted &&
                  !isCurrent &&
                  "border-muted-foreground/30 bg-background text-muted-foreground"
              )}
            >
              <span className="text-sm font-medium">{stepNumber}</span>
            </div>
            {index < steps - 1 && (
              <div
                className={cn(
                  "h-[2px] w-16 mx-1",
                  stepNumber < currentStep
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
export default StepIndicator;
