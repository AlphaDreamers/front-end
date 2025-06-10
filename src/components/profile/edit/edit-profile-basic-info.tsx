"use client";

import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Upload, User } from "lucide-react";

import FormInput from "@/components/forms/form-input";
import FormTextarea from "@/components/forms/form-textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { UpdateProfileFormSchema } from "@/lib/schemas";

interface EditProfileBasicInfoProps {
  form: UseFormReturn<z.infer<typeof UpdateProfileFormSchema>>;
}

export default function EditProfileBasicInfo({
  form,
}: EditProfileBasicInfoProps) {
  const handleImageUpload = (field: "avatar" | "banner", file: File) => {
    // Create a new image object for the form
    form.setValue(field, {
      type: "new",
      file,
      tempId: `temp_${Date.now()}`,
    });
  };

  const removeImage = (field: "avatar" | "banner") => {
    form.setValue(field, null);
  };

  return (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <FormField
        control={form.control}
        name="avatar"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profile Picture</FormLabel>
            <FormControl>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {field.value ? (
                    <div className="relative">
                      <img
                        src={
                          field.value.type === "existing"
                            ? field.value.url
                            : URL.createObjectURL(field.value.file)
                        }
                        alt="Avatar preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-muted"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 rounded-full"
                        onClick={() => removeImage("avatar")}
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="avatar-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload("avatar", file);
                    }}
                  />
                  <label htmlFor="avatar-upload">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Avatar
                      </span>
                    </Button>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Recommended: 400x400px, max 5MB
                  </p>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Banner Upload */}
      <FormField
        control={form.control}
        name="banner"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Banner Image</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                  {field.value ? (
                    <>
                      <img
                        src={
                          field.value.type === "existing"
                            ? field.value.url
                            : URL.createObjectURL(field.value.file)
                        }
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeImage("banner")}
                      >
                        Remove
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No banner uploaded
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="banner-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload("banner", file);
                  }}
                />
                <label htmlFor="banner-upload">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Banner
                    </span>
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground">
                  Recommended: 1200x400px, max 5MB
                </p>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          control={form.control}
          name="firstName"
          label="First Name"
          placeholder="John"
          required
        />

        <FormInput
          control={form.control}
          name="lastName"
          label="Last Name"
          placeholder="Doe"
          required
        />
      </div>

      <FormInput
        control={form.control}
        name="username"
        label="Username"
        placeholder="johndoe"
        description="Your unique identifier on the platform"
        required
      />

      <FormInput
        control={form.control}
        name="headline"
        label="Professional Headline"
        placeholder="Senior Full Stack Developer | React & Node.js Expert"
        description="A brief tagline that describes your expertise"
      />

      <FormTextarea
        control={form.control}
        name="bio"
        label="Bio"
        placeholder="Tell potential clients about your experience, skills, and what makes you unique..."
        description="Describe your professional background and what you offer"
        rows={6}
      />
    </div>
  );
}
