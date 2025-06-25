import { AlertTriangle, LucideIcon } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

interface InfoAlertProps {
  icon?: LucideIcon;
  title?: string;
  children: React.ReactNode;
}

// Info alert component
export const InfoAlert = ({
  icon: Icon = AlertTriangle,
  title,
  children,
}: InfoAlertProps) => {
  return (
    <Alert>
      <Icon className="h-4 w-4" />
      <AlertDescription>
        {title && <strong>{title}:</strong>} {children}
      </AlertDescription>
    </Alert>
  );
};
