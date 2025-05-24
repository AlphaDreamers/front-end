"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface GigDescriptionProps {
  description: string;
}

export default function GigDescription({ description }: GigDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  // Check if description is long enough to need expansion
  const isLongDescription = description.length > 500;

  // If description is short, just show it all
  if (!isLongDescription) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">About This Gig</h2>
        <div className="prose prose-invert max-w-none">{description}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">About This Gig</h2>
      <div className="prose prose-invert max-w-none">
        {expanded ? description : <>{description.substring(0, 500)}...</>}
      </div>

      <Button
        variant="ghost"
        className="flex items-center gap-2"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <>
            <ChevronUp className="h-4 w-4" />
            Show Less
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" />
            Show More
          </>
        )}
      </Button>
    </div>
  );
}
