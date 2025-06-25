import { LucideIcon } from "lucide-react";

interface TipBoxProps {
  title?: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

// Tip box component
export const TipBox = ({
  title,
  children,
  icon: Icon,
  className = "",
}: TipBoxProps) => {
  return (
    <div className={`bg-muted/50 p-4 rounded-lg ${className}`}>
      {title && (
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4" />}
          {title}
        </h4>
      )}
      {children}
    </div>
  );
};
