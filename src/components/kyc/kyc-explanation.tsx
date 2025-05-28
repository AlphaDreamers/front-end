import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Lock, CheckCircle } from "lucide-react";

export function KycExplanation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6 text-purple-400" />
          Identity Verification (KYC)
        </CardTitle>
        <CardDescription>
          Complete the verification process to unlock all features of our
          marketplace
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          To ensure a secure and trustworthy environment for all users, we
          require identity verification before you can buy or sell services on
          our platform. This process helps us:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-muted/20 p-4 rounded-lg border border-muted/30 flex flex-col items-center text-center">
            <Lock className="h-8 w-8 text-purple-400 mb-2" />
            <h3 className="font-medium mb-1">Prevent Fraud</h3>
            <p className="text-sm text-muted-foreground">
              Protect our community from scams and fraudulent activities
            </p>
          </div>

          <div className="bg-muted/20 p-4 rounded-lg border border-muted/30 flex flex-col items-center text-center">
            <Shield className="h-8 w-8 text-purple-400 mb-2" />
            <h3 className="font-medium mb-1">Ensure Compliance</h3>
            <p className="text-sm text-muted-foreground">
              Meet regulatory requirements for cryptocurrency transactions
            </p>
          </div>

          <div className="bg-muted/20 p-4 rounded-lg border border-muted/30 flex flex-col items-center text-center">
            <CheckCircle className="h-8 w-8 text-purple-400 mb-2" />
            <h3 className="font-medium mb-1">Build Trust</h3>
            <p className="text-sm text-muted-foreground">
              Create a trusted environment where users can transact with
              confidence
            </p>
          </div>
        </div>

        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mt-4">
          <p className="text-sm">
            <span className="font-medium text-purple-400">
              Your privacy matters:
            </span>{" "}
            All your personal information and documents are encrypted and stored
            securely. We follow strict data protection protocols and only use
            your information for verification purposes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
