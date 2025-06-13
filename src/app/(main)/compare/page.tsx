import { Trash2 } from "lucide-react";
import ComparisonTable from "@/components/comparison-table";
import ComparisonCards from "@/components/comparison-cards";
import { Button } from "@/components/ui/button";
import PageTemplate from "@/components/templates/page-template";

export default function ComparePage() {
  return (
    <PageTemplate
      title="Compare Services"
      description="Compare multiple services side by side to find the best fit for your needs."
      actionComponent={
        <Button
          variant="outline"
          className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      }
    >
      {/* Desktop comparison table (hidden on mobile) */}
      <div className="hidden lg:block">
        <ComparisonTable />
      </div>

      {/* Mobile comparison cards (hidden on desktop) */}
      <div className="lg:hidden">
        <ComparisonCards />
      </div>
    </PageTemplate>
  );
}
