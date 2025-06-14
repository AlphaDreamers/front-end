"use client";

import { UseFormReturn } from "react-hook-form";
import {
  Plus,
  X,
  Link,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Globe,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SocialLinkType } from "@prisma/client";

interface FormSocialLinksProps {
  form: UseFormReturn<any>;
}

// Generate a unique temp ID
const generateTempId = () => `temp_${Date.now()}_${Math.random()}`;

// Social platform configurations
const SOCIAL_PLATFORMS = [
  {
    type: SocialLinkType.GITHUB,
    label: "GitHub",
    icon: Github,
    placeholder: "https://github.com/username",
  },
  {
    type: SocialLinkType.LINKEDIN,
    label: "LinkedIn",
    icon: Linkedin,
    placeholder: "https://linkedin.com/in/username",
  },
  {
    type: SocialLinkType.X,
    label: "X (Twitter)",
    icon: Twitter,
    placeholder: "https://x.com/username",
  },
  {
    type: SocialLinkType.INSTAGRAM,
    label: "Instagram",
    icon: Instagram,
    placeholder: "https://instagram.com/username",
  },
  {
    type: SocialLinkType.FACEBOOK,
    label: "Facebook",
    icon: Facebook,
    placeholder: "https://facebook.com/username",
  },
  {
    type: SocialLinkType.WEBSITE,
    label: "Website",
    icon: Globe,
    placeholder: "https://yourwebsite.com",
  },
  {
    type: SocialLinkType.EMAIL,
    label: "Email",
    icon: Mail,
    placeholder: "your@email.com",
  },
  {
    type: SocialLinkType.YOUTUBE,
    label: "YouTube",
    icon: Link,
    placeholder: "https://youtube.com/@username",
  },
  {
    type: SocialLinkType.DISCORD,
    label: "Discord",
    icon: Link,
    placeholder: "https://discord.gg/server",
  },
  {
    type: SocialLinkType.TELEGRAM,
    label: "Telegram",
    icon: Link,
    placeholder: "https://t.me/username",
  },
];

export default function FormSocialLinks({ form }: FormSocialLinksProps) {
  const socialLinks = form.watch("socialLinks") || [];

  const addSocialLink = () => {
    const newLink = {
      tempId: generateTempId(),
      type: "", // Will be selected by user
      url: "",
    };

    form.setValue("socialLinks", [...socialLinks, newLink]);
  };

  const removeSocialLink = (index: number) => {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    form.setValue("socialLinks", newLinks);
  };

  const updateSocialLink = (index: number, field: string, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    form.setValue("socialLinks", newLinks);
  };

  // Get available platforms (exclude already selected ones)
  const getAvailablePlatforms = (currentIndex: number) => {
    const usedTypes = socialLinks
      .map((link, index) => (index !== currentIndex ? link.type : null))
      .filter(Boolean);

    return SOCIAL_PLATFORMS.filter(
      (platform) => !usedTypes.includes(platform.type)
    );
  };

  // Get platform config by type
  const getPlatformConfig = (type: string) => {
    return SOCIAL_PLATFORMS.find((platform) => platform.type === type);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Social Links</h3>
          <p className="text-sm text-muted-foreground">
            Connect your social media and professional profiles
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSocialLink}
          disabled={socialLinks.length >= 10}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Link
        </Button>
      </div>

      {/* Social Links */}
      {socialLinks.length > 0 ? (
        <div className="space-y-4">
          {socialLinks.map((link, index) => {
            const platformConfig = getPlatformConfig(link.type);
            const Icon = platformConfig?.icon || Link;

            return (
              <Card key={link.id || link.tempId} className="p-4">
                <div className="grid gap-4 md:grid-cols-3 items-end">
                  {/* Platform Selection */}
                  <FormField
                    control={form.control}
                    name={`socialLinks.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              updateSocialLink(index, "type", value);
                              // Clear URL when platform changes
                              updateSocialLink(index, "url", "");
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailablePlatforms(index).map((platform) => {
                                const PlatformIcon = platform.icon;
                                return (
                                  <SelectItem
                                    key={platform.type}
                                    value={platform.type}
                                  >
                                    <div className="flex items-center gap-2">
                                      <PlatformIcon className="h-4 w-4" />
                                      {platform.label}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* URL Input */}
                  <FormField
                    control={form.control}
                    name={`socialLinks.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder={
                                platformConfig?.placeholder || "https://"
                              }
                              onChange={(e) => {
                                field.onChange(e);
                                updateSocialLink(index, "url", e.target.value);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Remove Button */}
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSocialLink(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Link className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No social links added yet</p>
          <p className="text-sm">
            Add your social media and professional profiles
          </p>
        </div>
      )}

      {/* Links Summary */}
      {socialLinks.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium mb-3">Preview</h4>
          <div className="flex flex-wrap gap-2">
            {socialLinks
              .filter((link) => link.type && link.url)
              .map((link, index) => {
                const platformConfig = getPlatformConfig(link.type);
                const Icon = platformConfig?.icon || Link;

                return (
                  <div
                    key={link.id || link.tempId}
                    className="flex items-center gap-2 bg-background px-3 py-2 rounded-md border text-sm"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{platformConfig?.label}</span>
                  </div>
                );
              })}
          </div>
          {socialLinks.filter((link) => link.type && link.url).length === 0 && (
            <p className="text-sm text-muted-foreground">
              Complete the forms above to see your social links preview
            </p>
          )}
        </div>
      )}
    </div>
  );
}
