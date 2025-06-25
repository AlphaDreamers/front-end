import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";

export const ContactSupportCard = () => {
  return (
    <div className="border-primary/75 bg-primary/25 border p-4 backdrop-blur-2xl border-dashed rounded-xl text-primary-foreground hover:shadow shadow-primary/20 transition-all duration-300 hover:bg-primary/30 hover:border-primary ease-in-out">
      <div className="text-center">
        <HelpCircle className="mx-auto size-10 mb-2 stroke-[1.5]" />
        <h2 className="text-2xl font-bold mb-2">Still Need Help?</h2>
        <p className="text-primary-foreground/80 mb-4 max-w-2xl mx-auto">
          Can&apos;t find what you&apos;re looking for? Our support team is here
          to help you with any questions or issues you might have.
        </p>
        <Link
          href="/contact"
          className={cn(
            buttonVariants({
              size: "lg",
              variant: "secondary",
            })
          )}
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
};
