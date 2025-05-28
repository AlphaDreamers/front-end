"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, HelpCircle } from "lucide-react";

interface VerificationStatusProps {
  isApproved?: boolean;
}

export function VerificationStatus({ isApproved }: VerificationStatusProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Verification Status</CardTitle>
        {isApproved ? (
          <Badge
            variant="outline"
            className="bg-muted/20 text-muted-foreground border-muted/30"
          >
            <HelpCircle className="h-3 w-3 mr-1" /> Not Started
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="bg-green-900/20 text-green-400 border-green-500/30"
          >
            <CheckCircle className="h-3 w-3 mr-1" /> Verified
          </Badge>
        )}
      </CardHeader>

      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 bg-muted/20 p-6 rounded-full">
            {isApproved ? (
              <CheckCircle className="h-12 w-12 text-green-400" />
            ) : (
              <HelpCircle className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-semibold mb-2">
              {isApproved
                ? "Verification Approved"
                : "Verification Not Started"}
            </h3>
            <p className="text-muted-foreground">
              {isApproved
                ? "Your identity has been successfully verified. You can now access all features of our marketplace."
                : "You need to submit your documents for verification to access all features of our marketplace."}
            </p>

            {isApproved && (
              <div className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <p className="text-sm text-green-400">
                  Your account is fully verified. You can now access all
                  features of our marketplace.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
