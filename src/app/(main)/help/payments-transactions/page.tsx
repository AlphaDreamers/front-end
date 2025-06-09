import Link from "next/link"
import { ArrowLeft, CreditCard, DollarSign, Shield, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PaymentsTransactions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Help Center
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-red-500 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Payments and Transactions</h1>
              <p className="text-muted-foreground">Secure, fast, and transparent blockchain payments</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-red-500" />
                Understanding Our Payment System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our Solana-powered payment system ensures secure, fast, and cost-effective transactions. With blockchain
                technology, you get transparent payment processing, escrow protection, and near-instant settlements. All
                payments are processed in SOL or USDC, providing stability and global accessibility.
              </p>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-sm">Escrow Protected</h4>
                  <p className="text-xs text-muted-foreground">Funds held safely</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-sm">Fast Processing</h4>
                  <p className="text-xs text-muted-foreground">1-2 second confirmations</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-sm">Low Fees</h4>
                  <p className="text-xs text-muted-foreground">Minimal transaction costs</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-sm">Transparent</h4>
                  <p className="text-xs text-muted-foreground">Blockchain verified</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-500" />
                Making Payments
              </CardTitle>
              <CardDescription>Step-by-step guide to processing payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security First:</strong> All payments are processed through smart contracts with escrow
                  protection. Your funds are safe until project completion.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Badge className="mt-1">1</Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Connect Your Solana Wallet</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Ensure your Solana wallet is connected and has sufficient SOL or USDC for the payment and
                      transaction fees.
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline">SOL</Badge>
                      <Badge variant="outline">USDC</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Badge className="mt-1">2</Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Review Payment Details</h4>
                    <p className="text-sm text-muted-foreground">
                      Check the service cost, platform fee, and total amount before confirming the transaction.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Badge className="mt-1">3</Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Authorize Transaction</h4>
                    <p className="text-sm text-muted-foreground">
                      Your wallet will prompt you to approve the transaction. Review the details and confirm.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Badge className="mt-1">4</Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Funds Enter Escrow</h4>
                    <p className="text-sm text-muted-foreground">
                      Payment is held in a smart contract escrow until the freelancer completes and delivers the work.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Badge className="mt-1">5</Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Release Payment</h4>
                    <p className="text-sm text-muted-foreground">
                      Once you approve the completed work, funds are automatically released to the freelancer.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Transaction Fees
              </CardTitle>
              <CardDescription>Understanding our transparent fee structure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Platform Fees:</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                      <div>
                        <p className="text-sm font-medium">Service Fee (Clients)</p>
                        <p className="text-xs text-muted-foreground">Per transaction</p>
                      </div>
                      <Badge variant="outline">5%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                      <div>
                        <p className="text-sm font-medium">Service Fee (Freelancers)</p>
                        <p className="text-xs text-muted-foreground">Per transaction</p>
                      </div>
                      <Badge variant="outline">10%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                      <div>
                        <p className="text-sm font-medium">Withdrawal Fee</p>
                        <p className="text-xs text-muted-foreground">To external wallet</p>
                      </div>
                      <Badge variant="outline">2%</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-secondary">Blockchain Fees:</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                      <div>
                        <p className="text-sm font-medium">Solana Network Fee</p>
                        <p className="text-xs text-muted-foreground">Per transaction</p>
                      </div>
                      <Badge variant="outline">~$0.001</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                      <div>
                        <p className="text-sm font-medium">Smart Contract Fee</p>
                        <p className="text-xs text-muted-foreground">Escrow operations</p>
                      </div>
                      <Badge variant="outline">~$0.005</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                      <div>
                        <p className="text-sm font-medium">Priority Fee</p>
                        <p className="text-xs text-muted-foreground">Optional, for faster processing</p>
                      </div>
                      <Badge variant="outline">Variable</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Fee Calculation Example</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service Cost:</span>
                    <span>$100 USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee (5%):</span>
                    <span>$5 USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network Fee:</span>
                    <span>~$0.01 SOL</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total Cost:</span>
                    <span>$105.01</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Payment Issues
              </CardTitle>
              <CardDescription>Common problems and their solutions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border-l-4 border-l-red-500 pl-4">
                  <h4 className="font-semibold text-red-600 mb-2">Transaction Failed</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Cause:</strong> Insufficient funds, network congestion, or wallet issues
                    </p>
                    <p>
                      <strong>Solutions:</strong>
                    </p>
                    <ul className="ml-4 space-y-1">
                      <li>• Ensure sufficient SOL/USDC balance for payment + fees</li>
                      <li>• Check network status and retry during low congestion</li>
                      <li>• Increase priority fee for faster processing</li>
                      <li>• Reconnect your wallet and try again</li>
                    </ul>
                  </div>
                </div>

                <div className="border-l-4 border-l-yellow-500 pl-4">
                  <h4 className="font-semibold text-yellow-600 mb-2">Payment Stuck in Escrow</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Cause:</strong> Dispute or incomplete project delivery
                    </p>
                    <p>
                      <strong>Solutions:</strong>
                    </p>
                    <ul className="ml-4 space-y-1">
                      <li>• Communicate with the freelancer to resolve issues</li>
                      <li>• Use the dispute resolution system if needed</li>
                      <li>• Contact support for mediation assistance</li>
                      <li>• Review project requirements and deliverables</li>
                    </ul>
                  </div>
                </div>

                <div className="border-l-4 border-l-blue-500 pl-4">
                  <h4 className="font-semibold text-blue-600 mb-2">Wrong Payment Amount</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Cause:</strong> Price changes or calculation errors
                    </p>
                    <p>
                      <strong>Solutions:</strong>
                    </p>
                    <ul className="ml-4 space-y-1">
                      <li>• Check the original service agreement</li>
                      <li>• Review any approved scope changes</li>
                      <li>• Contact the freelancer to clarify pricing</li>
                      <li>• File a dispute if there&apos;s a genuine error</li>
                    </ul>
                  </div>
                </div>

                <div className="border-l-4 border-l-purple-500 pl-4">
                  <h4 className="font-semibold text-purple-600 mb-2">Wallet Connection Issues</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong>Cause:</strong> Browser, extension, or network problems
                    </p>
                    <p>
                      <strong>Solutions:</strong>
                    </p>
                    <ul className="ml-4 space-y-1">
                      <li>• Refresh the page and reconnect wallet</li>
                      <li>• Clear browser cache and cookies</li>
                      <li>• Update your wallet extension</li>
                      <li>• Try a different browser or device</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  Payment Security Tips
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-green-600 mb-2">✓ Best Practices:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Always verify payment details before confirming</li>
                      <li>• Keep your wallet software updated</li>
                      <li>• Use strong passwords and 2FA</li>
                      <li>• Monitor your transaction history regularly</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-red-600 mb-2">✗ Avoid:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Sharing your private keys or seed phrase</li>
                      <li>• Making payments outside the platform</li>
                      <li>• Ignoring transaction confirmations</li>
                      <li>• Using public WiFi for transactions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-3">Payment Support Available</h3>
              <p className="text-primary-foreground/80 mb-4">
                Experiencing payment issues or have questions about transactions? Our payment support team is ready to
                help.
              </p>
              <Button variant="secondary">Contact Payment Support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
