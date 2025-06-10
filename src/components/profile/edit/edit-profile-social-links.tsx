"use client";

import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import { SocialLinkType } from "@prisma/client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { UpdateProfileFormSchema } from "@/lib/schemas";
import { getIconBySocialType } from "@/lib/utils";

interface EditProfileSocialLinksProps {
  form: UseFormReturn<z.infer<typeof UpdateProfileFormSchema>>;
}

const SOCIAL_TYPES: { value: SocialLinkType; label: string }[] = [
  { value: "WEBSITE", label: "Website" },
  { value: "GITHUB", label: "GitHub" },
  { value: "LINKEDIN", label: "LinkedIn" },
  { value: "X", label: "X (Twitter)" },
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "FACEBOOK", label: "Facebook" },
  { value: "YOUTUBE", label: "YouTube" },
  { value: "DISCORD", label: "Discord" },
  { value: "TELEGRAM", label: "Telegram" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "TIKTOK", label: "TikTok" },
  { value: "EMAIL", label: "Email" },
];

export default function EditProfileSocialLinks({
  form,
}: EditProfileSocialLinksProps) {
  const socialLinks = form.watch("socialLinks");
  const featuredBadgeId = form.watch("featuredBadgeId");

  const addSocialLink = () => {
    const currentLinks = form.getValues("socialLinks");
    const usedTypes = currentLinks.map((link) => link.type);
    const availableTypes = SOCIAL_TYPES.filter(
      (type) => !usedTypes.includes(type.value)
    );

    if (availableTypes.length === 0) return;

    form.setValue("socialLinks", [
      ...currentLinks,
      {
        tempId: `temp_${Date.now()}`,
        type: availableTypes[0].value,
        url: "",
      },
    ]);
  };

  const removeSocialLink = (index: number) => {
    const currentLinks = form.getValues("socialLinks");
    form.setValue(
      "socialLinks",
      currentLinks.filter((_, i) => i !== index)
    );
  };

  const updateSocialLink = (
    index: number,
    field: "type" | "url",
    value: string
  ) => {
    const currentLinks = form.getValues("socialLinks");
    currentLinks[index] = { ...currentLinks[index], [field]: value };
    form.setValue("socialLinks", currentLinks);
  };

  const getUrlPlaceholder = (type: SocialLinkType) => {
    const placeholders: Record<SocialLinkType, string> = {
      WEBSITE: "https://yourwebsite.com",
      GITHUB: "https://github.com/username",
      LINKEDIN: "https://linkedin.com/in/username",
      X: "https://x.com/username",
      INSTAGRAM: "https://instagram.com/username",
      FACEBOOK: "https://facebook.com/username",
      YOUTUBE: "https://youtube.com/@channel",
      DISCORD: "username#1234",
      TELEGRAM: "https://t.me/username",
      WHATSAPP: "+1234567890",
      TIKTOK: "https://tiktok.com/@username",
      EMAIL: "your.email@example.com",
    };
    return placeholders[type] || "Enter URL";
  };

  const getAvailableTypes = () => {
    const usedTypes = socialLinks.map((link) => link.type);
    return SOCIAL_TYPES.filter((type) => !usedTypes.includes(type.value));
  };

  // Mock badge data - in real implementation, this would come from the profile data
  const badges = [
    {
      id: "badge1",
      title: "Top Rated Seller",
      tier: "GOLD",
      description: "Achieved 50+ 5-star reviews",
    },
    {
      id: "badge2",
      title: "Quick Responder",
      tier: "SILVER",
      description: "Average response time under 1 hour",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Social Links */}
      <FormField
        control={form.control}
        name="socialLinks"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Social Links</FormLabel>
            <FormDescription>
              Connect your social media profiles and website
            </FormDescription>
            <FormControl>
              <div className="space-y-3">
                {socialLinks.map((link, index) => (
                  <Card key={link.id || link.tempId || index} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {getIconBySocialType(link.type, { size: 20 })}
                      </div>

                      <Select
                        value={link.type}
                        onValueChange={(value) =>
                          updateSocialLink(index, "type", value)
                        }
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {SOCIAL_TYPES.map((type) => {
                            const isUsed = socialLinks.some(
                              (l, i) => i !== index && l.type === type.value
                            );
                            return (
                              <SelectItem
                                key={type.value}
                                value={type.value}
                                disabled={isUsed}
                              >
                                {type.label}
                                {isUsed && " (in use)"}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      <Input
                        value={link.url}
                        onChange={(e) =>
                          updateSocialLink(index, "url", e.target.value)
                        }
                        placeholder={getUrlPlaceholder(link.type)}
                        className="flex-1"
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSocialLink(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}

                {getAvailableTypes().length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={addSocialLink}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Social Link
                  </Button>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Featured Badge Selection */}
      {badges.length > 0 && (
        <FormField
          control={form.control}
          name="featuredBadgeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured Badge</FormLabel>
              <FormDescription>
                Select which badge to display prominently on your profile
              </FormDescription>
              <FormControl>
                <RadioGroup
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  {badges.map((badge) => (
                    <Card
                      key={badge.id}
                      className={cn(
                        "p-4 cursor-pointer transition-colors",
                        field.value === badge.id && "border-primary"
                      )}
                    >
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <RadioGroupItem value={badge.id} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{badge.title}</span>
                            <Badge variant="secondary">{badge.tier}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {badge.description}
                          </p>
                        </div>
                      </label>
                    </Card>
                  ))}
                  <Card className="p-4 cursor-pointer">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <RadioGroupItem value="" />
                      <div>
                        <span className="font-medium">No featured badge</span>
                        <p className="text-sm text-muted-foreground">
                          Don't display any badge prominently
                        </p>
                      </div>
                    </label>
                  </Card>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
