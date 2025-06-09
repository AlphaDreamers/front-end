import Link from "next/link"
import { ArrowLeft, MessageSquare, Star, Shield, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ReviewsRatings() {
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
            <div className="w-12 h-12 rounded-lg bg-yellow-500 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Reviews and Ratings</h1>
              <p className="text-muted-foreground">Build trust and reputation in our community</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                The Power of Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Reviews and ratings are the backbone of trust in our marketplace. They help clients make informed
                decisions and enable freelancers to build their reputation. Our blockchain-verified review system
                ensures authenticity and prevents fake reviews, creating a transparent and trustworthy environment for
                everyone.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <h4 className="font-semibold text-sm">Quality Assurance</h4>
                  <p className="text-xs text-muted-foreground">Maintain high standards</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-sm">Verified Reviews</h4>
                  <p className="text-xs text-muted-foreground">Blockchain authenticated</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <ThumbsUp className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-sm">Build Trust</h4>
                  <p className="text-xs text-muted-foreground">Establish credibility</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                Leaving a Review
              </CardTitle>
              <CardDescription>How to write helpful and constructive reviews</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Star className="h-4 w-4" />
                <AlertDescription>
                  <strong>Remember:</strong> You can only leave a review after completing a transaction. Reviews are
                  permanent and cannot be deleted, so please be thoughtful and fair.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Badge className="mt-1">1</Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Navigate to Your Order</h4>
                    <p className="text-sm text-muted-foreground">
                      Go to your order history and find the completed project you want to review.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Badge className="mt-1">2</Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Rate Your Experience</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select a star rating from 1-5 stars based on your overall satisfaction.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex">
                        <Star className="h-4 w-4 fill-red-400 text-red-400" />
                      </div>
                      <span>1 Star - Poor</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex">
                        <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                        <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                      </div>
                      <span>2 Stars - Below Average</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <span>3 Stars - Average</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex">
                        <Star className="h-4 w-4 fill-green-400 text-green-400" />
                        <Star className="h-4 w-4 fill-green-400 text-green-400" />
                        <Star className="h-4 w-4 fill-green-400 text-green-400" />
                        <Star className="h-4 w-4 fill-green-400 text-green-400" />
                      </div>
                      <span>4 Stars - Good</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="flex">
                        <Star className="h-4 w-4 fill-green-500 text-green-500" />
                        <Star className="h-4 w-4 fill-green-500 text-green-500" />
                        <Star className="h-4 w-4 fill-green-500 text-green-500" />
                        <Star className="h-4 w-4 fill-green-500 text-green-500" />
                        <Star className="h-4 w-4 fill-green-500 text-green-500" />
                      </div>
                      <span>5 Stars - Excellent</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Badge className="mt-1">3</Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Write Your Review</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Provide detailed feedback about your experience. Be specific and constructive.
                    </p>
                    <div className="bg-muted/50 p-3 rounded text-sm">
                      <p className="font-medium mb-2">What to include:</p>
                      <div className="space-y-1 text-muted-foreground">
                        <p>• Quality of work delivered</p>
                        <p>• Communication and responsiveness</p>
                        <p>• Adherence to deadlines</p>
                        <p>• Professionalism and attitude</p>
                        <p>• Value for money</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <Badge className="mt-1">4</Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Submit and Verify</h4>
                    <p className="text-sm text-muted-foreground">
                      Review your rating and comments, then submit. The review will be verified on the Solana blockchain
                      for authenticity.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Review Verification Process
              </CardTitle>
              <CardDescription>How our Solana-based verification works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  Blockchain Verification
                </h4>
                <p className="text-sm text-muted-foreground">
                  Every review is recorded on the Solana blockchain, creating an immutable record that prevents fake
                  reviews and ensures transparency. This process happens automatically when you submit your review.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Verification Steps:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        1
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Transaction Validation</p>
                        <p className="text-xs text-muted-foreground">Confirms you completed a real transaction</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        2
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Blockchain Recording</p>
                        <p className="text-xs text-muted-foreground">Review data is stored on Solana</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        3
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Verification Badge</p>
                        <p className="text-xs text-muted-foreground">Verified reviews get a special badge</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-secondary">Benefits:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Prevents Fake Reviews</p>
                        <p className="text-xs text-muted-foreground">Only real clients can leave reviews</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Immutable Records</p>
                        <p className="text-xs text-muted-foreground">Reviews cannot be altered or deleted</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Transparent System</p>
                        <p className="text-xs text-muted-foreground">All reviews are publicly verifiable</p>
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
                <ThumbsUp className="h-5 w-5 text-purple-500" />
                Responding to Reviews
              </CardTitle>
              <CardDescription>Best practices for freelancers and clients</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">For Freelancers:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Thank Positive Reviews</p>
                        <p className="text-xs text-muted-foreground">Show appreciation for good feedback</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Address Concerns Professionally</p>
                        <p className="text-xs text-muted-foreground">Respond to negative reviews constructively</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Learn and Improve</p>
                        <p className="text-xs text-muted-foreground">Use feedback to enhance your services</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Stay Professional</p>
                        <p className="text-xs text-muted-foreground">Maintain a courteous tone in all responses</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-secondary">For Clients:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Be Fair and Honest</p>
                        <p className="text-xs text-muted-foreground">
                          Provide balanced feedback based on actual experience
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Be Specific</p>
                        <p className="text-xs text-muted-foreground">Mention specific aspects of the work</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Consider the Freelancer&apos;s Effort</p>
                        <p className="text-xs text-muted-foreground">
                          Acknowledge good communication and professionalism
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Update Reviews if Needed</p>
                        <p className="text-xs text-muted-foreground">Contact support if issues are resolved later</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Review Response Guidelines</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  When responding to reviews, keep these principles in mind:
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-green-600 mb-1">✓ Do:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Thank clients for their feedback</li>
                      <li>• Address specific concerns mentioned</li>
                      <li>• Offer solutions or improvements</li>
                      <li>• Maintain a professional tone</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-red-600 mb-1">✗ Don&apos;t:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Argue or become defensive</li>
                      <li>• Share private information</li>
                      <li>• Make personal attacks</li>
                      <li>• Ignore negative feedback</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-3">Review System Support</h3>
              <p className="text-primary-foreground/80 mb-4">
                Have questions about our review system or need help with a review dispute? Our review moderation team is
                here to help.
              </p>
              <Button variant="secondary">Contact Review Support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
