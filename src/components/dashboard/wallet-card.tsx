"use client";

import { useState, useEffect } from "react";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { decode } from "bs58";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Eye, EyeOff, Copy, Check, ShoppingBag, Wallet } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Wallet as WalletIcon } from "lucide-react";

const WalletCard = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{
    address: string;
    balance: number;
    pendingTransactions: number;
  } | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadWallet = async () => {
      try {
        const stored = localStorage.getItem("wallet_key");
        if (!stored) {
          setIsLoading(false);
          return;
        }

        const { secretKeyBase58 } = JSON.parse(stored);
        const secretKeyBytes = decode(secretKeyBase58);
        const keypair = Keypair.fromSecretKey(secretKeyBytes);
        const publicKey = keypair.publicKey;

        const balance = await connection.getBalance(publicKey);

        const signatures = await connection.getSignaturesForAddress(publicKey, {
          limit: 100,
        });

        const signatureStatuses = await connection.getSignatureStatuses(
          signatures.map((sig) => sig.signature)
        );

        const pendingCount = signatureStatuses.value.reduce((count, status) => {
          if (
            !status ||
            (status.confirmationStatus !== "confirmed" &&
              status.confirmationStatus !== "finalized")
          ) {
            return count + 1;
          }
          return count;
        }, 0);

        setData({
          address: publicKey.toBase58(),
          balance: balance / LAMPORTS_PER_SOL,
          pendingTransactions: pendingCount,
        });
      } catch (error) {
        console.error("Failed to load wallet:", error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWallet();
  }, [connection]);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(data.address);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isLoading) {
    return null;
  }

  if (!isLoading && !data) {
    return null;
  }

  return (
    <Card className="lg:w-1/3 bg-gradient-to-br from-primary/25 to-background shadow-lg transition-all hover:shadow-primary/10 hover:border-primary/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center text-lg gap-3 font-semibold">
          <WalletIcon className="size-5" />
          Wallet
        </CardTitle>

        <div>
          <p className="text-sm text-muted-foreground">Available Balance</p>
          <h3 className="text-2xl font-bold">
            {data.balance.toFixed(4)}
            <span className="text-primary ml-1">SOL</span>
          </h3>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">Public Key</p>
        <div className="flex items-center justify-between bg-background rounded-md p-2 text-sm">
          <span className="text-muted-foreground font-mono">
            {isHidden ? "************" : data.address}
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsHidden(!isHidden)}
              className="size-6 m-0 p-0"
            >
              {isHidden ? (
                <EyeOff className="h-3 w-3" />
              ) : (
                <Eye className="h-3 w-3" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={copyAddress}
              className="size-6 m-0 p-0"
            >
              {isCopied ? (
                <Check className="h-3 w-3 text-green-400" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Link
          href="/transactions"
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "sm",
            }),
            "flex-1"
          )}
        >
          <ShoppingBag />
          {data.pendingTransactions} Pending Transactions
        </Link>

        <Link
          href="/wallet"
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "sm",
            }),
            "flex-1"
          )}
        >
          <Wallet />
          Go to Wallet
        </Link>
      </CardFooter>
    </Card>
  );
};
export default WalletCard;
