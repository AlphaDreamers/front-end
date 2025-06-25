import { BorderedCard } from "@/components/help/bordered-card";
import { FeatureGrid } from "@/components/help/feature-grid";
import { InfoAlert } from "@/components/help/info-alert";
import { StepList } from "@/components/help/steps-list";
import { HelpPageTemplate } from "@/components/templates/help-page-template";
import { CreditCard, DollarSign, Shield } from "lucide-react";

export default function PaymentsTransactions() {
  const paymentFeatures = [
    {
      icon: Shield,
      bgColor: "bg-green-500",
      title: "Escrow Protected",
      description: "Funds held safely",
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
      title: "Fast Processing",
      description: "1-2 second confirmations",
    },
    {
      icon: DollarSign,
      bgColor: "bg-purple-500",
      title: "Low Fees",
      description: "Minimal transaction costs",
    },
    {
      icon: () => (
        <svg
          className="h-4 w-4 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: "bg-orange-500",
      title: "Transparent",
      description: "Blockchain verified",
    },
  ];

  const paymentSteps = [
    {
      title: "Connect Your Solana Wallet",
      description:
        "Ensure your Solana wallet is connected and has sufficient SOL or USDC for the payment and transaction fees.",
      badges: ["SOL", "USDC"],
    },
    {
      title: "Review Payment Details",
      description:
        "Check the service cost, platform fee, and total amount before confirming the transaction.",
    },
    {
      title: "Authorize Transaction",
      description:
        "Your wallet will prompt you to approve the transaction. Review the details and confirm.",
    },
    {
      title: "Funds Enter Escrow",
      description:
        "Payment is held in a smart contract escrow until the freelancer completes and delivers the work.",
    },
    {
      title: "Release Payment",
      description:
        "Once you approve the completed work, funds are automatically released to the freelancer.",
    },
  ];

  return (
    <HelpPageTemplate
      title="Payments and Transactions"
      description="Secure, fast, and transparent blockchain payments"
    >
      <BorderedCard
        color="red"
        icon={DollarSign}
        title="Understanding Our Payment System"
      >
        <p className="text-muted-foreground leading-relaxed mb-4">
          Our Solana-powered payment system ensures secure, fast, and
          cost-effective transactions. With blockchain technology, you get
          transparent payment processing, escrow protection, and near-instant
          settlements. All payments are processed in SOL or USDC, providing
          stability and global accessibility.
        </p>
        <FeatureGrid features={paymentFeatures} columns={4} />
      </BorderedCard>

      <BorderedCard
        color="blue"
        icon={CreditCard}
        title="Making Payments"
        description="Step-by-step guide to processing payments"
      >
        <InfoAlert icon={Shield} title="Security First">
          All payments are processed through smart contracts with escrow
          protection. Your funds are safe until project completion.
        </InfoAlert>
        <div className="mt-6">
          <StepList steps={paymentSteps} />
        </div>
      </BorderedCard>
    </HelpPageTemplate>
  );
}
