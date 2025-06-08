import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ } from "@/lib/types/faq";

interface GigFaqListProps {
  faqs: FAQ[];
}

const GigFaqList = ({ faqs }: GigFaqListProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>

      <div>
        {faqs.map((faq, index) => (
          <Accordion key={index} type="single" collapsible>
            <AccordionItem value={faq.id}>
              <AccordionTrigger>
                <span className="font-medium">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
};
export default GigFaqList;

export const FaqListSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-4">
          <div className="h-6 w-3/4 mb-2 bg-gray-700 animate-pulse" />
          <div className="h-4 w-full bg-gray-700 animate-pulse" />
        </div>
      ))}
    </div>
  );
};
