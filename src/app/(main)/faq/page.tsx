"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Search, HelpCircle } from "lucide-react";

import { Input } from "@/components/ui/input";

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory | "all">(
    "all"
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        setIsLoading(true);
        const data = await fetchFaqs();
        setFaqs(data);
        setFilteredFaqs(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
        setIsLoading(false);
      }
    };

    loadFaqs();
  }, []);

  useEffect(() => {
    let result = faqs;

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((faq) => faq.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      );
    }

    setFilteredFaqs(result);
  }, [searchQuery, selectedCategory, faqs]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (category: FaqCategory | "all") => {
    setSelectedCategory(category);
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about BlueFrog Solana Freelance
            Marketplace
          </p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Search for answers..."
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-violet-500"
            value={searchQuery}
            onChange={handleSearch}
            aria-label="Search FAQs"
          />
        </div>

        <FaqCategories
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <div className="mt-8">
          <FaqList faqs={filteredFaqs} isLoading={isLoading} />
        </div>

        <div className="mt-16 bg-gray-800 rounded-lg p-8 text-center">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 text-violet-400" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Can&apos;t find your answer?
          </h2>
          <p className="text-gray-400 mb-6">
            Our support team is here to help you with any questions you might
            have.
          </p>
          <Link href="/contact-us">
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Info, ShoppingBag, Star, CreditCard, Wallet } from "lucide-react";

interface FaqCategoriesProps {
  selectedCategory: FaqCategory | "all";
  onCategoryChange: (category: FaqCategory | "all") => void;
}

const categories = [
  { id: "all", label: "All", icon: Info },
  { id: "general", label: "General", icon: Info },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "solana", label: "Solana", icon: Wallet },
];

export function FaqCategories({
  selectedCategory,
  onCategoryChange,
}: FaqCategoriesProps) {
  return (
    <div
      className="flex flex-wrap gap-2 justify-center"
      role="tablist"
      aria-label="FAQ Categories"
    >
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            className={`
              transition-all duration-200 
              ${
                selectedCategory === category.id
                  ? "bg-violet-600 hover:bg-violet-700 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-700"
              }
            `}
            onClick={() => onCategoryChange(category.id as FaqCategory | "all")}
            role="tab"
            aria-selected={selectedCategory === category.id}
            aria-controls={`${category.id}-panel`}
          >
            <Icon className="h-4 w-4 mr-2" />
            {category.label}
          </Button>
        );
      })}
    </div>
  );
}

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

interface FaqListProps {
  faqs: FAQ[];
  isLoading: boolean;
}

export function FaqList({ faqs, isLoading }: FaqListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-4">
            <Skeleton className="h-6 w-3/4 bg-gray-700" />
            <Skeleton className="h-20 w-full mt-4 bg-gray-700" />
          </div>
        ))}
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-800 rounded-lg">
        <h3 className="text-xl font-medium text-white mb-2">
          No results found
        </h3>
        <p className="text-gray-400">
          Try adjusting your search or category filter
        </p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {faqs.map((faq) => (
        <AccordionItem
          key={faq.id}
          value={faq.id.toString()}
          className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 text-white hover:bg-gray-750 hover:no-underline">
            <span className="text-left">{faq.question}</span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4 pt-2 text-gray-300">
            <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-a:text-violet-400">
              <p>{faq.answer}</p>
              {faq.learnMoreLink && (
                <div className="mt-4">
                  <Link
                    href={faq.learnMoreLink}
                    className="inline-flex items-center text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Learn more
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

// Simulated API call to fetch FAQs
export async function fetchFaqs(): Promise<FAQ[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("Fetching FAQs from API...");

  // Mock data
  const faqs: FAQ[] = [
    {
      id: 1,
      question: "What is BlueFrog Solana Freelance Marketplace?",
      answer:
        "BlueFrog is a decentralized freelance marketplace built on the Solana blockchain. It connects talented freelancers with clients worldwide, offering secure, fast, and low-cost transactions through Solana's blockchain technology.",
      category: "general",
      learnMoreLink: "/help/getting-started",
    },
    {
      id: 2,
      question: "How do I create an account?",
      answer:
        "To create an account, click the 'Sign Up' button in the top right corner of the homepage. You'll need to provide your email address, create a password, and verify your email. For full platform functionality, you'll also need to connect a Solana wallet.",
      category: "general",
      learnMoreLink: "/help/getting-started",
    },
    {
      id: 3,
      question: "Is BlueFrog free to use?",
      answer:
        "Creating an account on BlueFrog is free. We charge a 5% fee on completed projects for clients and a 10% fee for freelancers. Blockchain transaction fees (Solana gas fees) also apply but are typically less than $0.01 per transaction.",
      category: "general",
    },
    {
      id: 4,
      question: "How do I find freelancers for my project?",
      answer:
        "You can browse freelancers by category, search for specific skills, or post a project and receive proposals. Our advanced filtering system allows you to narrow results by rating, price range, experience level, and more.",
      category: "orders",
      learnMoreLink: "/help/orders-services",
    },
    {
      id: 5,
      question: "How do I place an order?",
      answer:
        "To place an order, either select a freelancer's service package or accept a proposal on your posted project. Review the details, add any specific requirements, and proceed to payment using your connected Solana wallet.",
      category: "orders",
      learnMoreLink: "/help/orders-services",
    },
    {
      id: 6,
      question: "Can I request revisions to completed work?",
      answer:
        "Yes, most service packages include a specific number of revision requests. You can request revisions through the order page by clicking 'Request Revision' and providing detailed feedback on what changes you need.",
      category: "orders",
    },
    {
      id: 7,
      question: "How does the review system work?",
      answer:
        "After order completion, both clients and freelancers can leave reviews. Reviews include a 1-5 star rating and written feedback. All reviews are verified on the Solana blockchain for authenticity and cannot be altered or removed.",
      category: "reviews",
      learnMoreLink: "/help/reviews-ratings",
    },
    {
      id: 8,
      question: "Can I respond to reviews I receive?",
      answer:
        "Yes, you can respond to reviews left on your profile. This allows you to thank clients for positive feedback or address concerns mentioned in less favorable reviews. Professional and constructive responses help build your reputation.",
      category: "reviews",
    },
    {
      id: 9,
      question: "How are payments processed?",
      answer:
        "All payments are processed through the Solana blockchain. When you place an order, funds are held in a smart contract escrow until the project is completed and approved. This ensures security for both parties.",
      category: "payments",
      learnMoreLink: "/help/payments-transactions",
    },
    {
      id: 10,
      question: "What payment methods are accepted?",
      answer:
        "We accept payments in SOL (Solana's native token) and USDC on the Solana network. You'll need a Solana wallet (like Phantom, Solflare, or Sollet) with sufficient funds to make payments.",
      category: "payments",
    },
    {
      id: 11,
      question: "How long do payments take to process?",
      answer:
        "Payments on the Solana blockchain are typically confirmed within 1-2 seconds. Once a client approves the completed work, funds are released from escrow and transferred to the freelancer's wallet almost instantly.",
      category: "payments",
    },
    {
      id: 12,
      question: "What is Solana?",
      answer:
        "Solana is a high-performance blockchain platform that enables fast, secure, and low-cost transactions. It can process thousands of transactions per second with sub-second confirmation times and minimal fees, making it ideal for a freelance marketplace.",
      category: "solana",
      learnMoreLink: "/help/wallet-integration",
    },
    {
      id: 13,
      question: "How do I connect my Solana wallet?",
      answer:
        "To connect your Solana wallet, click on 'Connect Wallet' in the top navigation bar. Select your wallet provider (Phantom, Solflare, etc.), and approve the connection request in your wallet extension. Your wallet address will then be linked to your BlueFrog account.",
      category: "solana",
      learnMoreLink: "/help/wallet-integration",
    },
    {
      id: 14,
      question: "Is my data secure on the blockchain?",
      answer:
        "Yes, blockchain technology provides enhanced security through cryptographic methods. Transaction data is immutable and transparent, but personal information is not stored on-chain. We follow industry best practices for data protection and comply with relevant privacy regulations.",
      category: "solana",
    },
    {
      id: 15,
      question: "What if I have issues with my Solana wallet?",
      answer:
        "If you're experiencing wallet connection issues, try refreshing the page, ensuring your wallet extension is up to date, or using a different supported wallet. For persistent problems, contact our support team or consult your wallet provider's help resources.",
      category: "solana",
    },
  ];

  console.log(`Successfully fetched ${faqs.length} FAQs`);
  return faqs;
}

export type FaqCategory =
  | "general"
  | "orders"
  | "reviews"
  | "payments"
  | "solana";

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: FaqCategory;
  learnMoreLink?: string;
}
