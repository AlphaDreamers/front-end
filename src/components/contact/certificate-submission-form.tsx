"use client";
import { CertificateRequestSchema } from "@/lib/schemas/contact";
import { KeyValuePair } from "@/lib/types";
import ContactForm from "./contact-form";
import { Award, Link as LinkIcon } from "lucide-react";
import { createContactMessage } from "@/lib/actions/contact";
import FormCombobox from "../forms/form-combobox";
import FormInput from "../forms/form-input";

interface CertificateSubmissionFormProps {
  isAuth: boolean;
  email?: string;
  badges?: KeyValuePair[];
}

const CertificateSubmissionForm = ({
  isAuth,
  email,
  badges = [],
}: CertificateSubmissionFormProps) => {
  return (
    <ContactForm
      action={createContactMessage}
      isAuth={isAuth}
      defaultValues={{
        guestEmail: email,
        applyingForId: "",
        certificateUrl: "",
        type: "CERTIFICATE_REQUEST",
      }}
      schema={CertificateRequestSchema}
    >
      {(form) => (
        <>
          <FormCombobox
            control={form.control}
            name="applyingForId"
            label={{ singular: "Badge", plural: "Badges" }}
            placeholder="Select the badge you are applying for"
            values={badges}
            description="Choose the badge you want to submit for certification"
            icon={Award}
            required
          />

          <FormInput
            control={form.control}
            name="certificateUrl"
            label="Certificate URL"
            placeholder="https://example.com/certificate"
            description="Provide the URL to your certification or achievement"
            icon={LinkIcon}
            required
          />
        </>
      )}
    </ContactForm>
  );
};

export default CertificateSubmissionForm;
