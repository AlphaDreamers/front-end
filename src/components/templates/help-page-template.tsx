import React, { ComponentProps } from "react";
import PageTemplate from "./page-template";
import { ContactSupportCard } from "../contact/contact-support-card";

export const HelpPageTemplate = ({
  children,
  ...props
}: ComponentProps<typeof PageTemplate>) => {
  return (
    <PageTemplate {...props} className="flex flex-col gap-6">
      {children}
      <ContactSupportCard />
    </PageTemplate>
  );
};
