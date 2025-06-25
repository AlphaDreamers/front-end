import { BorderedCard } from "@/components/help/bordered-card";
import { ProgressTracker } from "@/components/help/progress-tracker";
import { SectionGrid } from "@/components/help/section-grid";
import { StepList } from "@/components/help/steps-list";
import { TipBox } from "@/components/help/tip-box";
import { HelpPageTemplate } from "@/components/templates/help-page-template";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, Search, ShoppingCart } from "lucide-react";

export default function OrdersServices() {
  const orderFlowDots = [
    { label: "Browse Services", color: "bg-blue-500" },
    { label: "Place Order", color: "bg-yellow-500" },
    { label: "Track Progress", color: "bg-green-500" },
  ];

  const searchMethods = [
    {
      title: "Search Methods:",
      color: "text-primary",
      items: [
        {
          title: "Category Browse",
          description:
            "Explore services by category (Design, Development, Writing, etc.)",
        },
        {
          title: "Keyword Search",
          description: "Use specific terms to find exactly what you need",
        },
        {
          title: "Filter Options",
          description: "Sort by price, delivery time, rating, and more",
        },
      ],
    },
    {
      title: "What to Look For:",
      color: "text-secondary",
      items: [
        {
          title: "Portfolio Quality",
          description: "Review previous work samples",
        },
        {
          title: "Client Reviews",
          description: "Read feedback from previous clients",
        },
        {
          title: "Response Time",
          description: "Check how quickly they respond to messages",
        },
      ],
    },
  ];

  const orderSteps = [
    {
      title: "Select Your Service Package",
      description:
        "Choose from Basic, Standard, or Premium packages based on your needs and budget.",
      badges: ["Basic", "Standard", "Premium"],
    },
    {
      title: "Customize Your Requirements",
      description:
        "Add specific details, upload reference files, and specify any special requirements for your project.",
    },
    {
      title: "Review Order Details",
      description:
        "Double-check the service description, delivery time, price, and any add-ons before proceeding.",
    },
    {
      title: "Secure Payment",
      description:
        "Pay securely using your connected Solana wallet. Funds are held in escrow until project completion.",
    },
    {
      title: "Order Confirmation",
      description:
        "Receive confirmation and the freelancer will be notified to start working on your project.",
    },
  ];

  const orderTracking = [
    {
      label: "Order Placed",
      status: "Pending" as const,
      progress: 100,
    },
    {
      label: "In Progress",
      status: "In Progress" as const,
      progress: 60,
    },
    {
      label: "Under Review",
      status: "Pending" as const,
      progress: 0,
    },
    {
      label: "Completed",
      status: "Pending" as const,
      progress: 0,
    },
  ];

  return (
    <HelpPageTemplate
      title="Orders and Services"
      description="Your complete guide to ordering and managing services"
    >
      <BorderedCard
        color="green"
        icon={ShoppingCart}
        title="Understanding Our Order System"
      >
        <p className="text-muted-foreground leading-relaxed mb-4">
          Our platform makes it easy to find, order, and manage freelance
          services. Whether you need graphic design, web development, content
          writing, or any other digital service, our streamlined process ensures
          a smooth experience from browsing to project completion.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm">
          {orderFlowDots.map((dot, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-3 h-3 ${dot.color} rounded-full`}></div>
              <span>{dot.label}</span>
            </div>
          ))}
        </div>
      </BorderedCard>

      <BorderedCard
        color="blue"
        icon={Search}
        title="Browsing Services"
        description="Find the perfect freelancer for your project"
      >
        <SectionGrid sections={searchMethods} />

        <TipBox title="Pro Tip: Service Comparison" icon={Eye} className="mt-6">
          <p className="text-sm text-muted-foreground">
            Use our comparison tool to evaluate multiple freelancers
            side-by-side. Compare pricing, delivery times, included features,
            and client ratings to make the best choice for your project.
          </p>
        </TipBox>
      </BorderedCard>

      <BorderedCard
        color="yellow"
        icon={ShoppingCart}
        title="Placing an Order"
        description="Step-by-step guide to ordering services"
      >
        <StepList steps={orderSteps} />
      </BorderedCard>

      <BorderedCard
        color="purple"
        icon={Clock}
        title="Managing Orders"
        description="Track progress and communicate with freelancers"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-primary">Order Tracking:</h4>
            <ProgressTracker items={orderTracking} />
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-secondary">
              Communication Tools:
            </h4>
            <div className="space-y-3">
              {[
                {
                  title: "Direct Messaging",
                  description: "Chat directly with your freelancer",
                },
                {
                  title: "File Sharing",
                  description: "Share files and receive deliverables",
                },
                {
                  title: "Milestone Updates",
                  description: "Get notified of project milestones",
                },
                {
                  title: "Revision Requests",
                  description: "Request changes if needed",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-1">
                    •
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <TipBox title="Order Management Dashboard" className="mt-6">
          <p className="text-sm text-muted-foreground">
            Access your personalized dashboard to view all active orders, track
            progress, manage communications, and handle payments. You&apos;ll
            receive real-time notifications for all order updates.
          </p>
        </TipBox>
      </BorderedCard>
    </HelpPageTemplate>
  );
}
