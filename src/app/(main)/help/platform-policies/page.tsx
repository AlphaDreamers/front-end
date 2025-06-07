import Link from "next/link"
import { ArrowLeft, Shield, FileText, Users, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PlatformPolicies() {
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
            <div className="w-12 h-12 rounded-lg bg-teal-500 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Platform Policies</h1>
              <p className="text-muted-foreground">Understanding our terms, privacy, and community guidelines</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="border-l-4 border-l-teal-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-teal-500" />
                Our Policy Framework
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our policies are designed to create a safe, fair, and transparent environment for all users. Built on
                blockchain principles of transparency and immutability, our policies ensure trust and accountability
                throughout the platform. We regularly update our policies to reflect best practices and regulatory
                requirements.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-sm">Terms of Service</h4>
                  <p className="text-xs text-muted-foreground">Platform usage rules</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Eye className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-sm">Privacy Policy</h4>
                  <p className="text-xs text-muted-foreground">Data protection</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-sm">Community Guidelines</h4>
                  <p className="text-xs text-muted-foreground">Behavior standards</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="terms" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="terms">Terms of Service</TabsTrigger>
              <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
              <TabsTrigger value="community">Community Guidelines</TabsTrigger>
            </TabsList>

            <TabsContent value="terms" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    Terms of Service - Key Points
                  </CardTitle>
                  <CardDescription>Essential terms and conditions for platform usage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-l-blue-500 pl-4">
                      <h4 className="font-semibold mb-2">Account Responsibilities</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• You must provide accurate and complete information when creating your account</p>
                        <p>• You are responsible for maintaining the security of your account credentials</p>
                        <p>• You must be at least 18 years old to use our platform</p>
                        <p>• One person may only maintain one active account</p>
                        <p>• You must notify us immediately of any unauthorized account access</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-l-green-500 pl-4">
                      <h4 className="font-semibold mb-2">Platform Usage</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• Use the platform only for legitimate freelance services and projects</p>
                        <p>• Comply with all applicable laws and regulations</p>
                        <p>• Respect intellectual property rights of others</p>
                        <p>• Do not engage in fraudulent or deceptive practices</p>
                        <p>• Maintain professional conduct in all interactions</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-l-yellow-500 pl-4">
                      <h4 className="font-semibold mb-2">Payment Terms</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• All payments are processed through our secure blockchain system</p>
                        <p>• Platform fees are clearly disclosed before each transaction</p>
                        <p>• Funds are held in escrow until project completion</p>
                        <p>• Refunds are subject to our dispute resolution process</p>
                        <p>• You are responsible for any applicable taxes on your earnings</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-l-red-500 pl-4">
                      <h4 className="font-semibold mb-2">Prohibited Activities</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• Creating fake accounts or impersonating others</p>
                        <p>• Manipulating reviews or ratings</p>
                        <p>• Sharing contact information to bypass platform fees</p>
                        <p>• Posting illegal, harmful, or inappropriate content</p>
                        <p>• Attempting to hack or disrupt platform services</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Service Availability</h4>
                    <p className="text-sm text-muted-foreground">
                      While we strive for 99.9% uptime, we cannot guarantee uninterrupted service. We reserve the right
                      to modify or discontinue services with appropriate notice. Our liability is limited as outlined in
                      the full Terms of Service document.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-green-500" />
                    Privacy Policy - Data Information
                  </CardTitle>
                  <CardDescription>How we collect, use, and protect your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-l-blue-500 pl-4">
                      <h4 className="font-semibold mb-2">Information We Collect</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>
                          <strong>Account Information:</strong> Name, email, profile details, and verification documents
                        </p>
                        <p>
                          <strong>Transaction Data:</strong> Payment information, order history, and blockchain records
                        </p>
                        <p>
                          <strong>Usage Data:</strong> Platform activity, preferences, and interaction patterns
                        </p>
                        <p>
                          <strong>Communication Data:</strong> Messages, support tickets, and feedback
                        </p>
                        <p>
                          <strong>Technical Data:</strong> IP address, browser type, and device information
                        </p>
                      </div>
                    </div>

                    <div className="border-l-4 border-l-green-500 pl-4">
                      <h4 className="font-semibold mb-2">How We Use Your Data</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• Provide and improve our platform services</p>
                        <p>• Process payments and maintain transaction records</p>
                        <p>• Verify identity and prevent fraud</p>
                        <p>• Send important notifications and updates</p>
                        <p>• Provide customer support and resolve disputes</p>
                        <p>• Comply with legal and regulatory requirements</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-l-purple-500 pl-4">
                      <h4 className="font-semibold mb-2">Data Protection Measures</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• End-to-end encryption for sensitive data</p>
                        <p>• Secure blockchain storage for transaction records</p>
                        <p>• Regular security audits and penetration testing</p>
                        <p>• Limited access controls and employee training</p>
                        <p>• Compliance with GDPR, CCPA, and other privacy laws</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-l-orange-500 pl-4">
                      <h4 className="font-semibold mb-2">Your Privacy Rights</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• Access and download your personal data</p>
                        <p>• Correct inaccurate or incomplete information</p>
                        <p>• Delete your account and associated data</p>
                        <p>• Opt-out of marketing communications</p>
                        <p>• Request data portability to another service</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Data Sharing</h4>
                      <p className="text-sm text-muted-foreground">
                        We never sell your personal data. We only share information with trusted partners for essential
                        services (payment processing, identity verification) and when required by law.
                      </p>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Data Retention</h4>
                      <p className="text-sm text-muted-foreground">
                        We retain your data only as long as necessary for service provision and legal compliance.
                        Blockchain transaction records are permanent by design.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="community" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    Community Guidelines - Behavior Rules
                  </CardTitle>
                  <CardDescription>Standards for respectful and professional interactions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-l-green-500 pl-4">
                      <h4 className="font-semibold mb-2">Professional Conduct</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• Maintain respectful and courteous communication at all times</p>
                        <p>• Provide honest and accurate information about your services</p>
                        <p>• Deliver work that meets agreed-upon standards and deadlines</p>
                        <p>• Respond to messages and requests in a timely manner</p>
                        <p>• Handle disagreements professionally and constructively</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-l-blue-500 pl-4">
                      <h4 className="font-semibold mb-2">Content Standards</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• All content must be original or properly licensed</p>
                        <p>• Profile information must be accurate and up-to-date</p>
                        <p>• Portfolio samples must represent your actual work</p>
                        <p>• Service descriptions must be clear and truthful</p>
                        <p>• No misleading claims about qualifications or experience</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-l-red-500 pl-4">
                      <h4 className="font-semibold mb-2">Prohibited Behavior</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• Harassment, discrimination, or abusive language</p>
                        <p>• Spam, unsolicited messages, or excessive self-promotion</p>
                        <p>• Sharing inappropriate, offensive, or illegal content</p>
                        <p>• Attempting to manipulate reviews or ratings</p>
                        <p>• Soliciting personal information or off-platform contact</p>
                      </div>
                    </div>

                    <div className="border-l-4 border-l-yellow-500 pl-4">
                      <h4 className="font-semibold mb-2">Intellectual Property</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• Respect copyrights, trademarks, and other intellectual property rights</p>
                        <p>• Only use licensed or royalty-free materials in your work</p>
                        <p>• Clearly communicate ownership rights for delivered work</p>
                        <p>• Report any suspected intellectual property violations</p>
                        <p>• Obtain proper permissions for any third-party content</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Enforcement Actions</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          <strong>Warning:</strong> First-time minor violations
                        </p>
                        <p>
                          <strong>Temporary Suspension:</strong> Repeated or moderate violations
                        </p>
                        <p>
                          <strong>Account Restriction:</strong> Serious policy breaches
                        </p>
                        <p>
                          <strong>Permanent Ban:</strong> Severe or repeated violations
                        </p>
                      </div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Reporting Violations</h4>
                      <p className="text-sm text-muted-foreground">
                        If you encounter behavior that violates our community guidelines, please report it immediately
                        using our reporting system. All reports are reviewed promptly and confidentially.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-3">Policy Questions or Concerns?</h3>
              <p className="text-primary-foreground/80 mb-4">
                Need clarification on our policies or want to report a violation? Our policy team is here to help ensure
                a safe and fair platform for everyone.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="secondary">Contact Policy Team</Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Report Violation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
