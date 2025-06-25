import { BorderedCard } from "@/components/help/bordered-card";
import { FeatureGrid } from "@/components/help/feature-grid";
import { InfoAlert } from "@/components/help/info-alert";
import { StepList } from "@/components/help/steps-list";
import { HelpPageTemplate } from "@/components/templates/help-page-template";
import { CheckCircle, FileText, Gavel, MessageCircle } from "lucide-react";

export default function DisputeResolution() {
  const disputeFeatures = [
    {
      icon: FileText,
      bgColor: "bg-blue-500",
      title: "Documentation",
      description: "Clear evidence",
    },
    {
      icon: MessageCircle,
      bgColor: "bg-green-500",
      title: "Mediation",
      description: "Professional support",
    },
    {
      icon: Gavel,
      bgColor: "bg-purple-500",
      title: "Fair Process",
      description: "Impartial resolution",
    },
    {
      icon: CheckCircle,
      bgColor: "bg-red-500",
      title: "Quick Resolution",
      description: "Timely decisions",
    },
  ];

  const filingSteps = [
    {
      title: "Attempt Direct Resolution",
      description:
        "Contact the other party through our platform messaging system to discuss the issue and attempt resolution.",
      items: [
        "Clearly explain the problem",
        "Provide specific examples",
        "Suggest reasonable solutions",
        "Allow 48-72 hours for response",
      ],
    },
    {
      title: "Gather Documentation",
      description:
        "Collect all relevant evidence to support your case before filing the dispute.",
      items: [
        "Screenshots of conversations",
        "Original project requirements",
        "Delivered work samples",
        "Payment records and receipts",
      ],
    },
    {
      title: "File the Dispute",
      description:
        'Navigate to your order page and click "File Dispute" to begin the formal process.',
      items: [
        "Select dispute category",
        "Provide detailed description",
        "Upload supporting evidence",
        "Submit dispute form",
      ],
    },
  ];

  return (
    <HelpPageTemplate
      title="Dispute Resolution"
      description="Fair and transparent conflict resolution"
    >
      <BorderedCard color="orange" icon={Gavel} title="Understanding Disputes">
        <p className="text-muted-foreground leading-relaxed mb-4">
          Disputes are rare, but when they occur, our fair and transparent
          resolution process ensures both parties are heard. Our
          blockchain-based system maintains an immutable record of all
          communications and transactions, providing clear evidence for
          resolution. We aim to resolve disputes quickly while maintaining
          fairness for all parties.
        </p>
        <FeatureGrid features={disputeFeatures} columns={4} />
      </BorderedCard>

      <BorderedCard
        color="blue"
        icon={FileText}
        title="Filing a Dispute"
        description="Step-by-step guide to initiating dispute resolution"
      >
        <InfoAlert icon={Gavel} title="Before Filing">
          Try to resolve the issue directly with the other party through our
          messaging system. Many disputes can be resolved through clear
          communication.
        </InfoAlert>
        <div className="mt-6">
          <StepList steps={filingSteps} />
        </div>
      </BorderedCard>
    </HelpPageTemplate>
  );
}
