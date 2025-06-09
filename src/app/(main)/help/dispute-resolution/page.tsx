import Link from "next/link"
import { ArrowLeft, Gavel, FileText, MessageCircle, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function DisputeResolution() {
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
            <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center">
              <Gavel className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dispute Resolution</h1>
              <p className="text-muted-foreground">Fair and transparent conflict resolution</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-orange-500" />
                Understanding Disputes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Disputes are rare, but when they occur, our fair and transparent resolution process ensures both parties
                are heard. Our blockchain-based system maintains an immutable record of all communications and
                transactions, providing clear evidence for resolution. We aim to resolve disputes quickly while
                maintaining fairness for all parties.
              </p>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-sm">Documentation</h4>
                  <p className="text-xs text-muted-foreground">Clear evidence</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-sm">Mediation</h4>
                  <p className="text-xs text-muted-foreground">Professional support</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Gavel className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-sm">Fair Process</h4>
                  <p className="text-xs text-muted-foreground">Impartial resolution</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-sm">Quick Resolution</h4>
                  <p className="text-xs text-muted-foreground">Timely decisions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Filing a Dispute
              </CardTitle>
              <CardDescription>Step-by-step guide to initiating dispute resolution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Gavel className="h-4 w-4" />
                <AlertDescription>
                  <strong>Before Filing:</strong> Try to resolve the issue directly with the other party through our
                  messaging system. Many disputes can be resolved through clear communication.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Badge className="mt-1">1</Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Attempt Direct Resolution</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Contact the other party through our platform messaging system to discuss the issue and attempt
                      resolution.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <p>• Clearly explain the problem</p>
                      <p>• Provide specific examples</p>
                      <p>• Suggest reasonable solutions</p>
                      <p>• Allow 48-72 hours for response</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Badge className="mt-1">2</Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Gather Documentation</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Collect all relevant evidence to support your case before filing the dispute.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <p>• Screenshots of conversations</p>
                      <p>• Original project requirements</p>
                      <p>• Delivered work samples</p>
                      <p>• Payment records and receipts</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Badge className="mt-1">3</Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">File the Dispute</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Navigate to your order page and click &quot;File Dispute&quot; to begin the formal process.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <p>• Select dispute category</p>
                      <p>• Provide detailed description</p>
                      <p>• Upload supporting evidence</p>
                      <p>• Submit dispute form</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Badge className="mt-1">4</Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Await Response</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      The other party has 48 hours to respond to your dispute with their side of the story.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <p>• Notification sent to other party</p>
                      <p>• 48-hour response window</p>
                      <p>• Automatic escalation if no response</p>
                      <p>• You&apos;ll be notified of their response</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Badge className="mt-1">5</Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Mediation Assignment</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      A neutral mediator will be assigned to review the case and facilitate resolution.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <p>• Professional mediator assigned</p>
                      <p>• Review of all evidence</p>
                      <p>• Additional information may be requested</p>
                      <p>• Mediation session scheduled if needed</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-500" />
                Dispute Process
              </CardTitle>
              <CardDescription>What happens after you file a dispute</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Dispute Filed</span>
                    <Badge variant="secondary">Complete</Badge>
                  </div>
                  <Progress value={100} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Your dispute has been submitted and logged in our system
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Period</span>
                    <Badge variant="outline">48 Hours</Badge>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Other party has time to respond with their perspective
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Mediation Review</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <Progress value={0} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Professional mediator reviews all evidence and communications
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Resolution</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <Progress value={0} className="h-2" />
                  <p className="text-xs text-muted-foreground">Final decision made and communicated to both parties</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Possible Outcomes:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Full Refund</p>
                        <p className="text-xs text-muted-foreground">Complete return of payment to client</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Partial Refund</p>
                        <p className="text-xs text-muted-foreground">Proportional refund based on work completed</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">No Refund</p>
                        <p className="text-xs text-muted-foreground">Payment released to freelancer</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Revision Required</p>
                        <p className="text-xs text-muted-foreground">Freelancer must make specified changes</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-secondary">Timeline:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Response Period: 48 hours</p>
                        <p className="text-xs text-muted-foreground">For other party to respond</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Review Period: 3-5 days</p>
                        <p className="text-xs text-muted-foreground">Mediator evaluation time</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Resolution: 1-2 days</p>
                        <p className="text-xs text-muted-foreground">Final decision and implementation</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Total: 5-10 days</p>
                        <p className="text-xs text-muted-foreground">Complete resolution timeframe</p>
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
                <CheckCircle className="h-5 w-5 text-purple-500" />
                Avoiding Disputes
              </CardTitle>
              <CardDescription>Best practices to prevent conflicts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">For Clients:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Clear Project Requirements</p>
                        <p className="text-xs text-muted-foreground">Provide detailed, specific instructions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Set Realistic Deadlines</p>
                        <p className="text-xs text-muted-foreground">Allow adequate time for quality work</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Communicate Regularly</p>
                        <p className="text-xs text-muted-foreground">Stay in touch throughout the project</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Provide Timely Feedback</p>
                        <p className="text-xs text-muted-foreground">
                          Review work promptly and give constructive input
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-secondary">For Freelancers:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Clarify Requirements</p>
                        <p className="text-xs text-muted-foreground">Ask questions if anything is unclear</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Set Realistic Expectations</p>
                        <p className="text-xs text-muted-foreground">Be honest about timelines and capabilities</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Provide Regular Updates</p>
                        <p className="text-xs text-muted-foreground">Keep clients informed of progress</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Deliver Quality Work</p>
                        <p className="text-xs text-muted-foreground">Meet or exceed agreed-upon standards</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Communication Best Practices</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-green-600 mb-2">✓ Effective Communication:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Be clear and specific in all messages</li>
                      <li>• Respond to messages within 24 hours</li>
                      <li>• Document important agreements in writing</li>
                      <li>• Use professional and respectful language</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-red-600 mb-2">✗ Communication Pitfalls:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Making assumptions without clarification</li>
                      <li>•Ignoring messages or delaying responses</li>
                      <li>• Changing requirements without discussion</li>
                      <li>• Using aggressive or unprofessional tone</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-3">Dispute Resolution Support</h3>
              <p className="text-primary-foreground/80 mb-4">
                Need help with the dispute process or have questions about a specific case? Our dispute resolution team
                is here to guide you.
              </p>
              <Button variant="secondary">Contact Dispute Support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
