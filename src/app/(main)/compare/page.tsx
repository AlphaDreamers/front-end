import ComparisonTable from "@/components/comparison-table";
import PageTemplate from "@/components/templates/page-template";

export default function ComparePage() {
  return (
    <PageTemplate
      title="Compare Services"
      description="Compare multiple services side by side to find the best fit for your needs."
    >
      <ComparisonTable />
    </PageTemplate>
  );
}
