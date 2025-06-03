"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

import WalletHeader from "@/components/wallet/wallet-header";
import TransactionsTab from "@/components/wallet/transactions-tab";
import DepositTab from "@/components/wallet/deposit-tab";
import WithdrawTab from "@/components/wallet/withdraw-tab";
import SecurityTab from "@/components/wallet/security-tab";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { decode } from "bs58";

export default function WalletPage() {
  const { push } = useRouter();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    const loadWallet = async () => {
      try {
        const stored = localStorage.getItem("wallet_key");
        if (!stored) {
          push("/add-wallet?callback-url=/wallet");
          return;
        }

        const { secretKeyBase58 } = JSON.parse(stored);
        const secretKeyBytes = decode(secretKeyBase58);
        const keypair = Keypair.fromSecretKey(secretKeyBytes);
        const publicKey = keypair.publicKey;

        console.log("Wallet address:", publicKey.toBase58());
        console.log("Network:", connection.rpcEndpoint);

        const balance = await connection.getBalance(publicKey);
        console.log("Balance (SOL):", balance / 1_000_000_000);

        setWalletAddress(publicKey.toBase58());
        setWalletBalance(balance);
      } catch (error) {
        console.error("Failed to load wallet:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWallet();
  }, [connection, push]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md bg-gradient-to-b from-purple-900/40 to-black border-primary/20">
          <CardContent className="pt-6 flex flex-col items-center justify-center space-y-4">
            <div className="animate-pulse flex flex-col items-center space-y-4 w-full">
              <div className="h-8 bg-primary/20 rounded w-3/4"></div>
              <div className="h-4 bg-primary/20 rounded w-full"></div>
              <div className="h-4 bg-primary/20 rounded w-5/6"></div>
              <div className="h-10 bg-primary/20 rounded w-full"></div>
              <div className="h-10 bg-primary/20 rounded w-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 animate-fadeIn">
      <div className="max-w-4xl mx-auto space-y-6">
        <WalletHeader
          address={walletAddress}
          balance={walletBalance / LAMPORTS_PER_SOL}
        />

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="animate-fadeIn">
            <TransactionsTab />
          </TabsContent>

          <TabsContent value="deposit" className="animate-fadeIn">
            <DepositTab address={walletAddress} />
          </TabsContent>

          <TabsContent value="withdraw" className="animate-fadeIn">
            <WithdrawTab balance={walletBalance} />
          </TabsContent>

          <TabsContent value="security" className="animate-fadeIn">
            <SecurityTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
