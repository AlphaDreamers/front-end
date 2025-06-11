// src/components/navigation/nav-items.tsx
import {
  Home,
  Search,
  Briefcase,
  Package,
  MessageSquare,
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
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  showInMainNav?: boolean;
  showInMobile?: boolean;
  requiresAuth?: boolean;
  badge?: string | number;
  description?: string;
  children?: NavItem[];
}

export const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    showInMainNav: true,
    showInMobile: true,
    description: "Browse featured gigs and categories",
  },
  {
    label: "Browse Gigs",
    href: "/gigs",
    icon: Search,
    showInMainNav: true,
    showInMobile: true,
    description: "Explore all available services",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Briefcase,
    showInMainNav: true,
    showInMobile: true,
    requiresAuth: true,
    description: "Manage your business",
    children: [
      {
        label: "Overview",
        href: "/dashboard",
        icon: Home,
        description: "View your stats and activity",
      },
      {
        label: "My Gigs",
        href: "/dashboard/gigs",
        icon: Briefcase,
        description: "Manage your service offerings",
      },
      {
        label: "Orders",
        href: "/dashboard/orders",
        icon: Package,
        description: "Track and manage orders",
      },
      {
        label: "Reviews",
        href: "/dashboard/reviews",
        icon: Star,
        description: "Respond to customer feedback",
      },
      {
        label: "Wallets",
        href: "/dashboard/wallets",
        icon: Wallet,
        description: "Manage your Solana wallets",
      },
      {
        label: "Verification Center",
        href: "/dashboard/verification-center",
        icon: Shield,
        description: "KYC verification and badges",
      },
    ],
  },
  {
    label: "Messages",
    href: "/messages",
    icon: MessageSquare,
    showInMobile: true,
    requiresAuth: true,
    description: "Chat with buyers and sellers",
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
    showInMobile: true,
    requiresAuth: true,
    description: "View all your notifications",
  },
  {
    label: "Bookmarks",
    href: "/bookmarks",
    icon: Bookmark,
    showInMobile: true,
    requiresAuth: true,
    description: "Your saved gigs",
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
    showInMobile: true,
    requiresAuth: true,
    description: "View and edit your profile",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    showInMobile: true,
    requiresAuth: true,
    description: "Manage your preferences",
  },
  {
    label: "Help",
    href: "/help",
    icon: HelpCircle,
    showInMobile: true,
    description: "Get help and support",
  },
  {
    label: "Contact",
    href: "/contact",
    icon: Mail,
    showInMobile: true,
    description: "Get in touch with us",
  },
];

export const legalNavItems: NavItem[] = [
  {
    label: "Terms of Service",
    href: "/terms-of-service",
    icon: FileText,
    showInMobile: true,
    description: "Read our terms and conditions",
  },
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
    icon: ShieldCheck,
    showInMobile: true,
    description: "Learn how we protect your data",
  },
];

export const getNavItemByHref = (href: string): NavItem | undefined => {
  // First check main nav items
  const mainItem = navItems.find((item) => item.href === href);
  if (mainItem) return mainItem;

  // Then check children
  for (const item of navItems) {
    if (item.children) {
      const child = item.children.find((child) => child.href === href);
      if (child) return child;
    }
  }

  // Check legal items
  return legalNavItems.find((item) => item.href === href);
};