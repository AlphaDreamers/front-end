import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CreditCard,
  FileText,
  Gavel,
  MessageSquare,
  Settings,
  Shield,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  {
    title: "Platform Policies",
    description: "Review our terms, privacy policy, and guidelines",
    icon: Shield,
    href: "/help/platform-policies",
    color: "bg-teal-500",
  },
];

export default function HelpCenter() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Help Center</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to your questions and learn how to make the most of our
          Solana-powered freelancing platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {helpPages.map((page) => {
          const Icon = page.icon;
          return (
            <Card
              key={page.href}
              className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <CardHeader className="pb-4">
                <div
                  className={`w-12 h-12 rounded-lg ${page.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{page.title}</CardTitle>
                <CardDescription>{page.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={page.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help
            you with any questions or issues you might have.
          </p>
          <Button variant="secondary" size="lg">
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
