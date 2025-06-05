import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  cardFooter?: React.ReactNode;
}

const AuthCard = ({
  title,
  description,
  children,
  footer,
  cardFooter,
}: AuthCardProps) => {
  return (
    <div className="animate-in fade-in-50 zoom-in-95 duration-300 max-w-md mx-auto">
      <div className="space-y-2 text-center mb-8 mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          {title}
        </h1>

        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      <Card>
        <CardContent className="space-y-4">{children}</CardContent>

        {footer && (
          <CardFooter className="mx-auto text-sm text-muted-foreground">
            {footer}
          </CardFooter>
        )}
      </Card>

      {cardFooter && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {cardFooter}
        </div>
      )}
    </div>
  );
};

export default AuthCard;
