"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  Keypair,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { toast } from "sonner";
import {
  setMainWallet,
  deleteWallet,
  getWallets,
  getOrderForTransaction,
  confirmTransaction,
} from "@/lib/actions/wallet";
import { decryptPrivateKey } from "@/lib/utils";
import { EncryptedWalletData } from "@/lib/types";
import useSession from "@/hooks/use-session";

// Types (keeping as requested)
export interface Wallet {
  name: string;
  publicKey: string;
  isMain: boolean;
  createdAt: Date;
}

export interface WalletWithBalance extends Wallet {
  balance: number | null;
  status: "idle" | "loading" | "success" | "error";
  error?: string;
  lastFetched?: Date;
}

interface WalletContextValue {
  wallets: WalletWithBalance[];
  mainWallet: WalletWithBalance | null;
  deleteWallet: (publicKey: string) => Promise<void>;
  setMainWallet: (publicKey: string) => Promise<void>;
  performTransaction: (password: string, orderId: string) => Promise<void>;
  refetchBalances: () => Promise<void>;
  getTotalBalance: () => number;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextValue | null>(null);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const {
    session,
    isLoading: sessionLoading,
    error: sessionError,
  } = useSession();
  const [wallets, setWallets] = useState<WalletWithBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !sessionLoading && session?.user?.id && !sessionError;

  // Fetch initial wallets
  useEffect(() => {
    const fetchInitialWallets = async () => {
      if (!isAuthenticated || !session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const wallets = await getWallets();

        setWallets(wallets);
      } catch (error) {
        console.error("Failed to fetch wallets:", error);
        toast.error("Failed to load wallets");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialWallets();
  }, [isAuthenticated, session?.user?.id]);

  const mainWallet = wallets.find((w) => w.isMain) || null;

  const deleteWalletHandler = useCallback(
    async (publicKey: string) => {
      toast.promise(
        async () => {
          const wallet = wallets.find((w) => w.publicKey === publicKey);
          if (!wallet) return;

          if (wallet.isMain) {
            throw new Error(
              "Cannot delete main wallet. Please set another wallet as main first."
            );
          }
          await deleteWallet(publicKey);
        },
        {
          loading: "Deleting wallet...",
          success: () => {
            setWallets((prev) => prev.filter((w) => w.publicKey !== publicKey));
            localStorage.removeItem(`wallet_data_${publicKey}`);
            return "Wallet deleted successfully";
          },
          error: (err) => {
            console.error("Error deleting wallet:", err);
            return "Failed to delete wallet";
          },
        }
      );
    },
    [wallets]
  );

  const setMainWalletHandler = useCallback(
    async (publicKey: string) => {
      toast.promise(
        async () => {
          const wallet = wallets.find((w) => w.publicKey === publicKey);
          if (!wallet) {
            throw new Error("Wallet not found");
          }
          if (wallet.isMain) {
            throw new Error("This wallet is already set as main");
          }
          await setMainWallet(publicKey);
        },
        {
          loading: "Setting main wallet...",
          success: () => {
            setWallets((prev) =>
              prev.map((w) => ({
                ...w,
                isMain: w.publicKey === publicKey,
              }))
            );
            return "Main wallet updated successfully";
          },
          error: "Failed to update main wallet",
        }
      );
    },
    [wallets]
  );
  const refetchBalances = useCallback(async () => {
    setWallets((prevWallets) => {
      const currentWallets = prevWallets.map((w) => ({
        ...w,
        status: "loading" as const,
      }));

      Promise.allSettled(
        prevWallets.map(async (wallet) => {
          try {
            const balance = await connection.getBalance(
              new PublicKey(wallet.publicKey)
            );
            return {
              publicKey: wallet.publicKey,
              balance: balance / LAMPORTS_PER_SOL,
              status: "success" as const,
              lastFetched: new Date(),
            };
          } catch (error) {
            console.error(
              `Failed to fetch balance for wallet ${wallet.publicKey}:`,
              error
            );
            return {
              publicKey: wallet.publicKey,
              status: "error" as const,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to fetch balance",
            };
          }
        })
      ).then((updates) => {
        setWallets((prev) =>
          prev.map((wallet) => {
            const update = updates.find(
              (u) =>
                u.status === "fulfilled" &&
                u.value.publicKey === wallet.publicKey
            );

            if (update && update.status === "fulfilled") {
              return { ...wallet, ...update.value };
            }

            return { ...wallet, status: "error" as const };
          })
        );
      });

      return currentWallets;
    });
  }, [connection]);

  const performTransaction = useCallback(
    async (password: string, orderId: string) => {
      toast.promise(
        async () => {
          if (!mainWallet) {
            throw new Error("No main wallet selected");
          }

          const order = await getOrderForTransaction(orderId);
          if (!order) {
            throw new Error("Order not found");
          }
          order.price = 0.1;

          const recipientPubKey = new PublicKey(order.recipientPublickey);
          const senderPubKey = new PublicKey(mainWallet.publicKey);
          console.log(senderPubKey.toBase58());

          // Check balance and calculate available amount
          const balance = await connection.getBalance(senderPubKey);

          // Get the minimum rent-exempt balance for this account
          const rentExemptBalance =
            await connection.getMinimumBalanceForRentExemption(0);

          // Estimate transaction fee (typically around 5,000 lamports)
          const estimatedFee = 5000;

          // Calculate how much we can actually send
          const availableForTransfer =
            balance - rentExemptBalance - estimatedFee;

          console.log(`Total balance: ${balance / LAMPORTS_PER_SOL} SOL`);
          console.log(
            `Rent requirement: ${rentExemptBalance / LAMPORTS_PER_SOL} SOL`
          );
          console.log(`Estimated fee: ${estimatedFee / LAMPORTS_PER_SOL} SOL`);
          console.log(
            `Available to send: ${availableForTransfer / LAMPORTS_PER_SOL} SOL`
          );

          // Convert your desired amount to lamports
          const requiredSol = order.price; // Use the actual order price
          const requiredLamports = requiredSol * LAMPORTS_PER_SOL;

          // Check if we have enough available funds
          if (availableForTransfer < requiredLamports) {
            toast.error(
              `Insufficient available balance. Need ${requiredSol} SOL, but only ${availableForTransfer / LAMPORTS_PER_SOL} SOL available after rent and fees.`
            );
            return;
          }

          // Get wallet data and decrypt
          const walletData = localStorage.getItem(
            `wallet_data_${mainWallet.publicKey}`
          );
          console.log("FLAG2");
          if (!walletData) {
            throw new Error("Wallet data not found in local storage");
          }
          console.log("FLAG3");

          const decryptedPrivateKey = await decryptPrivateKey(
            JSON.parse(walletData) as EncryptedWalletData,
            password
          );
          console.log("FLAG4");

          // Create and send transaction
          const transaction = new Transaction();
          transaction.add(
            SystemProgram.transfer({
              fromPubkey: senderPubKey,
              toPubkey: recipientPubKey,
              lamports: requiredLamports, // This should now work!
            })
          );
          console.log("FLAG5");
          const { blockhash } = await connection.getLatestBlockhash();
          console.log("FLAG6");
          transaction.recentBlockhash = blockhash;
          console.log("FLAG7");
          transaction.feePayer = senderPubKey;
          console.log("FLAG8");

          const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [Keypair.fromSecretKey(decryptedPrivateKey)]
          );

          console.log("Transaction signature:", signature);
          await confirmTransaction(
            orderId,
            signature,
            order.price,
            order.recipientPublickey,
            mainWallet.publicKey,
            order.sellerId,
            order.buyerId
          );
        },
        {
          loading: "Processing transaction...",
          success: async () => {
            return "Transaction successful!";
          },
          error: (error) => {
            console.error("Transaction error:", error);
            return `Transaction failed: ${error instanceof Error ? error.message : "Unknown error"}`;
          },
        }
      );
    },
    [mainWallet, refetchBalances]
  );

  const getTotalBalance = useCallback(() => {
    return wallets.reduce((total, wallet) => total + (wallet.balance || 0), 0);
  }, [wallets]);

  return (
    <WalletContext.Provider
      value={{
        wallets,
        mainWallet,
        deleteWallet: deleteWalletHandler,
        setMainWallet: setMainWalletHandler,
        performTransaction,
        refetchBalances,
        getTotalBalance,
        isLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallets() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallets must be used within WalletProvider");
  }
  return context;
}
