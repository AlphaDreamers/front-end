import { cn } from "@/lib/utils";

type PageTemplateProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actionComponent?: React.ReactNode;
  className?: string;
  centered?: boolean;
};

const PageTemplate = ({
  children,
  title,
  description,
  actionComponent,
  className,
  centered,
}: PageTemplateProps) => {
  return (
    <main className="h-full flex flex-col ">
      <div
        className={cn(
          "flex flex-col md:flex-row md:items-center mb-8 gap-4",
          centered ? "justify-center text-center" : "justify-between"
        )}
      >
        <div>
          <h1 className="text-3xl text-primary font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        {actionComponent}
      </div>

      <div className={className}>{children}</div>
    </main>
  );
};
export default PageTemplate;
