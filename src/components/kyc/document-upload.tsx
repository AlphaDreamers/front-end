"use client";

import Image from "next/image";
import { Upload, Check, Loader2, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { verifyKyc } from "@/lib/actions/auth";
import { KycFormSchema } from "@/lib/schemas";

export function DocumentUpload() {
  const form = useForm({
    resolver: zodResolver(KycFormSchema),
    defaultValues: {
      id: undefined,
      selfie: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof KycFormSchema>) =>
    toast.promise(async () => verifyKyc(values), {
      loading: "Submitting KYC documents...",
      success: "KYC documents submitted successfully!",
      error: "Failed to submit KYC documents. Please try again later.",
    });

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Upload className="h-5 w-5 text-purple-400" />
              Upload Your Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Document</FormLabel>

                  <FormControl>
                    <div className="bg-background border-2 h-48 border-dashed border-muted/50 rounded-lg p-4 hover:border-primary/50 transition-colors group">
                      {field.value ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={URL.createObjectURL(field.value)}
                            width={200}
                            height={200}
                            alt="Document front preview"
                            className="object-cover rounded-lg w-full h-full"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute opacity-0 group-hover:opacity-100 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 z-10"
                            onClick={() => {
                              field.onChange(null);
                            }}
                          >
                            <Trash />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4 relative">
                          <Upload className="size-10 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium mb-1">
                            Upload front of your document
                          </p>
                          <p className="text-xs text-muted-foreground mb-4">
                            JPG, PNG or PDF (max 5MB)
                          </p>
                          <Input
                            type="file"
                            className="absolute inset-0 z-99 opacity-0 cursor-pointer min-w-full min-h-full"
                            onChange={(e) => {
                              field.onChange(e.target.files?.[0] || null);
                            }}
                          />
                          <Button variant="secondary">Select File</Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Please upload a clear image of the front side of your ID
                    document. Ensure all details are visible and legible.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="selfie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clear Selfie</FormLabel>

                  <FormControl>
                    <div className="bg-background border-2 h-48 border-dashed border-muted/50 rounded-lg p-4 hover:border-primary/50 transition-colors group">
                      {field.value ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={URL.createObjectURL(field.value)}
                            width={200}
                            height={200}
                            alt="Document front preview"
                            className="object-cover rounded-lg w-full h-full"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute opacity-0 group-hover:opacity-100 top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 z-10"
                            onClick={() => {
                              field.onChange(null);
                            }}
                          >
                            <Trash />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4 relative">
                          <Upload className="size-10 text-muted-foreground mb-2" />
                          <p className="text-sm font-medium mb-1">
                            Upload a clear selfie
                          </p>
                          <p className="text-xs text-muted-foreground mb-4">
                            JPG, PNG or PDF (max 5MB)
                          </p>
                          <Input
                            type="file"
                            className="absolute inset-0 z-99 opacity-0 cursor-pointer min-w-full min-h-full"
                            onChange={(e) => {
                              field.onChange(e.target.files?.[0] || null);
                            }}
                          />
                          <Button variant="secondary">Select File</Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Please upload a clear selfie holding your ID document.
                    Ensure your face is visible and the document is legible.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check />
                  Submit for Verification
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
