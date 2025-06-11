"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-foreground">Access Restricted</CardTitle>
          <CardDescription className="text-muted-foreground">
            We encountered an issue with your request
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-foreground">
              Reviews can only be left for completed orders
            </AlertDescription>
          </Alert>

          <p className="text-sm text-muted-foreground text-center">
            Please ensure your order is completed before attempting to leave a
            review.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button
            onClick={() => router.back()}
            variant="default"
            className="w-full"
          >
            <ArrowLeft />
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
