import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const AuthCard = ({
  title,
  description,
  children,
  footer,
  className,
}: AuthCardProps) => {
  return (
    <Card
      className={cn("animate-in fade-in-50 zoom-in-95 duration-300", className)}
    >
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">{children}</CardContent>

      {footer && (
        <CardFooter className="flex flex-col space-y-2">{footer}</CardFooter>
      )}
    </Card>
  );
};

export default AuthCard;
