import { BorderedCard } from "@/components/help/bordered-card";
import { FeatureGrid } from "@/components/help/feature-grid";
import { InfoAlert } from "@/components/help/info-alert";
import { StepList } from "@/components/help/steps-list";
import { HelpPageTemplate } from "@/components/templates/help-page-template";
import { AlertTriangle, CheckCircle, Shield, Wallet } from "lucide-react";

export default function WalletIntegration() {
  const walletFeatures = [
    {
      icon: CheckCircle,
      bgColor: "bg-green-500",
      title: "Secure",
      description: "Blockchain security",
    },
    {
      icon: () => (
        <svg
          className="h-4 w-4 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
      ),
      bgColor: "bg-blue-500",
      title: "Fast",
      description: "Near-instant transfers",
    },
    {
      icon: () => (
        <svg
          className="h-4 w-4 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM14 6a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h6zM4 11a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zM7 10a1 1 0 100 2h1a1 1 0 100-2H7z" />
        </svg>
      ),
      bgColor: "bg-purple-500",
      title: "Low Fees",
      description: "Minimal costs",
    },
  ];

  const connectionSteps = [
    {
      title: "Install a Solana Wallet",
      description:
        "Download and install one of the supported wallet extensions:",
      badges: ["Phantom", "Solflare", "Sollet", "Slope"],
    },
    {
      title: "Navigate to Account Settings",
      description:
        'Go to your profile page and click on "Account Settings" → "Wallet Integration"',
    },
    {
      title: 'Click "Connect Wallet"',
      description:
        'Select your preferred wallet from the list and click "Connect"',
    },
    {
      title: "Authorize Connection",
      description:
        'Your wallet will open a popup asking for permission. Click "Connect" or "Approve"',
    },
    {
      title: "Verify Connection",
      description:
        "You'll see a green checkmark and your wallet address displayed in your account settings",
    },
  ];

  return (
    <HelpPageTemplate
      title="Solana Wallet Integration"
      description="Secure blockchain-powered transactions"
    >
      <BorderedCard
        color="purple"
        icon={Shield}
        title="Why Solana Wallet Integration Matters"
      >
        <p className="text-muted-foreground leading-relaxed mb-4">
          Integrating your Solana wallet is crucial for secure, transparent, and
          fast transactions on our platform. With blockchain technology, you
          maintain full control over your funds while enjoying near-instant
          payments and minimal transaction fees.
        </p>
        <FeatureGrid features={walletFeatures} columns={3} />
      </BorderedCard>

      <BorderedCard
        color="blue"
        icon={Wallet}
        title="Connecting Your Wallet"
        description="Step-by-step guide to connect your Solana wallet"
      >
        <InfoAlert icon={AlertTriangle} title="Important">
          Make sure you have a Solana wallet installed before proceeding. We
          recommend Phantom, Solflare, or Sollet.
        </InfoAlert>
        <div className="mt-6">
          <StepList steps={connectionSteps} />
        </div>
      </BorderedCard>
    </HelpPageTemplate>
  );
}
