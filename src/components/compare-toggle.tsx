"use client";

import useCompareServicesStore from "@/lib/store/compare-services";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { Gig } from "@/lib/types";

interface CompareToggleProps {
  gig: Gig;
}

const CompareToggle = ({ gig }: CompareToggleProps) => {
  const { isGigInComparison, addGig, removeGig } = useCompareServicesStore();

  const isInComparison = isGigInComparison(gig.id);

  const handleToggle = () => {
    if (isInComparison) {
      removeGig(gig.id);
    } else {
      addGig(gig);
    }
  };

  return (
    <Button
      onClick={handleToggle}
      variant={isInComparison ? "destructive" : "outline"}
      size="sm"
    >
      {isInComparison ? <Minus /> : <Plus />}
    </Button>
  );
};

export default CompareToggle;
