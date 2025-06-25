import { Color } from "@/lib/types";
import {
  Home,
  Search,
  Briefcase,
  Package,
  Star,
  Wallet,
  Shield,
  Settings,
  HelpCircle,
  Bell,
  User,
  Bookmark,
  Mail,
  FileText,
  ShieldCheck,
  LucideIcon,
  AlertCircle,
} from "lucide-react";

// Simplified navigation item interface
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  color?: Color;
  children?: NavItem[];
}

// Public navigation items (always visible)
export const publicNavItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    description: "Browse featured gigs and categories",
  },
  {
    label: "Browse Gigs",
    href: "/gigs",
    icon: Search,
    description: "Explore all available services",
  },
  {
    label: "Contact Us",
    href: "/contact-us",
    icon: Mail,
    description: "Get in touch with us",
  },
  {
    label: "FAQ",
    href: "/faq",
    icon: AlertCircle,
    description: "Frequently asked questions",
  },
];

export const authenticatedNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Briefcase,
    description: "Manage your business",
    children: [
      {
        label: "Overview",
        href: "/dashboard",
        icon: Home,
        description:
          "Get a snapshot of your account activity, earnings, and recent updates at a glance.",
        color: "blue",
      },
      {
        label: "My Gigs",
        href: "/dashboard/gigs",
        icon: Briefcase,
        description:
          "Create, edit, or pause your services and monitor how your gigs are performing.",
        color: "green",
      },
      {
        label: "Orders",
        href: "/dashboard/orders",
        icon: Package,
        description:
          "Track ongoing orders, communicate with buyers, and manage delivery timelines efficiently.",
        color: "purple",
      },
      {
        label: "Reviews",
        href: "/dashboard/reviews",
        icon: Star,
        description:
          "Respond to client feedback, monitor ratings, and manage your reputation.",
        color: "yellow",
      },
      {
        label: "Wallets",
        href: "/dashboard/wallets",
        icon: Wallet,
        description:
          "Access your earnings, track transactions, and manage your withdrawal methods securely.",
        color: "blue",
      },
      {
        label: "Verification Center",
        href: "/dashboard/verification-center",
        icon: Shield,
        description:
          "Complete identity and service verification to build trust and unlock platform features.",
        color: "green",
      },
      {
        label: "Reports",
        href: "/dashboard/report",
        icon: ShieldCheck,
        description:
          "File or view reports related to user behavior or service issues and check their status.",
        color: "yellow",
      },
    ],
  },
];

export const userMenuItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Profile",
    href: "/profile", // Will be replaced with /profile/{username}
    icon: User,
  },
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: Package,
  },
  {
    label: "Wallets",
    href: "/dashboard/wallets",
    icon: Wallet,
  },
  {
    label: "Bookmarks",
    href: "/bookmarks",
    icon: Bookmark,
    description: "Your saved gigs",
  },
  {
    label: "Verification Center",
    href: "/dashboard/verification-center",
    icon: Shield,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    label: "Help & Support",
    href: "/help",
    icon: HelpCircle,
  },
];

// Footer/legal navigation
export const legalNavItems: NavItem[] = [
  {
    label: "Terms of Service",
    href: "/terms-of-service",
    icon: FileText,
  },
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
    icon: ShieldCheck,
  },
];

// Navigation helpers
export function getMainNavItems(isAuthenticated: boolean): NavItem[] {
  return [...publicNavItems, ...(isAuthenticated ? authenticatedNavItems : [])];
}

export function getMobileNavItems(isAuthenticated: boolean): NavItem[] {
  const mainItems = getMainNavItems(isAuthenticated);

  if (isAuthenticated) {
    // Add notifications and settings to mobile nav when authenticated
    return [
      ...mainItems,
      {
        label: "Notifications",
        href: "/notifications",
        icon: Bell,
        description: "View all notifications",
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        description: "Manage your preferences",
      },
    ];
  }

  return mainItems;
}
