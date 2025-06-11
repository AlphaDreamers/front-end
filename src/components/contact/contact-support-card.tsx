import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

export const ContactSupportCard = () => {
  return (
    <div className="mt-16 bg-gray-800 rounded-lg p-8 text-center">
      <HelpCircle className="h-12 w-12 mx-auto mb-4 text-violet-400" />
      <h2 className="text-2xl font-bold text-white mb-2">
        Can&apos;t find your answer?
      </h2>
      <p className="text-gray-400 mb-6">
        Our support team is here to help you with any questions you might have.
      </p>
      <Link
        href="/(main)/contact/support"
        className={cn(
          buttonVariants({
            size: "lg",
          })
        )}
      >
        Contact Support
      </Link>
    </div>
  );
};
