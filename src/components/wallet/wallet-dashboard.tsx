"use client";

import { Plus, RefreshCw, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWallets } from "./wallet-provider";
import WalletCard from "./wallet-card";
import WalletSkeleton from "./wallet-skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function WalletDashboard() {
  const { wallets, isLoading, refetchBalances, getTotalBalance } = useWallets();

  const totalBalance = getTotalBalance();
  const mainWallet = wallets.find((w) => w.isMain);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Wallets</h1>
          <p className="text-muted-foreground mt-1">
            Manage your Solana wallets and track balances
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={refetchBalances}
            disabled={isLoading}
          >
            <RefreshCw
              className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")}
            />
            Refresh
          </Button>

          <Link
            href="/dashboard/wallets/create"
            className={cn(buttonVariants())}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Wallet
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBalance.toFixed(4)} SOL
            </div>
            <p className="text-xs text-muted-foreground">
              Across {wallets.length} wallet{wallets.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Main Wallet</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mainWallet?.name || "Not Set"}
            </div>
            <p className="text-xs text-muted-foreground">
              {mainWallet
                ? `${(mainWallet.balance || 0).toFixed(4)} SOL`
                : "No main wallet selected"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Wallets
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {wallets.filter((w) => (w.balance || 0) > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Wallets with balance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wallets.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No wallets yet</CardTitle>
              <CardDescription className="text-center mb-4">
                Create your first wallet to start managing your Solana assets
              </CardDescription>
              <Link
                href="/dashboard/wallets/create"
                className={cn(buttonVariants())}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Wallet
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {wallets.map((wallet) => (
              <WalletCard key={wallet.publicKey} wallet={wallet} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
