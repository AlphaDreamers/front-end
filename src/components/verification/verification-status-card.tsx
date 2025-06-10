"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Shield,
  CheckCircle,
  UserCog,
  Phone,
  FileCheck,
  AlertCircle,
  CircleCheck,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { confirmFullVerification } from "@/lib/actions/profile";

interface VerificationStatusCardProps {
  overallProgress: number;
  profileCompletion: number;
  isKycVerified: boolean;
  orderCompletion: number;
  recievedVerification?: boolean;
}

export function VerificationStatusCard({
  overallProgress,
  profileCompletion,
  isKycVerified,
  orderCompletion,
  recievedVerification,
}: VerificationStatusCardProps) {
  const isVerified = overallProgress >= 100;

  const handleApplyForFullVerification = async () =>
    toast.promise(async () => confirmFullVerification(), {
      loading: "Applying for full verification...",
      success: "Verification application submitted successfully!",
      error: "Failed to apply for verification. Please try again.",
    });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-4">
        <CardTitle className="flex items-center justify-between w-full">
          <div className="flex items-center">
            {isVerified ? (
              <CheckCircle className="text-amber-500 mr-2" />
            ) : (
              <Shield className="text-primary mr-2" />
            )}
            Verification Status
          </div>
          <Badge className={cn(isVerified && "bg-amber-500/25 text-amber-400")}>
            {isVerified ? "Verified" : "Partially Verified"}
          </Badge>
        </CardTitle>
        <CardDescription>
          {isVerified
            ? "Congratulations! Your account is fully verified and ready to use."
            : "You're on your way! Complete all requirements for full verification"}
        </CardDescription>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className={cn("text-sm font-bold")}>
              {overallProgress.toFixed(0)}%
            </span>
          </div>

          <Progress value={overallProgress} className="h-3" />
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-6">
        {/* Profile Completion */}
        <VerificationRequirement
          icon={UserCog}
          title="Complete your profile"
          description="Complete your profile information"
          progress={profileCompletion}
          isComplete={profileCompletion >= 100}
          href="/profile/edit"
          hrefLabel="Complete Profile"
          tooltip={"Add a profile picture, bio, and contact information."}
        />

        {/* KYC Verification */}
        <VerificationRequirement
          icon={Phone}
          title="KYC Verification"
          description={"Complete KYC verification"}
          progress={isKycVerified ? 100 : 0}
          isComplete={isKycVerified}
          href="/kyc"
          hrefLabel="Verify Identity"
          tooltip="Complete identity verification to build trust with buyers"
        />

        {/* Order Requirement */}
        <VerificationRequirement
          icon={FileCheck}
          title="Complete orders with positive ratings"
          description={"Complete 5 orders with positive ratings"}
          progress={orderCompletion}
          isComplete={orderCompletion >= 100}
          href="/dashboard/orders"
          hrefLabel="View Orders"
          tooltip={`You need ${
            5 - Math.ceil(orderCompletion / 20)
          } more orders with ratings above 2.5 stars`}
        />
      </CardContent>

      {isVerified && !recievedVerification && (
        <CardFooter>
          <Button onClick={handleApplyForFullVerification} className="w-full">
            Apply for Full Verification
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

interface VerificationRequirementProps {
  icon: LucideIcon;
  isComplete: boolean;
  title: string;
  description: string;
  tooltip: string;
  progress: number;
  href: string;
  hrefLabel: string;
}

function VerificationRequirement({
  icon: Icon,
  title,
  description,
  progress,
  isComplete,
  hrefLabel,
  href,
  tooltip,
}: VerificationRequirementProps) {
  return (
    <div className="flex gap-3">
      {isComplete ? (
        <CircleCheck className="rounded-full border-[1px] border-amber-500/25 p-2 size-10 flex items-center justify-center bg-muted text-amber-500" />
      ) : (
        <Icon className="rounded-full border p-2 size-10 flex items-center justify-center bg-muted text-muted-foreground" />
      )}

      <div className="flex-1 flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm">{title}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="size-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    {tooltip}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-xs text-muted-foreground">{description}</span>
          </div>
          {!isComplete && (
            <Link
              href={href}
              className={cn(
                buttonVariants({
                  size: "sm",
                  variant: "outline",
                  className: "min-w-[150px]",
                })
              )}
            >
              {hrefLabel}
            </Link>
          )}
        </div>

        <div className="flex items-center justify-between gap-6">
          <Progress value={progress} className="h-2 flex-1" />
          <span className="text-xs text-muted-foreground">
            {progress.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton
export function VerificationStatusCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="size-6 rounded" />
            <Skeleton className="h-6 w-40" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-3/4 mt-2" />
      </CardHeader>
      <Separator />
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-10" />
          </div>
          <Skeleton className="h-3 w-full" />
        </div>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-2 w-full ml-[52px]" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
