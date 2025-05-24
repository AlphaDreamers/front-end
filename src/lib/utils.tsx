import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TransactionType, TransactionStatus } from "./mock-data";
import { SocialLinkType } from "@prisma/client";
import { LucideProps } from "lucide-react";
import {
  Twitter,
  Github,
  Linkedin,
  Instagram,
  Globe,
  MessageSquare,
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSOL(amount: number): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getTransactionTypeLabel(type: TransactionType): string {
  switch (type) {
    case "deposit":
      return "Deposit";
    case "withdrawal":
      return "Withdrawal";
    case "payment":
      return "Payment";
    case "refund":
      return "Refund";
    case "fee":
      return "Fee";
    default:
      return type;
  }
}

export function getTransactionStatusLabel(status: TransactionStatus): string {
  switch (status) {
    case "completed":
      return "Completed";
    case "pending":
      return "Pending";
    case "failed":
      return "Failed";
    default:
      return status;
  }
}

export function getTransactionTypeIcon(type: TransactionType): string {
  switch (type) {
    case "deposit":
      return "arrow-down-circle";
    case "withdrawal":
      return "arrow-up-circle";
    case "payment":
      return "credit-card";
    case "refund":
      return "refresh-ccw";
    case "fee":
      return "dollar-sign";
    default:
      return "circle";
  }
}

export function getTransactionStatusColor(status: TransactionStatus): string {
  switch (status) {
    case "completed":
      return "text-green-500";
    case "pending":
      return "text-yellow-500";
    case "failed":
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
}

export function getTransactionAmountColor(amount: number): string {
  if (amount > 0) return "text-green-500";
  if (amount < 0) return "text-red-500";
  return "text-muted-foreground";
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function validateSolanaAddress(address: string): boolean {
  // This is a simplified validation - in a real app, use a proper Solana library
  return address.length === 44 && /^[A-Za-z0-9]+$/.test(address);
}

export const getIconBySocialType = (
  type: SocialLinkType,
  props: LucideProps = { size: 24 }
) => {
  switch (type) {
    case "X":
      return <Twitter {...props} />;
    case "GITHUB":
      return <Github {...props} />;
    case "LINKEDIN":
      return <Linkedin {...props} />;
    case "INSTAGRAM":
      return <Instagram {...props} />;
    case "WEBSITE":
      return <Globe {...props} />;
    case "EMAIL":
      return <MessageSquare {...props} />;
    case "TELEGRAM":
      return <Globe {...props} />;
    case "DISCORD":
      return <Globe {...props} />;
    case "WHATSAPP":
      return <Globe {...props} />;
    case "FACEBOOK":
      return <Globe {...props} />;
    default:
      return null;
  }
};
