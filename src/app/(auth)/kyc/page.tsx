"use client";

import { KycExplanation } from "@/components/kyc/kyc-explanation";
import { KycInstructions } from "@/components/kyc/kyc-instructions";
import { DocumentUpload } from "@/components/kyc/document-upload";
import { VerificationStatus } from "@/components/kyc/verification-status";

export default function KycPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Identity Verification</h1>
      <p className="text-muted-foreground mb-8">
        Complete the verification process to unlock all features of our
        marketplace
      </p>

      <div className="flex flex-col gap-8">
        <VerificationStatus isApproved={true} />

        <KycExplanation />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <KycInstructions />

          <DocumentUpload />
        </div>
      </div>
    </div>
  );
}
