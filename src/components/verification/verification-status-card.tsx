// src/components/verification/verification-status-card.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
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
  Info,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VerificationStatus } from "@/lib/types/verification";
import {
  getVerificationLevelConfig,
  getProgressColor,
  formatRequirementText,
} from "@/lib/utils/verification";

interface VerificationStatusCardProps {
  status: VerificationStatus;
}

export function VerificationStatusCard({
  status,
}: VerificationStatusCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const verificationConfig = getVerificationLevelConfig(
    status.overallStatus.verificationLevel
  );
  const VerificationIcon = Shield;

  // Calculate overall progress
  const overallProgress = Math.round(
    (status.profileCompletion.percentage +
      (status.kycVerification.isVerified ? 100 : 0) +
      status.orderRequirement.percentage) /
      3
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <VerificationIcon
              className={cn("mr-3", verificationConfig.color)}
            />
            Verification Status
          </div>
          <div
            className={cn(
              "text-sm font-normal px-3 py-1 rounded-full",
              verificationConfig.bgColor,
              verificationConfig.color
            )}
          >
            {verificationConfig.label}
          </div>
        </CardTitle>
        <CardDescription>{verificationConfig.description}</CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-6 pt-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress</span>
            <span
              className={cn(
                "text-sm font-bold",
                getProgressColor(overallProgress)
              )}
            >
              {overallProgress}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>

        {/* Profile Completion */}
        <VerificationRequirement
          icon={UserCog}
          title="Complete your profile"
          description={formatRequirementText("profile", {
            isComplete: status.profileCompletion.isComplete,
          })}
          progress={status.profileCompletion.percentage}
          isComplete={status.profileCompletion.isComplete}
          actionHref="/profile/edit"
          actionLabel="Complete Profile"
          tooltip={
            status.profileCompletion.missingFields.length > 0 && (
              <div>
                <p className="font-medium mb-1">Missing fields:</p>
                <ul className="text-xs space-y-0.5">
                  {status.profileCompletion.missingFields.map((field) => (
                    <li key={field}>• {field}</li>
                  ))}
                </ul>
              </div>
            )
          }
        />

        {/* KYC Verification */}
        <VerificationRequirement
          icon={Phone}
          title="KYC Verification"
          description={formatRequirementText("kyc", {
            isComplete: status.kycVerification.isVerified,
          })}
          progress={status.kycVerification.isVerified ? 100 : 0}
          isComplete={status.kycVerification.isVerified}
          actionHref="/kyc"
          actionLabel="Verify Identity"
          tooltip="Complete identity verification to build trust with buyers"
        />

        {/* Order Requirement */}
        <VerificationRequirement
          icon={FileCheck}
          title="Complete orders with positive ratings"
          description={formatRequirementText("orders", {
            isComplete: status.orderRequirement.isComplete,
            current: status.orderRequirement.completed,
            required: status.orderRequirement.required,
          })}
          progress={status.orderRequirement.percentage}
          isComplete={status.orderRequirement.isComplete}
          actionHref="/dashboard/orders"
          actionLabel="View Orders"
          showActionWhenComplete
          tooltip={`You need ${status.orderRequirement.required - status.orderRequirement.completed} more orders with ratings above 2.5 stars`}
        />

        {/* Additional Information */}
        {showDetails && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Info className="size-4" />
              Why Verification Matters
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Increased visibility in search results</li>
              <li>• Higher buyer trust and conversion rates</li>
              <li>• Access to exclusive features and promotions</li>
              <li>• Priority customer support</li>
            </ul>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full"
        >
          {showDetails ? "Hide" : "Show"} Benefits
        </Button>
      </CardContent>
    </Card>
  );
}

// Individual requirement component
interface VerificationRequirementProps {
  icon: React.ElementType;
  title: string;
  description: string;
  progress: number;
  isComplete: boolean;
  actionHref: string;
  actionLabel: string;
  showActionWhenComplete?: boolean;
  tooltip?: React.ReactNode;
}

function VerificationRequirement({
  icon: Icon,
  title,
  description,
  progress,
  isComplete,
  actionHref,
  actionLabel,
  showActionWhenComplete = false,
  tooltip,
}: VerificationRequirementProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "rounded-full size-10 flex items-center justify-center border transition-colors",
              isComplete
                ? "bg-primary/10 border-primary"
                : "bg-muted border-border"
            )}
          >
            {isComplete ? (
              <CheckCircle size={20} className="text-primary" />
            ) : (
              <Icon size={20} className="text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{title}</span>
              {tooltip && (
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
              )}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>

        {(!isComplete || showActionWhenComplete) && (
          <Link
            href={actionHref}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
              }),
              "whitespace-nowrap"
            )}
          >
            {actionLabel}
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3 pl-[52px]">
        <Progress value={progress} className="h-2 flex-1" />
        <span
          className={cn(
            "text-xs font-medium w-10 text-right",
            getProgressColor(progress)
          )}
        >
          {progress}%
        </span>
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
