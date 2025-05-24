"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertTriangle, HelpCircle, RefreshCw } from "lucide-react"

type VerificationStatus = "not_started" | "pending" | "approved" | "rejected"

interface VerificationStatusProps {
  status: VerificationStatus
  rejectionReason?: string
  submissionDate?: string
  onResubmit?: () => void
}

export function VerificationStatus({ status, rejectionReason, submissionDate, onResubmit }: VerificationStatusProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "not_started":
        return (
          <Badge variant="outline" className="bg-muted/20 text-muted-foreground border-muted/30">
            <HelpCircle className="h-3 w-3 mr-1" /> Not Started
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-900/20 text-yellow-400 border-yellow-500/30">
            <Clock className="h-3 w-3 mr-1" /> Pending Review
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-500/30">
            <CheckCircle className="h-3 w-3 mr-1" /> Verified
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-900/20 text-red-400 border-red-500/30">
            <AlertTriangle className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "not_started":
        return <HelpCircle className="h-12 w-12 text-muted-foreground" />
      case "pending":
        return <Clock className="h-12 w-12 text-yellow-400" />
      case "approved":
        return <CheckCircle className="h-12 w-12 text-green-400" />
      case "rejected":
        return <AlertTriangle className="h-12 w-12 text-red-400" />
      default:
        return null
    }
  }

  const getStatusTitle = () => {
    switch (status) {
      case "not_started":
        return "Verification Not Started"
      case "pending":
        return "Verification In Progress"
      case "approved":
        return "Verification Approved"
      case "rejected":
        return "Verification Rejected"
      default:
        return ""
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case "not_started":
        return "You haven't submitted your documents for verification yet. Please complete the form below to start the verification process."
      case "pending":
        return "Your documents have been submitted and are currently being reviewed. This process typically takes 1-3 business days. You'll receive an email notification once the review is complete."
      case "approved":
        return "Congratulations! Your identity has been verified. You now have full access to all features of our marketplace, including buying and selling services."
      case "rejected":
        return (
          rejectionReason ||
          "Your verification was not approved. Please review the feedback and resubmit your documents."
        )
      default:
        return ""
    }
  }

  return (
    <Card className="border-muted/30 bg-black/40 backdrop-blur-sm shadow-xl animate-fadeIn">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Verification Status</CardTitle>
        {getStatusBadge()}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 bg-muted/20 p-6 rounded-full">{getStatusIcon()}</div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-semibold mb-2">{getStatusTitle()}</h3>
            <p className="text-muted-foreground">{getStatusMessage()}</p>

            {submissionDate && status === "pending" && (
              <p className="text-sm text-muted-foreground mt-2">
                Submitted on: {new Date(submissionDate).toLocaleDateString()}
              </p>
            )}

            {status === "approved" && (
              <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <p className="text-sm text-green-400">
                  Your account is fully verified. You can now access all features of our marketplace.
                </p>
              </div>
            )}

            {status === "rejected" && (
              <div className="mt-4">
                <Button onClick={onResubmit} className="bg-purple-600 hover:bg-purple-700">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Resubmit Documents
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
