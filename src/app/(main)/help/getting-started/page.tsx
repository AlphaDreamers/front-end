import Link from "next/link";
import { ArrowLeft, CheckCircle, Home, Search, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function GettingStarted() {
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
          <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
            <Home className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Getting Started</h1>
            <p className="text-muted-foreground">Your journey begins here</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Welcome to Our Platform!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to the future of freelancing! Our Solana-powered platform
              connects talented freelancers with clients worldwide, offering
              secure, fast, and transparent transactions. Whether you&apos;re
              here to offer your services or find the perfect freelancer for
              your project, we&apos;ve got you covered.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-green-500" />
              Signing Up
            </CardTitle>
            <CardDescription>
              Follow these simple steps to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  1
                </Badge>
                <div>
                  <h4 className="font-semibold">Visit the Registration Page</h4>
                  <p className="text-sm text-muted-foreground">
                    Click &quot;Sign Up&quot; in the top navigation bar
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  2
                </Badge>
                <div>
                  <h4 className="font-semibold">Choose Your Account Type</h4>
                  <p className="text-sm text-muted-foreground">
                    Select either &quot;Freelancer&quot; or &quot;Client&quot;
                    based on your needs
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  3
                </Badge>
                <div>
                  <h4 className="font-semibold">Fill in Your Details</h4>
                  <p className="text-sm text-muted-foreground">
                    Provide your email, create a strong password, and add basic
                    information
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  4
                </Badge>
                <div>
                  <h4 className="font-semibold">Verify Your Email</h4>
                  <p className="text-sm text-muted-foreground">
                    Check your inbox and click the verification link
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  5
                </Badge>
                <div>
                  <h4 className="font-semibold">Complete Your Profile</h4>
                  <p className="text-sm text-muted-foreground">
                    Add a profile picture, bio, and showcase your skills or
                    requirements
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-purple-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
              </svg>
              Connecting Your Solana Wallet
            </CardTitle>
            <CardDescription>
              Secure your account with blockchain technology
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">
                <strong>Why connect a wallet?</strong> Your Solana wallet
                ensures secure, transparent transactions and gives you full
                control over your funds.
              </p>
            </div>
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-1">
                  •
                </Badge>
                <div>
                  <h4 className="font-semibold">Install a Solana Wallet</h4>
                  <p className="text-sm text-muted-foreground">
                    We recommend Phantom, Solflare, or Sollet
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-1">
                  •
                </Badge>
                <div>
                  <h4 className="font-semibold">
                    Click &quot;Connect Wallet&quot; in Your Profile
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Navigate to your account settings
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-1">
                  •
                </Badge>
                <div>
                  <h4 className="font-semibold">Authorize the Connection</h4>
                  <p className="text-sm text-muted-foreground">
                    Approve the connection request in your wallet
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-1">
                  •
                </Badge>
                <div>
                  <h4 className="font-semibold">Verify the Connection</h4>
                  <p className="text-sm text-muted-foreground">
                    You&apos;ll see a green checkmark when successfully
                    connected
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-orange-500" />
              Exploring the Platform
            </CardTitle>
            <CardDescription>
              Get familiar with our key features and navigation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary">For Clients:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      •
                    </Badge>
                    <span>Browse freelancer profiles and portfolios</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      •
                    </Badge>
                    <span>Post project requirements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      •
                    </Badge>
                    <span>Review proposals and hire talent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      •
                    </Badge>
                    <span>Track project progress</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-secondary">
                  For Freelancers:
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      •
                    </Badge>
                    <span>Create an impressive profile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      •
                    </Badge>
                    <span>Search and apply for projects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      •
                    </Badge>
                    <span>Submit proposals and negotiate terms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      •
                    </Badge>
                    <span>Deliver work and get paid</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-3">Need Additional Support?</h3>
            <p className="text-primary-foreground/80 mb-4">
              Our support team is available 24/7 to help you get started and
              answer any questions.
            </p>
            <Button variant="secondary">Contact Support Team</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
