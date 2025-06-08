"use client";

// src/components/profile/social-links.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getIconBySocialType } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { SocialLinkType } from "@prisma/client";
import { Share2 } from "lucide-react";

interface SocialLink {
  id: string;
  type: SocialLinkType;
  url: string;
}

interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
}

// Social platform display names
const socialPlatformNames: Record<SocialLinkType, string> = {
  X: "X (Twitter)",
  GITHUB: "GitHub",
  LINKEDIN: "LinkedIn",
  INSTAGRAM: "Instagram",
  FACEBOOK: "Facebook",
  TIKTOK: "TikTok",
  YOUTUBE: "YouTube",
  DISCORD: "Discord",
  TELEGRAM: "Telegram",
  WHATSAPP: "WhatsApp",
  WEBSITE: "Website",
  EMAIL: "Email",
};

// Social platform colors
const socialPlatformColors: Record<SocialLinkType, string> = {
  X: "hover:bg-black hover:text-white",
  GITHUB: "hover:bg-gray-900 hover:text-white",
  LINKEDIN: "hover:bg-blue-600 hover:text-white",
  INSTAGRAM:
    "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 hover:text-white",
  FACEBOOK: "hover:bg-blue-700 hover:text-white",
  TIKTOK: "hover:bg-black hover:text-white",
  YOUTUBE: "hover:bg-red-600 hover:text-white",
  DISCORD: "hover:bg-indigo-600 hover:text-white",
  TELEGRAM: "hover:bg-sky-500 hover:text-white",
  WHATSAPP: "hover:bg-green-600 hover:text-white",
  WEBSITE: "hover:bg-primary hover:text-primary-foreground",
  EMAIL: "hover:bg-primary hover:text-primary-foreground",
};

export default function SocialLinks({ links, className }: SocialLinksProps) {
  if (!links || links.length === 0) {
    return null;
  }

  // Group links by type for better organization
  const primaryLinks = links.filter((link) =>
    ["WEBSITE", "GITHUB", "LINKEDIN", "X"].includes(link.type)
  );
  const otherLinks = links.filter(
    (link) => !["WEBSITE", "GITHUB", "LINKEDIN", "X"].includes(link.type)
  );

  const handleLinkClick = (url: string, type: SocialLinkType) => {
    // Handle email links specially
    if (type === "EMAIL" && !url.startsWith("mailto:")) {
      window.location.href = `mailto:${url}`;
      return;
    }

    // Handle WhatsApp links
    if (type === "WHATSAPP" && !url.startsWith("https://wa.me/")) {
      // Extract phone number and open WhatsApp
      const phoneNumber = url.replace(/\D/g, "");
      window.open(`https://wa.me/${phoneNumber}`, "_blank");
      return;
    }

    // Open other links normally
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Share2 className="size-5 text-primary" />
          Connect & Follow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Links */}
        {primaryLinks.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {primaryLinks.map((link) => (
              <Button
                key={link.id}
                variant="outline"
                size="sm"
                onClick={() => handleLinkClick(link.url, link.type)}
                className={cn(
                  "justify-start gap-2 transition-all",
                  socialPlatformColors[link.type]
                )}
              >
                {getIconBySocialType(link.type, { size: 16 })}
                <span className="text-xs font-medium">
                  {socialPlatformNames[link.type]}
                </span>
              </Button>
            ))}
          </div>
        )}

        {/* Divider if both sections have content */}
        {primaryLinks.length > 0 && otherLinks.length > 0 && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Other Platforms
              </span>
            </div>
          </div>
        )}

        {/* Other Links */}
        {otherLinks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {otherLinks.map((link) => (
              <Button
                key={link.id}
                variant="ghost"
                size="icon"
                onClick={() => handleLinkClick(link.url, link.type)}
                className={cn(
                  "size-10 rounded-full transition-all",
                  socialPlatformColors[link.type]
                )}
                title={socialPlatformNames[link.type]}
              >
                {getIconBySocialType(link.type, { size: 18 })}
              </Button>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="pt-3 border-t">
          <p className="text-xs text-center text-muted-foreground">
            Connect with me on social media
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
