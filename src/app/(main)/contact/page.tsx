import {
  Star,
  AlertTriangle,
  HelpCircle,
  MessageSquare,
  Mail,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

import Link from "next/link";
import AuthCard from "@/components/templates/auth-card";

const MESSAGE_TYPE_CONFIG = {
  TESTIMONIAL: {
    href: "/contact/testimonial",
    icon: Star,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    description: "Share your positive experience with other users",
    label: "Share Your Experience",
  },
  COMPLAINT: {
    href: "/contact/complaint",
    icon: AlertTriangle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    description: "Report an issue with an order or service",
    label: "Report an Issue",
  },
  SUPPORT: {
    href: "/contact/support",
    icon: HelpCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    description: "Get technical help or account assistance",
    label: "Get Support",
  },
  FEEDBACK: {
    href: "/contact/feedback",
    icon: MessageSquare,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    description: "Help us improve the platform with your suggestions",
    label: "Improve Our Platform",
  },
  GENERAL_INQUIRY: {
    href: "/contact/general",
    icon: Mail,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    description: "Ask questions or get general information",
    label: "General Question",
  },
} as const;

export default async function ContactPage() {
  return (
    <AuthCard
      title="Contact Us"
      description="We're here to help! Whether you have questions, feedback, or need support, our team is ready to assist you with your BlueFrog marketplace experience."
    >
      <div className="flex flex-col gap-2">
        {Object.entries(MESSAGE_TYPE_CONFIG).map(([type, config]) => {
          const Icon = config.icon;

          return (
            <Link
              key={type}
              href={config.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "h-fit py-4 w-full border-2 flex flex-col items-center justify-center gap-1",
                config.borderColor,
                config.bgColor
              )}
            >
              <Icon className={cn("size-6", config.color)} />
              <h3 className="font-semibold">{config.label}</h3>
              <p className="text-sm text-muted-foreground">
                {config.description}
              </p>
            </Link>
          );
        })}
      </div>
    </AuthCard>
  );
}
