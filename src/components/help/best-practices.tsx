interface BestPracticesProps {
  doItems: {
    title?: string;
    items: string[];
  };
  dontItems: {
    title?: string;
    items: string[];
  };
}

// Best practices comparison component
export const BestPractices = ({ doItems, dontItems }: BestPracticesProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-4 text-sm">
      <div>
        <p className="font-medium text-green-600 mb-2">
          ✓ {doItems.title || "Best Practices"}:
        </p>
        <ul className="space-y-1 text-muted-foreground">
          {doItems.items.map((item, i) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="font-medium text-red-600 mb-2">
          ✗ {dontItems.title || "Avoid"}:
        </p>
        <ul className="space-y-1 text-muted-foreground">
          {dontItems.items.map((item, i) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
