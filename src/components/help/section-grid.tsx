import { Badge } from "../ui/badge";

interface SectionGridProps {
  sections: {
    title: string;
    items: {
      title: string;
      description: string;
    }[];
    color?: string; // Tailwind color class
    badgeVariant?: "outline" | "secondary" | "default";
  }[];
}

// Two-column section grid
export const SectionGrid = ({ sections }: SectionGridProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {sections.map((section, index) => (
        <div key={index} className="space-y-4">
          <h4 className={`font-semibold ${section.color || "text-primary"}`}>
            {section.title}
          </h4>
          <div className="space-y-3">
            {section.items.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <Badge
                  variant={section.badgeVariant || "outline"}
                  className="mt-1"
                >
                  •
                </Badge>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
