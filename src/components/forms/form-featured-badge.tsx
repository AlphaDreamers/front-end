"use client";

import { UseFormReturn } from "react-hook-form";
import { Award, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Badge {
  id: string;
  title: string;
  icon: string;
  color: string;
}

interface FormFeaturedBadgeProps {
  form: UseFormReturn<any>;
  badges: Badge[];
}

export default function FormFeaturedBadge({
  form,
  badges,
}: FormFeaturedBadgeProps) {
  const featuredBadgeId = form.watch("featuredBadgeId");

  const setFeaturedBadge = (badgeId: string | null) => {
    form.setValue("featuredBadgeId", badgeId);
  };

  const selectedBadge = badges.find((badge) => badge.id === featuredBadgeId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Award className="h-5 w-5" />
          Featured Badge
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a badge to highlight on your profile (optional)
        </p>
      </div>

      <FormField
        control={form.control}
        name="featuredBadgeId"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="space-y-4">
                {badges.length > 0 ? (
                  <>
                    {/* Clear Selection Button */}
                    {featuredBadgeId && (
                      <div className="flex justify-start">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFeaturedBadge(null)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Clear Selection
                        </Button>
                      </div>
                    )}

                    {/* Badge Selection Grid */}
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {badges.map((badge) => {
                        const isSelected = badge.id === featuredBadgeId;

                        return (
                          <Card
                            key={badge.id}
                            className={cn(
                              "p-4 cursor-pointer transition-colors border-2",
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                            onClick={() => setFeaturedBadge(badge.id)}
                          >
                            <div className="flex items-center gap-3">
                              {/* Badge Icon */}
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
                                style={{ backgroundColor: badge.color }}
                              >
                                {badge.icon}
                              </div>

                              {/* Badge Info */}
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">
                                  {badge.title}
                                </h4>
                                {isSelected && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                    <span className="text-xs text-yellow-600 font-medium">
                                      Featured
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Selection Indicator */}
                              {isSelected && (
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-white" />
                                </div>
                              )}
                            </div>
                          </Card>
                        );
                      })}
                    </div>

                    {/* Selected Badge Preview */}
                    {selectedBadge && (
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-medium mb-3">
                          Featured Badge Preview
                        </h4>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
                            style={{ backgroundColor: selectedBadge.color }}
                          >
                            {selectedBadge.icon}
                          </div>
                          <div>
                            <h5 className="font-medium">
                              {selectedBadge.title}
                            </h5>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm text-yellow-600 font-medium">
                                Featured Badge
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">
                          This badge will be prominently displayed on your
                          profile
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  /* No Badges Available */
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No badges earned yet</p>
                    <p className="text-sm">
                      Complete activities to earn badges you can feature
                    </p>
                  </div>
                )}
              </div>
            </FormControl>
            <FormDescription>
              {badges.length > 0
                ? "Select a badge to showcase your achievements on your profile"
                : "Earn badges by completing orders, getting reviews, and building your reputation"}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
