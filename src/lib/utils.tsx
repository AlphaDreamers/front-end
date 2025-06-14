import { NotificationType, Prisma, SocialLinkType, Tier } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import {
  Github,
  Globe,
  Instagram,
  Linkedin,
  LucideProps,
  MessageSquare,
  Twitter,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { PASSWORD_SCHEMA_CONDITIONS_COUNT, PasswordSchema } from "./schemas";
import {
  EncryptedWalletData,
  FaqPageSearchParams,
  GigSearchParams,
  LucideIconName,
  UserProfileFields,
} from "./types";
import * as LucideIcons from "lucide-react";
import { encode, decode } from "bs58";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export const calculatePasswordStrength = (password: string): number => {
  const result = PasswordSchema.safeParse(password);
  const errorCount = result.success ? 0 : result.error.errors.length;
  return (
    ((PASSWORD_SCHEMA_CONDITIONS_COUNT - errorCount) /
      PASSWORD_SCHEMA_CONDITIONS_COUNT) *
    100
  );
};

export const encryptPrivateKey = async (
  privateKey: Uint8Array,
  password: string
): Promise<{
  encryptedPrivateKey: string;
  salt: string;
  iv: string;
}> => {
  if (!privateKey || privateKey.length === 0) {
    throw new Error("Invalid private key provided");
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const passwordKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  const privateKeyBuffer = new ArrayBuffer(privateKey.length);
  const privateKeyView = new Uint8Array(privateKeyBuffer);
  privateKeyView.set(privateKey);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    derivedKey,
    privateKeyBuffer
  );
  return {
    encryptedPrivateKey: encode(new Uint8Array(encrypted)),
    salt: encode(salt),
    iv: encode(iv),
  };
};

export const decryptPrivateKey = async (
  encryptedData: EncryptedWalletData,
  password: string
): Promise<Uint8Array> => {
  console.log("FLAG1");

  // Use bs58 decode instead of base64
  const encrypted = decode(encryptedData.encryptedPrivateKey);
  const salt = decode(encryptedData.salt);
  const iv = decode(encryptedData.iv);

  console.log("FLAG2");
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  console.log("FLAG3");

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
  console.log("FLAG4");

  // This should now work and reach FLAG5
  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      derivedKey,
      encrypted
    );
    console.log("FLAG5 - Decryption successful");
    return new Uint8Array(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw error;
  }
};

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export const getDashboardReviewsFilters = ({
  page = 1,
  q,
  sortBy,
  order,
  filterBy,
}: DashboardReviewsSearchParams): Omit<
  Prisma.ReviewFindManyArgs,
  "select" | "include"
> => {
  const where: Prisma.ReviewWhereInput = {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      {
        author: {
          OR: [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { username: { contains: q, mode: "insensitive" } },
          ],
        },
      },
    ];
  }

  if (filterBy === "responded") {
    where.sellerResponse = { not: null };
  } else if (filterBy === "unresponded") {
    where.sellerResponse = null;
  }

  const orderBy: Prisma.ReviewOrderByWithRelationInput = {};

  if (sortBy === "createdAt") {
    orderBy.createdAt = order === "asc" ? "asc" : "desc";
  } else if (sortBy === "rating") {
    orderBy.rating = order === "asc" ? "asc" : "desc";
  } else {
    orderBy.createdAt = "desc"; // Default to createdAt descending
  }

  return {
    skip: (page - 1) * 10,
    take: 10,
    where,
    orderBy,
  };
};

export const buildFaqFilter = (
  searchParams: FaqPageSearchParams,
  pageSize: number = 10
) => {
  const { q } = searchParams;

  const page = parseInt(searchParams.page ?? "1", 10);

  const where: Prisma.FAQWhereInput = {};

  if (q) {
    where.question = {
      contains: q,
      mode: "insensitive",
    };
  }

  const skip: Prisma.FAQFindManyArgs["skip"] = (page - 1) * pageSize;
  const take: Prisma.FAQFindManyArgs["take"] = pageSize;
  const orderBy: Prisma.FAQFindManyArgs["orderBy"] = {
    createdAt: "desc",
  };

  return {
    where,
    skip,
    take,
    orderBy,
  };
};

export const buildGigFilters = (
  searchParams: GigSearchParams,
  itemsPerPage: number = 20
): Omit<Prisma.GigFindManyArgs, "select" | "include"> => {
  const {
    q,
    page = "1",
    "price-min": priceMin,
    "price-max": priceMax,
    dateAdded,
  } = searchParams;

  const currentPage = parseInt(page, 10) || 1;
  const skip = (currentPage - 1) * itemsPerPage;
  const take = itemsPerPage;

  const where: Prisma.GigWhereInput = {};

  if (q && q.trim()) {
    where.OR = [
      {
        title: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        category: {
          title: {
            contains: q,
            mode: "insensitive",
          },
        },
      },
      {
        seller: {
          OR: [
            {
              username: {
                contains: q,
                mode: "insensitive",
              },
            },
            {
              firstName: {
                contains: q,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: q,
                mode: "insensitive",
              },
            },
          ],
        },
      },
    ];
  }

  if (priceMin) {
    const minPrice = parseFloat(priceMin);
    if (!isNaN(minPrice)) {
      where.packages = {
        some: {
          price: {
            gte: minPrice,
          },
        },
      };
    }
  }

  if (priceMax) {
    const maxPrice = parseFloat(priceMax);
    if (!isNaN(maxPrice)) {
      where.packages = {
        some: {
          price: {
            lte: maxPrice,
          },
        },
      };
    }
  }

  if (dateAdded) {
    const date = new Date(dateAdded);
    if (!isNaN(date.getTime())) {
      where.createdAt = {
        gte: date,
      };
    }
  }

  if (searchParams.isVerified) {
    where.seller = {
      isProfileVerified: true,
    };
  }

  return {
    skip,
    take,
    where,
  };
};

// Get the appropriate icon for each notification type
export function getNotificationIcon(
  type: NotificationType
): LucideIcons.LucideIcon {
  const iconMap: Record<NotificationType, LucideIcons.LucideIcon> = {
    REVIEW: LucideIcons.Star,
    ORDER_UPDATE: LucideIcons.Package,
    PAYMENT: LucideIcons.DollarSign,
    MESSAGE: MessageSquare,
    SYSTEM: LucideIcons.Settings,
  };

  return iconMap[type] || LucideIcons.Settings;
}

// Get the color class for each notification type
export function getNotificationColor(type: NotificationType): string {
  const colorMap: Record<NotificationType, string> = {
    REVIEW: "text-yellow-400",
    ORDER_UPDATE: "text-blue-400",
    PAYMENT: "text-green-400",
    MESSAGE: "text-purple-400",
    SYSTEM: "text-gray-400",
  };

  return colorMap[type] || "text-gray-400";
}

// Get the background color class for notification icons
export function getNotificationBgColor(type: NotificationType): string {
  const bgColorMap: Record<NotificationType, string> = {
    REVIEW: "bg-yellow-400/10",
    ORDER_UPDATE: "bg-blue-400/10",
    PAYMENT: "bg-green-400/10",
    MESSAGE: "bg-purple-400/10",
    SYSTEM: "bg-gray-400/10",
  };

  return bgColorMap[type] || "bg-gray-400/10";
}

// Get the border color for unread notifications
export function getNotificationBorderColor(type: NotificationType): string {
  const borderColorMap: Record<NotificationType, string> = {
    REVIEW: "border-yellow-500/50",
    ORDER_UPDATE: "border-blue-500/50",
    PAYMENT: "border-green-500/50",
    MESSAGE: "border-purple-500/50",
    SYSTEM: "border-gray-500/50",
  };

  return borderColorMap[type] || "border-gray-500/50";
}

export function getTierConfig(tier: Tier): {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: LucideIconName;
} {
  switch (tier) {
    case "NONE":
      return {
        label: "Not Started",
        color: "text-gray-500",
        bgColor: "bg-gray-500/10",
        borderColor: "border-gray-500/20",
        icon: "Circle",
      };
    case "BRONZE":
      return {
        label: "Bronze",
        color: "text-orange-600",
        bgColor: "bg-orange-600/10",
        borderColor: "border-orange-600/20",
        icon: "Medal",
      };
    case "SILVER":
      return {
        label: "Silver",
        color: "text-gray-400",
        bgColor: "bg-gray-400/10",
        borderColor: "border-gray-400/20",
        icon: "Medal",
      };
    case "GOLD":
      return {
        label: "Gold",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/20",
        icon: "Medal",
      };
    case "PLATINUM":
      return {
        label: "Platinum",
        color: "text-purple-400",
        bgColor: "bg-purple-400/10",
        borderColor: "border-purple-400/20",
        icon: "Crown",
      };
    case "DIAMOND":
      return {
        label: "Diamond",
        color: "text-blue-400",
        bgColor: "bg-blue-400/10",
        borderColor: "border-blue-400/20",
        icon: "Gem",
      };
    default:
      return {
        label: "Unknown",
        color: "text-gray-500",
        bgColor: "bg-gray-500/10",
        borderColor: "border-gray-500/20",
        icon: "Circle",
      };
  }
}

export const getNextTier = (tier: Tier) => {
  switch (tier) {
    case "NONE":
      return "BRONZE";
    case "BRONZE":
      return "SILVER";
    case "SILVER":
      return "GOLD";
    case "GOLD":
      return "PLATINUM";
    default:
      return "NONE";
  }
};

// Calculate profile completion percentage
export function calculateProfileCompletion(user: UserProfileFields): number {
  const fieldChecks = [
    { field: "firstName", value: user.firstName },
    { field: "lastName", value: user.lastName },
    { field: "username", value: user.username },
    { field: "avatar", value: user.avatar },
    { field: "banner", value: user.banner },
    { field: "headline", value: user.headline },
    { field: "bio", value: user.bio },
    {
      field: "skills",
      value: user.skills && user.skills.length > 0,
    },
    {
      field: "socialLinks",
      value: user.socialLinks && user.socialLinks.length > 0,
    },
    {
      field: "portfolioItems",
      value: user.portfolioItems && user.portfolioItems.length > 0,
    },
  ];

  const filledFields = fieldChecks.filter((check) => Boolean(check.value));
  const percentage = Math.round(
    (filledFields.length / fieldChecks.length) * 100
  );

  return percentage;
}
