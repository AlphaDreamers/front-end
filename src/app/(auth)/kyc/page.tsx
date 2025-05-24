"use client"

import { useState } from "react"
import { KycExplanation } from "@/components/kyc/kyc-explanation"
import { KycInstructions } from "@/components/kyc/kyc-instructions"
import { DocumentUpload } from "@/components/kyc/document-upload"
import { VerificationStatus } from "@/components/kyc/verification-status"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"

export default function KycPage() {
  const [verificationStatus, setVerificationStatus] = useState<"not_started" | "pending" | "approved" | "rejected">(
    "not_started",
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [submissionDate, setSubmissionDate] = useState<string | undefined>(undefined)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setVerificationStatus("pending")
      setSubmissionDate(new Date().toISOString())
      setShowSuccess(true)

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
    } catch (error) {
      console.error("Error submitting KYC:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResubmit = () => {
    setVerificationStatus("not_started")
    setSubmissionDate(undefined)
  }

  return (
    <div className="container mx-auto py-8 px-4 animate-fadeIn">
      <h1 className="text-3xl font-bold mb-2">Identity Verification</h1>
      <p className="text-muted-foreground mb-8">
        Complete the verification process to unlock all features of our marketplace
      </p>

      {showSuccess && (
        <Alert className="mb-6 bg-green-900/20 text-green-400 border-green-800/50">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your documents have been submitted successfully. We'll review them and update your verification status
            within 1-3 business days.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        <VerificationStatus
          status={verificationStatus}
          submissionDate={submissionDate}
          rejectionReason="We couldn't clearly see the information on your ID. Please resubmit with a clearer image where all text is legible."
          onResubmit={handleResubmit}
        />

        {verificationStatus !== "approved" && (
          <>
            <KycExplanation />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <KycInstructions />
              {verificationStatus !== "pending" && (
                <DocumentUpload onSubmit={handleSubmit} isSubmitting={isSubmitting} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
