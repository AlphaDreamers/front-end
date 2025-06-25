"use client";

import useCompareServicesStore from "@/lib/store/compare-services";
import { Button } from "./ui/button";
import { ListMinus, ListPlus } from "lucide-react";
import { Gig } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleToggle}
            variant={isInComparison ? "default" : "outline"}
            size="sm"
          >
            {isInComparison ? <ListMinus /> : <ListPlus />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isInComparison ? "Remove from comparison" : "Add to comparison"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CompareToggle;
