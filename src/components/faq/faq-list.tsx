import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { FAQ } from "@/lib/types/faq";

interface FaqListProps {
  faqs: FAQ[];
}

const FaqList = ({ faqs }: FaqListProps) => {
  if (faqs.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800 rounded-lg">
        <h3 className="text-xl font-medium text-white mb-2">
          No results found
        </h3>
        <p className="text-gray-400">
          Try adjusting your search or category filter
        </p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {faqs.map((faq, index) => (
        <Accordion key={index} type="single" collapsible>
          <AccordionItem value={faq.id.toString()}>
            <AccordionTrigger>
              <span className="font-medium">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </Accordion>
  );
};
export default FaqList;

export const FaqListSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
};
