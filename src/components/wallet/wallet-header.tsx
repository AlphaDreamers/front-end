"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Eye, EyeOff, RefreshCw, LogOut } from "lucide-react";
import { toast } from "sonner";

interface WalletHeaderProps {
  address: string;
  balance: number;
}

export default function WalletHeader({ address, balance }: WalletHeaderProps) {
  const [hideBalance, setHideBalance] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast.success(
      JSON.stringify({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);

    // Simulate balance refresh
    setTimeout(() => {
      setRefreshing(false);
      toast.success(
        JSON.stringify({
          title: "Balance Updated",
          description: "Your wallet balance has been refreshed",
        })
      );
    }, 1500);
  };

  return (
    <Card className="bg-gradient-to-r from-purple-900/40 to-black border-primary/20">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium text-muted-foreground">
                Wallet Address
              </h2>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 rounded-full hover:bg-primary/20"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="font-mono text-sm md:text-base">{address}</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 rounded-full hover:bg-primary/20"
                onClick={() => setHideBalance(!hideBalance)}
              >
                {hideBalance ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className={`h-8 w-8 p-0 rounded-full hover:bg-primary/20 ${refreshing ? "animate-spin" : ""}`}
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 rounded-full hover:bg-red-500/20 text-red-400 hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-baseline gap-2">
              <h3 className="text-lg font-medium text-muted-foreground">
                Balance
              </h3>
              <p className="text-2xl font-bold">
                {hideBalance ? "••••••" : balance.toFixed(2)}{" "}
                <span className="text-primary">SOL</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
