import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { LucideProps } from "lucide-react";
import { format } from "date-fns";
import {
  Twitter,
  Github,
  Linkedin,
  Instagram,
  Globe,
  MessageSquare,
} from "lucide-react";
import { PASSWORD_SCHEMA_CONDITIONS_COUNT, PasswordSchema } from "./schemas";
import { encode } from "bs58";
import { Message } from "./types";

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

export const getPasswordStrengthLabel = (strength: number): string => {
  if (strength < 25) return "Very Weak";
  if (strength < 50) return "Weak";
  if (strength < 75) return "Good";
  if (strength < 90) return "Strong";
  return "Very Strong";
};

export const getPasswordStrengthColor = (strength: number): string => {
  if (strength < 25) return "text-red-500";
  if (strength < 50) return "text-orange-500";
  if (strength < 75) return "text-yellow-500";
  if (strength < 90) return "text-blue-500";
  return "text-green-500";
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

export type EncryptedWalletData = {
  encryptedPrivateKey: string;
  salt: string;
  iv: string;
};

export const decryptPrivateKey = async (
  encryptedData: EncryptedWalletData,
  password: string
): Promise<Uint8Array> => {
  const encrypted = Buffer.from(encryptedData.encryptedPrivateKey, "base64");
  const salt = Buffer.from(encryptedData.salt, "base64");
  const iv = Buffer.from(encryptedData.iv, "base64");

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
    ["decrypt"]
  );

  // Decrypt the private key
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    derivedKey,
    encrypted
  );

  return new Uint8Array(decrypted);
};

export function groupMessagesByDate(
  messages: Message[]
): Record<string, Message[]> {
  return messages.reduce(
    (groups, message) => {
      const date = format(new Date(message.createdAt), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    },
    {} as Record<string, Message[]>
  );
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatOrderStatus(status: string): string {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
