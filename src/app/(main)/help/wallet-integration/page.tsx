import Link from "next/link";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Wallet,
  Shield,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function WalletIntegration() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/help">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Help Center
          </Button>
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Solana Wallet Integration</h1>
            <p className="text-muted-foreground">
              Secure blockchain-powered transactions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              Why Solana Wallet Integration Matters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Integrating your Solana wallet is crucial for secure, transparent,
              and fast transactions on our platform. With blockchain technology,
              you maintain full control over your funds while enjoying
              near-instant payments and minimal transaction fees.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-sm">Secure</h4>
                <p className="text-xs text-muted-foreground">
                  Blockchain security
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-sm">Fast</h4>
                <p className="text-xs text-muted-foreground">
                  Near-instant transfers
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM14 6a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h6zM4 11a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zM7 10a1 1 0 100 2h1a1 1 0 100-2H7z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-sm">Low Fees</h4>
                <p className="text-xs text-muted-foreground">Minimal costs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-500" />
              Connecting Your Wallet
            </CardTitle>
            <CardDescription>
              Step-by-step guide to connect your Solana wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Make sure you have a Solana wallet
                installed before proceeding. We recommend Phantom, Solflare, or
                Sollet.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <Badge className="mt-1">1</Badge>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">
                    Install a Solana Wallet
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Download and install one of the supported wallet extensions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Phantom</Badge>
                    <Badge variant="outline">Solflare</Badge>
                    <Badge variant="outline">Sollet</Badge>
                    <Badge variant="outline">Slope</Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <Badge className="mt-1">2</Badge>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">
                    Navigate to Account Settings
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Go to your profile page and click on &quot;Account Settings&quot; →
                    &quot;Wallet Integration&quot;
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <Badge className="mt-1">3</Badge>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">Click &quot;Connect Wallet&quot;</h4>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred wallet from the list and click
                    &quot;Connect&quot;
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <Badge className="mt-1">4</Badge>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">Authorize Connection</h4>
                  <p className="text-sm text-muted-foreground">
                    Your wallet will open a popup asking for permission. Click
                    &quot;Connect&quot; or &quot;Approve&quot;
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <Badge className="mt-1">5</Badge>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">Verify Connection</h4>
                  <p className="text-sm text-muted-foreground">
                    You&apos;ll see a green checkmark and your wallet address
                    displayed in your account settings
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-green-500" />
              Managing Your Wallet
            </CardTitle>
            <CardDescription>
              Essential wallet management basics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-primary">Wallet Security:</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-1">
                      •
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">
                        Keep Your Seed Phrase Safe
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Never share your 12/24-word recovery phrase
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-1">
                      •
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">
                        Use Strong Passwords
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Protect your wallet with a secure password
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-1">
                      •
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">
                        Enable Two-Factor Authentication
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Add an extra layer of security
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-secondary">
                  Wallet Operations:
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-1">
                      •
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">Check Your Balance</p>
                      <p className="text-xs text-muted-foreground">
                        Monitor SOL and token balances
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-1">
                      •
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">
                        View Transaction History
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Track all your payments and receipts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-1">
                      •
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">
                        Disconnect When Needed
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Safely disconnect from untrusted sites
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Troubleshooting
            </CardTitle>
            <CardDescription>Common issues and their solutions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="border-l-4 border-l-red-500 pl-4">
                <h4 className="font-semibold text-red-600 mb-2">
                  Wallet Won&apos;t Connect
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Refresh the page and try again</p>
                  <p>• Make sure your wallet extension is unlocked</p>
                  <p>• Check if you&apos;re on the correct network (Mainnet)</p>
                  <p>• Disable other wallet extensions temporarily</p>
                </div>
              </div>

              <div className="border-l-4 border-l-yellow-500 pl-4">
                <h4 className="font-semibold text-yellow-600 mb-2">
                  Transaction Failed
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Ensure you have enough SOL for transaction fees</p>
                  <p>• Check network congestion and try again later</p>
                  <p>• Verify the recipient address is correct</p>
                  <p>• Increase the priority fee if available</p>
                </div>
              </div>

              <div className="border-l-4 border-l-blue-500 pl-4">
                <h4 className="font-semibold text-blue-600 mb-2">
                  Balance Not Showing
                </h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Wait for network confirmation (usually 1-2 minutes)</p>
                  <p>• Refresh your wallet and the platform</p>
                  <p>• Check the transaction on Solana Explorer</p>
                  <p>• Contact support if the issue persists</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-3">
              Wallet Integration Support
            </h3>
            <p className="text-primary-foreground/80 mb-4">
              Having trouble with your wallet connection? Our technical support
              team specializes in blockchain integrations.
            </p>
            <Button variant="secondary">Get Technical Support</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
