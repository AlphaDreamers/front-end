import { Star, Bug, HelpCircle, MessageSquare, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import AuthCard from "@/components/templates/auth-card";
import { auth } from "@/lib/auth";

const MESSAGE_TYPE_CONFIG = {
  TESTIMONIAL: {
    href: "/contact-us/testimonial",
    icon: Star,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    description: "Share your positive experience with other users",
    label: "Share Your Experience",
    requiresAuth: false,
  },
  BUG_REPORT: {
    href: "/contact-us/bug-report",
    icon: Bug,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    description: "Report bugs with detailed reproduction steps",
    label: "Report a Bug",
    requiresAuth: false,
  },
  SUPPORT_REQUEST: {
    href: "/contact-us/support",
    icon: HelpCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    description: "Get technical help or account assistance",
    label: "Get Support",
    requiresAuth: false,
  },
  FEEDBACK: {
    href: "/contact-us/feedback",
    icon: MessageSquare,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    description: "Help us improve the platform with your suggestions",
    label: "Give Feedback",
    requiresAuth: false,
  },
  CERTIFICATE_REQUEST: {
    href: "/contact-us/certificate",
    icon: Award,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    description: "Request a certificate for your completed courses",
    label: "Request Certificate",
    requiresAuth: true,
  },
};

export default async function ContactPage() {
  const session = await auth();

  return (
    <AuthCard
      title="Contact Us"
      description="We're here to help! Whether you have questions, feedback, or need support, our team is ready to assist you with your BlueFrog marketplace experience."
    >
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(MESSAGE_TYPE_CONFIG).map(([type, config]) => {
          const Icon = config.icon;
          if (config.requiresAuth && !session) {
            return null;
          }
          return (
            <Link
              key={type}
              href={config.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "p-2 h-28 w-full border flex flex-col items-center justify-center gap-1",
                config.borderColor,
                config.bgColor
              )}
            >
              <Icon className={cn("size-6", config.color)} />
              <h3 className="font-semibold">{config.label}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap text-center">
                {config.description}
              </p>
            </Link>
          );
        })}
      </div>
    </AuthCard>
  );
}
