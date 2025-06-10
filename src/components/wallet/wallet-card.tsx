"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  Key,
  Star,
  Trash2,
  WalletIcon,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWallets, WalletWithBalance } from "./wallet-provider";
import HiddenField from "@/components/hidden-field";

interface WalletCardProps {
  wallet: WalletWithBalance;
}

export default function WalletCard({ wallet }: WalletCardProps) {
  const { setMainWallet, deleteWallet } = useWallets();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingMain, setIsSettingMain] = useState(false);

  const handleSetMain = async () => {
    setIsSettingMain(true);
    try {
      await setMainWallet(wallet.publicKey);
    } finally {
      setIsSettingMain(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteWallet(wallet.publicKey);
    } finally {
      setIsDeleting(false);
    }
  };

  // Determine card styling based on state
  const cardClassName = cn(
    "relative overflow-hidden transition-all duration-300",
    wallet.isMain && "ring-2 ring-primary",
    wallet.status === "error" && "border-destructive/50"
  );

  return (
    <Card className={cardClassName}>
      {/* Main wallet badge */}
      {wallet.isMain && (
        <div className="absolute top-0 right-0 m-4">
          <Badge variant="default">
            <Star className="h-3 w-3 mr-1" />
            Main
          </Badge>
        </div>
      )}

      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <WalletIcon className="h-5 w-5" />
          {wallet.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Balance Display */}
        <div className="text-center py-4 rounded-lg border bg-card">
          {wallet.status === "loading" ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : wallet.status === "error" ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center text-destructive">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="text-sm">Failed to load balance</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log("Retrying...")}
                className="text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-1">
                Available Balance
              </p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-3xl font-bold">
                  {(wallet.balance || 0).toFixed(4)}
                </span>
                <span className="text-lg font-semibold text-muted-foreground">
                  SOL
                </span>
              </div>
              {wallet.lastFetched && (
                <p className="text-xs text-muted-foreground mt-2">
                  Updated {new Date(wallet.lastFetched).toLocaleTimeString()}
                </p>
              )}
            </>
          )}
        </div>

        {/* Public Key */}
        <HiddenField
          variant={4}
          value={wallet.publicKey}
          label="Public Key"
          icon={Key}
        />
      </CardContent>

      <CardFooter className="gap-2">
        <Link
          href={`/dashboard/wallets/${wallet.publicKey}`}
          className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
        >
          <Eye className="h-4 w-4 mr-2" />
          Details
        </Link>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={wallet.isMain ? "secondary" : "default"}
                disabled={wallet.isMain || isSettingMain}
                onClick={handleSetMain}
                className="flex-1"
              >
                {isSettingMain ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Star
                    className={cn(
                      "h-4 w-4 mr-2",
                      wallet.isMain && "fill-current"
                    )}
                  />
                )}
                {wallet.isMain ? "Main" : "Set Main"}
              </Button>
            </TooltipTrigger>
            {wallet.isMain && (
              <TooltipContent>
                <p>This is already your main wallet</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              disabled={wallet.isMain || isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Wallet</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &ldquo;{wallet.name}&ldquo;?
                This action cannot be undone. Make sure you have backed up your
                private keys if needed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className={buttonVariants({ variant: "destructive" })}
              >
                Delete Wallet
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
