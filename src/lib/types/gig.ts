import { Tier } from "@prisma/client";
import { LucideIconName } from "../types";

export interface GigPackage {
  id: string;
  price: number;
  title: string;
  deliveryTime: number;
  revisions: number;
  features: PackageFeature[];
}

interface PackageFeature {
  id: string;
  label: string;
  isIncluded: boolean;
}

export interface DetailedGig {
  id: string;
  title: string;
  description: string;
  images: string[];
  packages: GigPackage[];
  seller: {
    firstName: string;
    lastName: string;
    username: string;
    avatar: string | null;
    badge: {
      tier: Tier;
      title: string;
      icon: LucideIconName;
      color: string;
    } | null;
  };
  avgRating: number;
  reviewCount: number;
  reviews: {
    id: string;
    rating: number;
    orderId: string;
    author: {
      firstName: string;
      lastName: string;
      username: string;
      avatar: string | null;
    };
    title: string;
    description: string;
    createdAt: Date;
    sellerResponse?: string | null;
  }[];
  faqs: {
    id: string;
    question: string;
    answer: string;
  }[];
}
