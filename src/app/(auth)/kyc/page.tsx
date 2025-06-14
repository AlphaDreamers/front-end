"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import {
  FileText,
  User,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Upload,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CaptureDocument } from "../../../components/kyc/capture-document";
import { toast } from "sonner";
import { CaptureFace } from "../../../components/kyc/capture-face";
import { KycFormSchema } from "@/lib/schemas";
import AuthCard from "@/components/templates/auth-card";
import { verifyKyc } from "@/lib/actions/auth";

type VerificationFormValues = z.infer<typeof KycFormSchema>;

export default function VerificationPage() {
  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(KycFormSchema),
    defaultValues: {
      id: undefined,
      selfie: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof KycFormSchema>) => {
    toast.promise(
      async () =>
        verifyKyc({
          id: values.id,
          selfie: values.selfie,
        }),
      {
        loading: "Submitting documents...",
        success: "Documents submitted successfully!",
        error: (error) => {
          const ms =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";
          form.setError("root", { message: ms });
          return ms;
        },
      }
    );
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <AuthCard
      title="Identity Verification"
      description="Complete your verification to unlock all features."
      cardFooter="Your documents are encrypted and securely stored. We use
              industry-standard security measures to protect your personal
              information."
      footer={
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Processing verification...
            </>
          ) : (
            <>
              Submit for Verification
              <ArrowRight />
            </>
          )}
        </Button>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ID Document Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Government-Issued ID
              </CardTitle>
              <CardDescription>
                Capture or upload a clear photo of your passport, driver&apos;s
                license, or national ID card
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">ID Document</FormLabel>
                    <FormControl>
                      {field.value ? (
                        <div className="relative">
                          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border bg-muted">
                            <Image
                              src={URL.createObjectURL(field.value)}
                              alt="ID document"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="absolute top-2 right-2 flex gap-2">
                            <Badge
                              variant="secondary"
                              className="backdrop-blur-sm"
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Captured
                            </Badge>
                            <Button
                              type="button"
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 backdrop-blur-sm"
                              onClick={() => field.onChange(null)}
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <CaptureDocument
                            onCapture={(file) => field.onChange(file)}
                            className="w-full"
                          />
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <Separator />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-background px-2 text-muted-foreground">
                                Or upload manually
                              </span>
                            </div>
                          </div>
                          <label className="block">
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) field.onChange(file);
                              }}
                            />
                            <div className="cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/25 px-6 py-8 text-center hover:border-muted-foreground/50 transition-colors">
                              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                              <p className="mt-2 text-sm text-muted-foreground">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PNG, JPG up to 10MB
                              </p>
                            </div>
                          </label>
                        </div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Selfie Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Selfie Verification
              </CardTitle>
              <CardDescription>
                Take a clear selfie to verify your identity matches your ID
                document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="selfie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Selfie</FormLabel>
                    <FormControl>
                      {field.value ? (
                        <div className="relative">
                          <div className="relative aspect-[4/5] max-w-sm mx-auto overflow-hidden rounded-lg border bg-muted">
                            <Image
                              src={URL.createObjectURL(field.value)}
                              alt="Selfie"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="absolute top-2 right-2 flex gap-2">
                            <Badge
                              variant="secondary"
                              className="backdrop-blur-sm"
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Captured
                            </Badge>
                            <Button
                              type="button"
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 backdrop-blur-sm"
                              onClick={() => field.onChange(null)}
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="max-w-sm mx-auto">
                          <CaptureFace
                            onCapture={(file) => field.onChange(file)}
                            className="w-full"
                          />
                        </div>
                      )}
                    </FormControl>
                    <FormDescription className="text-center mt-4">
                      Ensure good lighting and that your face is clearly visible
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    </AuthCard>
  );
}
