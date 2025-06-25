import { LucideIcon } from "lucide-react";

interface FeatureGridProps {
  features: {
    title: string;
    description: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>> | LucideIcon;
    bgColor: string;
  }[];
  columns?: 2 | 3 | 4;
}

export const FeatureGrid = ({ features, columns = 3 }: FeatureGridProps) => {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {features.map((feature, index) => (
        <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
          <div
            className={`w-8 h-8 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}
          >
            <feature.icon className="h-4 w-4 text-white" />
          </div>
          <h4 className="font-semibold text-sm">{feature.title}</h4>
          <p className="text-xs text-muted-foreground">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};
