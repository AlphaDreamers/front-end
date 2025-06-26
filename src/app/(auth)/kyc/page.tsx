"use client";

import React, { useState } from "react";
import { Upload, CheckCircle, Camera, FileText, Loader2 } from "lucide-react";
import PageTemplate from "@/components/templates/page-template";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Form, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { verifyKyc } from "@/lib/actions/auth";

interface KYCResponse {
  success: boolean;
  verified?: boolean;
  similarity?: number;
  message?: string;
  error?: string;
}

const formSchema = z.object({
  idImage: z
    .instanceof(File)
    .refine(
      (file) => file.type.startsWith("image/"),
      "ID image must be an image file"
    ),
  selfie: z
    .instanceof(File)
    .refine(
      (file) => file.type.startsWith("image/"),
      "Selfie must be an image file"
    ),
});

export default function KycVerificationPage() {
  const router = useRouter();

  const session = useSession();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idImage: undefined,
      selfie: undefined,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const [dragActive, setDragActive] = useState({
    idImage: false,
    selfie: false,
  });

  const API_BASE_URL = "https://aws-kyc-verification.onrender.com";

  const handleFileChange = (type: "idImage" | "selfie", file: File) => {
    form.setValue(type, file);
  };

  const handleDrag = (e: React.DragEvent, type: "idImage" | "selfie") => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive({ ...dragActive, [type]: true });
    } else if (e.type === "dragleave") {
      setDragActive({ ...dragActive, [type]: false });
    }
  };

  const handleDrop = (e: React.DragEvent, type: "idImage" | "selfie") => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive({ ...dragActive, [type]: false });

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(type, e.dataTransfer.files[0]);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.promise(
      async () => {
        if (!session.data?.user?.email) {
          throw new Error("User email is required for KYC verification");
        }

        const formDataToSend = new FormData();
        formDataToSend.append("email", session.data.user.email);
        formDataToSend.append("id_image", values.idImage);
        formDataToSend.append("selfie", values.selfie);

        const response = await fetch(`${API_BASE_URL}/kyc`, {
          method: "POST",
          body: formDataToSend,
        });

        const res = (await response.json()) as KYCResponse;

        if (!response.ok) {
          throw new Error(res.error || "Failed to submit KYC data");
        }

        if (!res.success) {
          throw new Error(res.message || "KYC verification failed");
        }

        if (!res.verified) {
          throw new Error(
            `KYC verification failed with similarity: ${res.similarity}. Please try again.`
          );
        }

        return res;
      },
      {
        loading: "Submitting KYC data...",
        success: async () => {
          await verifyKyc();
          router.push("/dashboard/verification-center");
          return "KYC verification submitted successfully!";
        },
        error: (error) =>
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      }
    );
  };

  const FileUploadZone = ({
    type,
    icon: Icon,
    title,
    description,
  }: {
    type: "idImage" | "selfie";
    icon: React.ElementType;
    title: string;
    description: string;
  }) => (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 hover:border-primary hover:bg-primary/5 ${
        dragActive[type]
          ? "border-primary bg-primary/10"
          : form.getValues(type)
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 bg-muted/50"
      }`}
      onDragEnter={(e) => handleDrag(e, type)}
      onDragLeave={(e) => handleDrag(e, type)}
      onDragOver={(e) => handleDrag(e, type)}
      onDrop={(e) => handleDrop(e, type)}
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          e.target.files?.[0] && handleFileChange(type, e.target.files[0])
        }
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <div className="flex flex-col items-center space-y-4">
        <div
          className={`p-4 rounded-full ${form.getValues(type) ? "bg-primary/10" : "bg-muted"}`}
        >
          <Icon
            className={`w-8 h-8 ${form.getValues(type) ? "text-primary" : "text-muted-foreground"}`}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>

          {form.getValues(type) && (
            <div className="mt-3 flex items-center justify-center space-x-2 text-primary">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {form.getValues(type)?.name}
              </span>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          Drag & drop or click to select • JPG, PNG supported
        </div>

        <FormMessage>{form.formState.errors[type]?.message}</FormMessage>
      </div>
    </div>
  );

  return (
    <PageTemplate
      title="KYC Verification"
      description="Verify your identity by uploading your ID document and a selfie. Our system will match"
      centered
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="space-y-8">
              {/* File Uploads */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <FileText className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-card-foreground">
                      ID Document
                    </h2>
                  </div>
                  <FileUploadZone
                    type="idImage"
                    icon={FileText}
                    title="Upload ID Image"
                    description="Driver's license, passport, or national ID"
                  />
                </div>

                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <Camera className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-card-foreground">
                      Selfie Photo
                    </h2>
                  </div>
                  <FileUploadZone
                    type="selfie"
                    icon={Camera}
                    title="Upload Selfie"
                    description="Clear photo of your face"
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                className="mx-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Upload />
                    <span>Start Verification</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <div className="text-center mt-16 text-muted-foreground">
        <p className="text-sm">
          Your data is processed securely and in compliance with privacy
          regulations.
        </p>
      </div>
    </PageTemplate>
  );
}
