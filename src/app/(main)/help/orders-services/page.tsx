import Link from "next/link"
import { ArrowLeft, FileText, Search, ShoppingCart, Eye, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function OrdersServices() {
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
            <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Orders and Services</h1>
              <p className="text-muted-foreground">Your complete guide to ordering and managing services</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-green-500" />
                Understanding Our Order System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our platform makes it easy to find, order, and manage freelance services. Whether you need graphic
                design, web development, content writing, or any other digital service, our streamlined process ensures
                a smooth experience from browsing to project completion.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Browse Services</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Place Order</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Track Progress</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-500" />
                Browsing Services
              </CardTitle>
              <CardDescription>Find the perfect freelancer for your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Search Methods:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Category Browse</p>
                        <p className="text-xs text-muted-foreground">
                          Explore services by category (Design, Development, Writing, etc.)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Keyword Search</p>
                        <p className="text-xs text-muted-foreground">
                          Use specific terms to find exactly what you need
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Filter Options</p>
                        <p className="text-xs text-muted-foreground">Sort by price, delivery time, rating, and more</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-secondary">What to Look For:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Portfolio Quality</p>
                        <p className="text-xs text-muted-foreground">Review previous work samples</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Client Reviews</p>
                        <p className="text-xs text-muted-foreground">Read feedback from previous clients</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Response Time</p>
                        <p className="text-xs text-muted-foreground">Check how quickly they respond to messages</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Pro Tip: Service Comparison
                </h4>
                <p className="text-sm text-muted-foreground">
                  Use our comparison tool to evaluate multiple freelancers side-by-side. Compare pricing, delivery
                  times, included features, and client ratings to make the best choice for your project.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-yellow-500" />
                Placing an Order
              </CardTitle>
              <CardDescription>Step-by-step guide to ordering services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Badge className="mt-1">1</Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Select Your Service Package</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Choose from Basic, Standard, or Premium packages based on your needs and budget.
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline">Basic</Badge>
                      <Badge variant="outline">Standard</Badge>
                      <Badge variant="outline">Premium</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Badge className="mt-1">2</Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Customize Your Requirements</h4>
                    <p className="text-sm text-muted-foreground">
                      Add specific details, upload reference files, and specify any special requirements for your
                      project.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Badge className="mt-1">3</Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Review Order Details</h4>
                    <p className="text-sm text-muted-foreground">
                      Double-check the service description, delivery time, price, and any add-ons before proceeding.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Badge className="mt-1">4</Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Secure Payment</h4>
                    <p className="text-sm text-muted-foreground">
                      Pay securely using your connected Solana wallet. Funds are held in escrow until project
                      completion.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Badge className="mt-1">5</Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Order Confirmation</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive confirmation and the freelancer will be notified to start working on your project.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                Managing Orders
              </CardTitle>
              <CardDescription>Track progress and communicate with freelancers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Order Tracking:</h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Order Placed</span>
                        <Badge variant="secondary">Complete</Badge>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>In Progress</span>
                        <Badge variant="outline">Current</Badge>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Under Review</span>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completed</span>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-secondary">Communication Tools:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Direct Messaging</p>
                        <p className="text-xs text-muted-foreground">Chat directly with your freelancer</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">File Sharing</p>
                        <p className="text-xs text-muted-foreground">Share files and receive deliverables</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Milestone Updates</p>
                        <p className="text-xs text-muted-foreground">Get notified of project milestones</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Revision Requests</p>
                        <p className="text-xs text-muted-foreground">Request changes if needed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Order Management Dashboard</h4>
                <p className="text-sm text-muted-foreground">
                  Access your personalized dashboard to view all active orders, track progress, manage communications,
                  and handle payments. You&apos;ll receive real-time notifications for all order updates.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-3">Order Support Available</h3>
              <p className="text-primary-foreground/80 mb-4">
                Need help with placing an order or managing your services? Our order support team is here to assist you.
              </p>
              <Button variant="secondary">Contact Order Support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
