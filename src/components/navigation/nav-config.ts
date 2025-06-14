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
} from "lucide-react";

// Simplified navigation item interface
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
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
    label: "Help",
    href: "/help",
    icon: HelpCircle,
    description: "Get help and support",
  },
  {
    label: "Contact",
    href: "/contact-us",
    icon: Mail,
    description: "Get in touch with us",
  },

  {
    label: "Compare Services",
    href: "/compare",
    icon: Package,
    description: "Compare different services",
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
      },
      {
        label: "My Gigs",
        href: "/dashboard/gigs",
        icon: Briefcase,
      },
      {
        label: "Orders",
        href: "/dashboard/orders",
        icon: Package,
      },
      {
        label: "Reviews",
        href: "/dashboard/reviews",
        icon: Star,
      },
      {
        label: "Wallets",
        href: "/dashboard/wallets",
        icon: Wallet,
      },
      {
        label: "Verification Center",
        href: "/dashboard/verification-center",
        icon: Shield,
      },
    ],
  },
  {
    label: "Bookmarks",
    href: "/bookmarks",
    icon: Bookmark,
    description: "Your saved gigs",
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
