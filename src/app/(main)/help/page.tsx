import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CreditCard,
  FileText,
  Gavel,
  MessageSquare,
  Settings,
  Wallet,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageTemplate from "@/components/templates/page-template";
import { ContactSupportCard } from "@/components/contact/contact-support-card";
import { cn } from "@/lib/utils";

const helpPages = [
  {
    title: "Getting Started",
    description: "Learn the basics of joining and using our platform",
    icon: BookOpen,
    href: "/help/getting-started",
    color: "bg-blue-500",
  },
  {
    title: "Solana Wallet Integration",
    description: "Connect and manage your Solana wallet securely",
    icon: Wallet,
    href: "/help/wallet-integration",
    color: "bg-purple-500",
  },
  {
    title: "Orders and Services",
    description: "Browse services, place orders, and track progress",
    icon: FileText,
    href: "/help/orders-services",
    color: "bg-green-500",
  },
  {
    title: "Reviews and Ratings",
    description: "Leave reviews and build your reputation",
    icon: MessageSquare,
    href: "/help/reviews-ratings",
    color: "bg-yellow-500",
  },
  {
    title: "Payments and Transactions",
    description: "Understand payments, fees, and transaction processes",
    icon: CreditCard,
    href: "/help/payments-transactions",
    color: "bg-red-500",
  },
  {
    title: "Account Management",
    description: "Manage your profile, settings, and security",
    icon: Settings,
    href: "/help/account-management",
    color: "bg-indigo-500",
  },
  {
    title: "Dispute Resolution",
    description: "Resolve conflicts and handle disputes effectively",
    icon: Gavel,
    href: "/help/dispute-resolution",
    color: "bg-orange-500",
  },
];

export default function HelpCenter() {
  return (
    <PageTemplate
      title="Help Center"
      description="Find answers to your questions and learn how to make the most of our Solana-powered freelancing platform"
      className="flex flex-col gap-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {helpPages.map((page) => {
          const Icon = page.icon;
          return (
            <Card key={page.href} className="py-4">
              <CardHeader className="px-4">
                <Icon
                  className={`${page.color} size-10 p-1.5 rounded-lg mb-2`}
                />
                <CardTitle className="text-lg">{page.title}</CardTitle>
                <CardDescription>{page.description}</CardDescription>
              </CardHeader>
              <CardFooter className="px-4 mt-auto">
                <Link
                  href={page.href}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      className: "w-full",
                      size: "sm",
                    })
                  )}
                >
                  Learn More
                  <ArrowRight />
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <ContactSupportCard />
    </PageTemplate>
  );
}
