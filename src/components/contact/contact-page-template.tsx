import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

import AuthCard from "../templates/auth-card";

interface ContactPageTemplateProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const ContactPageTemplate = ({
  title,
  description,
  children,
}: ContactPageTemplateProps) => {
  return (
    <AuthCard
      title={title}
      description={description}
      cardFooter={
        <Link
          className={cn(
            buttonVariants({
              variant: "ghost",
              size: "sm",
            })
          )}
          href="/contact-us"
        >
          <ArrowLeft />
          Back to Message Types
        </Link>
      }
    >
      {children}
    </AuthCard>
  );
};
export default ContactPageTemplate;
