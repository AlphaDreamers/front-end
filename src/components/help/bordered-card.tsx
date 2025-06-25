import { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface BorderedCardProps {
  children: React.ReactNode;
  color?:
    | "primary"
    | "blue"
    | "green"
    | "red"
    | "yellow"
    | "purple"
    | "orange"
    | "indigo";
  icon?: React.FC<React.SVGProps<SVGSVGElement>> | LucideIcon;
  title: string;
  description?: string;
}

export const BorderedCard = ({
  children,
  color = "primary",
  icon: Icon,
  title,
  description,
}: BorderedCardProps) => {
  const colorMap = {
    primary: "border-l-primary",
    blue: "border-l-blue-500",
    green: "border-l-green-500",
    red: "border-l-red-500",
    yellow: "border-l-yellow-500",
    purple: "border-l-purple-500",
    orange: "border-l-orange-500",
    indigo: "border-l-indigo-500",
  };

  const iconColorMap = {
    primary: "text-primary",
    blue: "text-blue-500",
    green: "text-green-500",
    red: "text-red-500",
    yellow: "text-yellow-500",
    purple: "text-purple-500",
    orange: "text-orange-500",
    indigo: "text-indigo-500",
  };

  return (
    <Card className={`border-l-4 ${colorMap[color]}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className={`h-5 w-5 ${iconColorMap[color]}`} />}
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
