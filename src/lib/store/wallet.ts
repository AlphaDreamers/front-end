import { create } from "zustand";
import React from "react";
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
  setMainWallet as setMainWalletAction,
  deleteWallet as deleteWalletAction,
  getWallets,
  getOrderForTransaction,
} from "@/lib/actions/wallet";
import { decryptPrivateKey } from "@/lib/utils";
import { EncryptedWalletData } from "@/lib/types";
import { confirmPayment } from "@/lib/actions/wallet";

// Types
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

export interface SolanaPrice {
  usd: number;
  timestamp: number;
  status: "idle" | "loading" | "success" | "error";
  error?: string;
}

interface WalletStore {
  wallets: WalletWithBalance[];
  isLoading: boolean;
  connection: Connection;
  solanaPrice: SolanaPrice;

  // Actions
  loadWallets: () => Promise<void>;
  deleteWallet: (publicKey: string) => Promise<void>;
  setMainWallet: (publicKey: string) => Promise<void>;
  performTransaction: (password: string, orderId: string) => Promise<void>;
  refetchBalances: () => Promise<void>;
  getTotalBalance: () => number;
  fetchSolanaPrice: () => Promise<void>;
  getSolToUsdRate: () => number | null;
  convertSolToUsd: (solAmount: number) => number | null;
  convertUsdToSol: (usdAmount: number) => number | null;
}

const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com",
  "confirmed"
);

// Cache duration: 5 minutes
const PRICE_CACHE_DURATION = 60 * 1000;

export const useWalletStore = create<WalletStore>((set, get) => ({
  wallets: [],
  isLoading: false,
  connection,
  solanaPrice: {
    usd: 0,
    timestamp: 0,
    status: "idle",
  },

  loadWallets: async () => {
    console.log("loadWallets: Function called");
    set({ isLoading: true });
    console.log("loadWallets: Set isLoading to true");
    try {
      console.log("loadWallets: Calling getWallets");
      const wallets = await getWallets();
      console.log("loadWallets: Received wallets", wallets);
      set({ wallets, isLoading: false });
      console.log(
        "loadWallets: Updated state with wallets and isLoading=false"
      );

      // Fetch balances in background
      console.log("loadWallets: Scheduling refetchBalances in 100ms");
      setTimeout(() => {
        console.log("loadWallets: Executing refetchBalances from timeout");
        get().refetchBalances();
      }, 100);
    } catch (error) {
      console.log("loadWallets: Error occurred", error);
      console.error("Failed to load wallets:", error);
      toast.error("Failed to load wallets");
      set({ isLoading: false });
      console.log("loadWallets: Set isLoading to false after error");
    }
  },

  deleteWallet: async (publicKey: string) => {
    console.log("deleteWallet: Function called with publicKey", publicKey);
    const { wallets } = get();
    console.log("deleteWallet: Current wallets", wallets);
    const wallet = wallets.find((w) => w.publicKey === publicKey);
    console.log("deleteWallet: Found wallet", wallet);

    if (!wallet) {
      console.log("deleteWallet: Wallet not found, exiting");
      return;
    }

    if (wallet.isMain) {
      console.log("deleteWallet: Wallet is main, showing error toast");
      toast.error(
        "Cannot delete main wallet. Please set another wallet as main first."
      );
      return;
    }

    console.log("deleteWallet: Starting deletion process with toast.promise");
    toast.promise(
      async () => {
        console.log("deleteWallet: Calling deleteWalletAction");
        await deleteWalletAction(publicKey);
        console.log("deleteWallet: deleteWalletAction completed");
        set((state) => {
          console.log("deleteWallet: Filtering wallets, removing", publicKey);
          return {
            wallets: state.wallets.filter((w) => w.publicKey !== publicKey),
          };
        });
        console.log("deleteWallet: Removing wallet data from localStorage");
        localStorage.removeItem(`wallet_data_${publicKey}`);
        console.log("deleteWallet: Wallet data removed from localStorage");
      },
      {
        loading: "Deleting wallet...",
        success: "Wallet deleted successfully",
        error: "Failed to delete wallet",
      }
    );
  },

  setMainWallet: async (publicKey: string) => {
    console.log("setMainWallet: Function called with publicKey", publicKey);
    const { wallets } = get();
    console.log("setMainWallet: Current wallets", wallets);
    const wallet = wallets.find((w) => w.publicKey === publicKey);
    console.log("setMainWallet: Found wallet", wallet);

    if (!wallet) {
      console.log("setMainWallet: Wallet not found, showing error toast");
      toast.error("Wallet not found");
      return;
    }

    if (wallet.isMain) {
      console.log("setMainWallet: Wallet is already main, showing info toast");
      toast.info("This wallet is already set as main");
      return;
    }

    console.log("setMainWallet: Starting set main process with toast.promise");
    toast.promise(
      async () => {
        console.log("setMainWallet: Calling setMainWalletAction");
        await setMainWalletAction(publicKey);
        console.log("setMainWallet: setMainWalletAction completed");
        set((state) => {
          console.log(
            "setMainWallet: Updating wallets, setting isMain for",
            publicKey
          );
          return {
            wallets: state.wallets.map((w) => ({
              ...w,
              isMain: w.publicKey === publicKey,
            })),
          };
        });
        console.log("setMainWallet: State updated with new main wallet");
      },
      {
        loading: "Setting main wallet...",
        success: "Main wallet updated successfully",
        error: "Failed to update main wallet",
      }
    );
  },

  performTransaction: async (password: string, orderId: string) => {
    console.log("performTransaction: Function called with orderId", orderId);
    const { wallets, connection } = get();
    console.log("performTransaction: Current wallets", wallets);
    const mainWallet = wallets.find((w) => w.isMain);
    console.log("performTransaction: Main wallet", mainWallet);

    if (!mainWallet) {
      console.log("performTransaction: No main wallet, showing error toast");
      toast.error("No main wallet selected");
      return;
    }

    console.log("performTransaction: Starting transaction with toast.promise");
    toast.promise(
      async () => {
        console.log("performTransaction: Fetching order for", orderId);
        const order = await getOrderForTransaction(orderId);
        console.log("performTransaction: Order received", order);
        if (!order) {
          console.log("performTransaction: Order not found, throwing error");
          throw new Error("Order not found");
        }

        // Apply test price in development
        const price = process.env.NODE_ENV === "production" ? order.price : 0.1;
        console.log("performTransaction: Determined price", price);

        const recipientPubKey = new PublicKey(order.recipientPublickey);
        const senderPubKey = new PublicKey(mainWallet.publicKey);
        console.log(
          "performTransaction: Recipient public key",
          recipientPubKey.toBase58()
        );
        console.log(
          "performTransaction: Sender public key",
          senderPubKey.toBase58()
        );

        // Check balance
        console.log("performTransaction: Fetching balance for sender");
        const balance = await connection.getBalance(senderPubKey);
        console.log("performTransaction: Sender balance", balance);
        console.log("performTransaction: Fetching rent exempt balance");
        const rentExemptBalance =
          await connection.getMinimumBalanceForRentExemption(0);
        console.log(
          "performTransaction: Rent exempt balance",
          rentExemptBalance
        );
        const estimatedFee = 5000;
        const availableForTransfer = balance - rentExemptBalance - estimatedFee;
        console.log(
          "performTransaction: Available for transfer",
          availableForTransfer
        );

        const requiredLamports = price * LAMPORTS_PER_SOL;
        console.log("performTransaction: Required lamports", requiredLamports);

        if (availableForTransfer < requiredLamports) {
          console.log(
            "performTransaction: Insufficient balance, throwing error"
          );
          throw new Error(
            `Insufficient balance. Need ${price} SOL, but only ${
              availableForTransfer / LAMPORTS_PER_SOL
            } SOL available after rent and fees.`
          );
        }

        // Get wallet data and decrypt
        console.log(
          "performTransaction: Retrieving wallet data from localStorage"
        );
        const walletData = localStorage.getItem(
          `wallet_data_${mainWallet.publicKey}`
        );
        console.log("performTransaction: Wallet data", walletData);
        if (!walletData) {
          console.log("performTransaction: No wallet data, throwing error");
          throw new Error("Wallet data not found in local storage");
        }

        console.log("performTransaction: Decrypting private key");
        let decryptedPrivateKey: Uint8Array;
        try {
          console.log("performTransaction: Parsing wallet data");
          decryptedPrivateKey = await decryptPrivateKey(
            JSON.parse(walletData) as EncryptedWalletData,
            password
          );
        } catch (error) {
          console.error("performTransaction: Decryption failed", error);
          throw new Error(
            "Failed to decrypt private key. Please check your password."
          );
        }
        console.log("performTransaction: Private key decrypted");

        // Create and send transaction
        console.log("performTransaction: Creating new transaction");
        const transaction = new Transaction();
        console.log("performTransaction: Adding transfer instruction");
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: senderPubKey,
            toPubkey: recipientPubKey,
            lamports: requiredLamports,
          })
        );

        console.log("performTransaction: Fetching latest blockhash");
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = senderPubKey;
        console.log(
          "performTransaction: Transaction prepared with blockhash",
          blockhash
        );

        console.log("performTransaction: Sending and confirming transaction");
        const signature = await sendAndConfirmTransaction(
          connection,
          transaction,
          [Keypair.fromSecretKey(decryptedPrivateKey)]
        );
        console.log("performTransaction: Transaction signature", signature);

        console.log("performTransaction: Confirming payment");
        await confirmPayment({
          orderId,
          txId: signature,
          amount: price,
          receiverPublicKey: order.recipientPublickey,
          senderPublicKey: mainWallet.publicKey,
        });
        console.log("performTransaction: Payment confirmed");

        // Refresh balance after transaction
        console.log("performTransaction: Triggering refetchBalances");
        get().refetchBalances();
      },
      {
        loading: "Processing transaction...",
        success: "Transaction successful!",
        error: (error) =>
          `Transaction failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      }
    );
  },

  refetchBalances: async () => {
    console.log("refetchBalances: Function called");
    const { wallets, connection } = get();
    console.log("refetchBalances: Current wallets", wallets);

    // Set all to loading
    console.log("refetchBalances: Setting all wallets to loading status");
    set((state) => ({
      wallets: state.wallets.map((w) => ({ ...w, status: "loading" as const })),
    }));
    console.log("refetchBalances: Wallets set to loading");

    // Fetch all balances
    console.log("refetchBalances: Starting balance fetch for all wallets");
    const updates = await Promise.allSettled(
      wallets.map(async (wallet) => {
        try {
          console.log(
            "refetchBalances: Fetching balance for",
            wallet.publicKey
          );
          const balance = await connection.getBalance(
            new PublicKey(wallet.publicKey)
          );
          console.log(
            "refetchBalances: Balance fetched for",
            wallet.publicKey,
            balance
          );
          return {
            publicKey: wallet.publicKey,
            balance: balance / LAMPORTS_PER_SOL,
            status: "success" as const,
            lastFetched: new Date(),
          };
        } catch (error) {
          console.log(
            "refetchBalances: Error fetching balance for",
            wallet.publicKey,
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
    );
    console.log("refetchBalances: Balance updates", updates);

    // Apply updates
    console.log("refetchBalances: Applying balance updates to state");
    set((state) => ({
      wallets: state.wallets.map((wallet) => {
        const update = updates.find(
          (u) =>
            u.status === "fulfilled" && u.value.publicKey === wallet.publicKey
        );
        console.log("refetchBalances: Update for", wallet.publicKey, update);

        if (update && update.status === "fulfilled") {
          console.log("refetchBalances: Merging update for", wallet.publicKey);
          return { ...wallet, ...update.value };
        }

        console.log("refetchBalances: No update applied for", wallet.publicKey);
        return wallet;
      }),
    }));
    console.log("refetchBalances: State updated with new balances");
  },

  getTotalBalance: () => {
    console.log("getTotalBalance: Function called");
    const { wallets } = get();
    console.log("getTotalBalance: Current wallets", wallets);
    const total = wallets.reduce(
      (total, wallet) => total + (wallet.balance || 0),
      0
    );
    console.log("getTotalBalance: Calculated total balance", total);
    return total;
  },

  fetchSolanaPrice: async () => {
    console.log("fetchSolanaPrice: Function called");
    const { solanaPrice } = get();

    // Check if we have recent data (within cache duration)
    const now = Date.now();
    const isStale = now - solanaPrice.timestamp > PRICE_CACHE_DURATION;

    if (!isStale && solanaPrice.status === "success") {
      console.log("fetchSolanaPrice: Using cached price data");
      return;
    }

    console.log("fetchSolanaPrice: Fetching fresh price data");
    set((state) => ({
      solanaPrice: { ...state.solanaPrice, status: "loading" },
    }));

    try {
      // Using CoinGecko API as primary source
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const price = data.solana?.usd;

      if (typeof price !== "number") {
        throw new Error("Invalid price data received");
      }

      console.log("fetchSolanaPrice: Price fetched successfully", price);
      set({
        solanaPrice: {
          usd: price,
          timestamp: now,
          status: "success",
        },
      });
    } catch (error) {
      console.error("fetchSolanaPrice: Error fetching price", error);

      // Fallback to alternative API
      try {
        console.log("fetchSolanaPrice: Trying fallback API");
        const fallbackResponse = await fetch(
          "https://api.coinbase.com/v2/exchange-rates?currency=SOL"
        );

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const fallbackPrice = parseFloat(fallbackData.data?.rates?.USD);

          if (!isNaN(fallbackPrice)) {
            console.log(
              "fetchSolanaPrice: Fallback price fetched",
              fallbackPrice
            );
            set({
              solanaPrice: {
                usd: fallbackPrice,
                timestamp: now,
                status: "success",
              },
            });
            return;
          }
        }
      } catch (fallbackError) {
        console.error(
          "fetchSolanaPrice: Fallback API also failed",
          fallbackError
        );
      }

      // If all APIs fail
      set((state) => ({
        solanaPrice: {
          ...state.solanaPrice,
          status: "error",
          error:
            error instanceof Error ? error.message : "Failed to fetch price",
        },
      }));
    }
  },

  getSolToUsdRate: () => {
    console.log("getSolToUsdRate: Function called");
    const { solanaPrice } = get();

    if (solanaPrice.status === "success" && solanaPrice.usd > 0) {
      console.log("getSolToUsdRate: Returning rate", solanaPrice.usd);
      return solanaPrice.usd;
    }

    console.log("getSolToUsdRate: No valid rate available");
    return null;
  },

  convertSolToUsd: (solAmount: number) => {
    console.log("convertSolToUsd: Function called with", solAmount);
    const rate = get().getSolToUsdRate();

    if (rate === null) {
      console.log("convertSolToUsd: No rate available");
      return null;
    }

    const usdAmount = solAmount * rate;
    console.log(
      "convertSolToUsd: Converted",
      solAmount,
      "SOL to",
      usdAmount,
      "USD"
    );
    return usdAmount;
  },

  convertUsdToSol: (usdAmount: number) => {
    console.log("convertUsdToSol: Function called with", usdAmount);
    const rate = get().getSolToUsdRate();

    if (rate === null) {
      console.log("convertUsdToSol: No rate available");
      return null;
    }

    const solAmount = usdAmount / rate;
    console.log(
      "convertUsdToSol: Converted",
      usdAmount,
      "USD to",
      solAmount,
      "SOL"
    );
    return solAmount;
  },
}));

// Simple hook that auto-loads on mount
export function useWallets() {
  const store = useWalletStore();
  const { wallets, isLoading, loadWallets, fetchSolanaPrice } = store;
  console.log("useWallets: Hook initialized", { wallets, isLoading });

  // Load wallets on mount if not loaded
  React.useEffect(() => {
    console.log("useWallets: useEffect triggered");
    console.log("useWallets: Checking wallets length and isLoading", {
      length: wallets.length,
      isLoading,
    });
    if (wallets.length === 0 && !isLoading) {
      console.log("useWallets: Calling loadWallets");
      loadWallets();
    } else {
      console.log("useWallets: No need to load wallets");
    }

    // Fetch SOL price on mount
    console.log("useWallets: Fetching Solana price");
    fetchSolanaPrice();

    // Set up periodic price fetching every 5 minutes
    console.log("useWallets: Setting up periodic price refresh");
    const priceInterval = setInterval(() => {
      console.log("useWallets: Periodic price refresh triggered");
      fetchSolanaPrice();
    }, PRICE_CACHE_DURATION); // 5 minutes

    // Cleanup interval on unmount
    return () => {
      console.log("useWallets: Cleaning up price refresh interval");
      clearInterval(priceInterval);
    };
  }, [fetchSolanaPrice]);

  console.log("useWallets: Returning store values and methods");
  return {
    wallets,
    mainWallet: wallets.find((w) => w.isMain) || null,
    isLoading,
    deleteWallet: store.deleteWallet,
    setMainWallet: store.setMainWallet,
    performTransaction: store.performTransaction,
    refetchBalances: store.refetchBalances,
    getTotalBalance: store.getTotalBalance,
    fetchSolanaPrice: store.fetchSolanaPrice,
    getSolToUsdRate: store.getSolToUsdRate,
    convertSolToUsd: store.convertSolToUsd,
    convertUsdToSol: store.convertUsdToSol,
    solanaPrice: store.solanaPrice,
  };
}
