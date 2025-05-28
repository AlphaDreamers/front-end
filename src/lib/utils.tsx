import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
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

export const fileToBase64 = (
  file: File
): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
};
