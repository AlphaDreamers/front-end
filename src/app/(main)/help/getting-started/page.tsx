import { BorderedCard } from "@/components/help/bordered-card";
import { StepList } from "@/components/help/steps-list";
import { TipBox } from "@/components/help/tip-box";
import { HelpPageTemplate } from "@/components/templates/help-page-template";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Search, UserPlus } from "lucide-react";

export default function GettingStarted() {
  const SolanaIcon = () => (
    <svg
      className="h-5 w-5 text-purple-500"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" />
    </svg>
  );

  const signupSteps = [
    {
      title: "Visit the Registration Page",
      description: 'Click "Sign Up" in the top navigation bar',
    },
    {
      title: "Choose Your Account Type",
      description: 'Select either "Freelancer" or "Client" based on your needs',
    },
    {
      title: "Fill in Your Details",
      description:
        "Provide your email, create a strong password, and add basic information",
    },
    {
      title: "Verify Your Email",
      description: "Check your inbox and click the verification link",
    },
    {
      title: "Complete Your Profile",
      description:
        "Add a profile picture, bio, and showcase your skills or requirements",
    },
  ];

  const walletSteps = [
    {
      title: "Install a Solana Wallet",
      description: "We recommend Phantom, Solflare, or Sollet",
    },
    {
      title: 'Click "Connect Wallet" in Your Profile',
      description: "Navigate to your account settings",
    },
    {
      title: "Authorize the Connection",
      description: "Approve the connection request in your wallet",
    },
    {
      title: "Verify the Connection",
      description: "You'll see a green checkmark when successfully connected",
    },
  ];

  const platformFeatures = {
    clients: [
      "Browse freelancer profiles and portfolios",
      "Post project requirements",
      "Review proposals and hire talent",
      "Track project progress",
    ],
    freelancers: [
      "Create an impressive profile",
      "Search and apply for projects",
      "Submit proposals and negotiate terms",
      "Deliver work and get paid",
    ],
  };

  return (
    <HelpPageTemplate
      title="Getting Started"
      description="Your journey begins here"
    >
      <BorderedCard
        color="primary"
        icon={CheckCircle}
        title="Welcome to Our Platform!"
      >
        <p className="text-muted-foreground leading-relaxed">
          Welcome to the future of freelancing! Our Solana-powered platform
          connects talented freelancers with clients worldwide, offering secure,
          fast, and transparent transactions. Whether you&apos;re here to offer
          your services or find the perfect freelancer for your project,
          we&apos;ve got you covered.
        </p>
      </BorderedCard>

      <BorderedCard
        color="green"
        icon={UserPlus}
        title="Signing Up"
        description="Follow these simple steps to create your account"
      >
        <StepList steps={signupSteps} />
      </BorderedCard>

      <BorderedCard
        color="purple"
        icon={SolanaIcon}
        title="Connecting Your Solana Wallet"
        description="Secure your account with blockchain technology"
      >
        <TipBox title="">
          <p className="text-sm text-muted-foreground mb-3">
            <strong>Why connect a wallet?</strong> Your Solana wallet ensures
            secure, transparent transactions and gives you full control over
            your funds.
          </p>
        </TipBox>

        <div className="grid gap-4 mt-4">
          {walletSteps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-1">
                •
              </Badge>
              <div>
                <h4 className="font-semibold">{step.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </BorderedCard>

      <BorderedCard
        color="orange"
        icon={Search}
        title="Exploring the Platform"
        description="Get familiar with our key features and navigation"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-primary">For Clients:</h4>
            <div className="space-y-2 text-sm">
              {platformFeatures.clients.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    •
                  </Badge>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-secondary">For Freelancers:</h4>
            <div className="space-y-2 text-sm">
              {platformFeatures.freelancers.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    •
                  </Badge>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BorderedCard>
    </HelpPageTemplate>
  );
}
