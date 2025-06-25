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
} from "@/lib/actions/wallets";
import { decryptPrivateKey } from "@/lib/utils";
import { confirmPayment } from "@/lib/actions/wallets";

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
  //TODO: Implement solanaPrice fetching and conversion methods

  loadWallets: async () => {
    set({ isLoading: true });

    try {
      const res = await getWallets();
      if (res.success === false) {
        throw new Error(res.error || "Failed to load wallets");
      }
      const wallets = res.data;

      set({ wallets, isLoading: false });

      // Fetch balances in background

      setTimeout(() => {
        get().refetchBalances();
      }, 100);
    } catch {
      toast.error("Failed to load wallets");
      set({ isLoading: false });
    }
  },

  deleteWallet: async (publicKey: string) => {
    const { wallets } = get();

    const wallet = wallets.find((w) => w.publicKey === publicKey);

    if (!wallet) {
      return;
    }

    if (wallet.isMain) {
      return;
    }

    toast.promise(
      async () => {
        const res = await deleteWalletAction(publicKey);
        if (res.success === false) {
          throw new Error(res.error || "Failed to delete wallet");
        }

        set((state) => {
          return {
            wallets: state.wallets.filter((w) => w.publicKey !== publicKey),
          };
        });

        localStorage.removeItem(`wallet_data_${publicKey}`);
      },
      {
        loading: "Deleting wallet...",
        success: "Wallet deleted successfully",
        error: "Failed to delete wallet",
      }
    );
  },

  setMainWallet: async (publicKey: string) => {
    const { wallets } = get();

    const wallet = wallets.find((w) => w.publicKey === publicKey);

    if (!wallet) {
      toast.error("Wallet not found");
      return;
    }

    if (wallet.isMain) {
      toast.info("This wallet is already set as main");
      return;
    }

    toast.promise(
      async () => {
        const res = await setMainWalletAction(publicKey);
        if (res.success === false) {
          throw new Error(res.error || "Failed to set main wallet");
        }

        set((state) => {
          return {
            wallets: state.wallets.map((w) => ({
              ...w,
              isMain: w.publicKey === publicKey,
            })),
          };
        });
      },
      {
        loading: "Setting main wallet...",
        success: "Main wallet updated successfully",
        error: "Failed to update main wallet",
      }
    );
  },

  performTransaction: async (password: string, orderId: string) => {
    const { wallets, connection } = get();

    const mainWallet = wallets.find((w) => w.isMain);

    if (!mainWallet) {
      throw new Error(
        "No main wallet set. Please set a main wallet before proceeding."
      );
      return;
    }

    const res = await getOrderForTransaction(orderId);
    if (res.success === false) {
      throw new Error(res.error || "Failed to fetch order details");
    }
    const order = res.data;

    if (!order) {
      throw new Error("Order not found");
    }

    // Apply test price in development
    const price = process.env.NODE_ENV === "production" ? order.price : 0.1;

    const recipientPubKey = new PublicKey(order.recipientPublickey);
    const senderPubKey = new PublicKey(mainWallet.publicKey);

    // Check balance

    const balance = await connection.getBalance(senderPubKey);

    const rentExemptBalance =
      await connection.getMinimumBalanceForRentExemption(0);

    const estimatedFee = 5000;
    const availableForTransfer = balance - rentExemptBalance - estimatedFee;

    const requiredLamports = price * LAMPORTS_PER_SOL;

    if (availableForTransfer < requiredLamports) {
      throw new Error(
        `Insufficient balance. Need ${price} SOL, but only ${
          availableForTransfer / LAMPORTS_PER_SOL
        } SOL available after rent and fees.`
      );
    }

    // Get wallet data and decrypt

    const walletData = localStorage.getItem(
      `wallet_data_${mainWallet.publicKey}`
    );

    if (!walletData) {
      throw new Error("Wallet data not found in local storage");
    }

    let decryptedPrivateKey: Uint8Array;
    try {
      decryptedPrivateKey = await decryptPrivateKey(
        JSON.parse(walletData),
        password
      );
    } catch (error) {
      console.error("performTransaction: Decryption failed", error);
      throw new Error(
        "Failed to decrypt private key. Please check your password."
      );
    }

    // Create and send transaction

    const transaction = new Transaction();

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: senderPubKey,
        toPubkey: recipientPubKey,
        lamports: requiredLamports,
      })
    );

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = senderPubKey;

    const signature = await sendAndConfirmTransaction(connection, transaction, [
      Keypair.fromSecretKey(decryptedPrivateKey),
    ]);

    await confirmPayment({
      orderId,
      txId: signature,
      amount: price,
      receiverPublicKey: order.recipientPublickey,
      senderPublicKey: mainWallet.publicKey,
    });

    // Refresh balance after transaction

    get().refetchBalances();
  },

  refetchBalances: async () => {
    const { wallets, connection } = get();

    // Set all to loading

    set((state) => ({
      wallets: state.wallets.map((w) => ({ ...w, status: "loading" })),
    }));

    // Fetch all balances

    const updates = await Promise.allSettled(
      wallets.map(async (wallet) => {
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
    set((state) => ({
      wallets: state.wallets.map((wallet) => {
        const update = updates.find(
          (u) =>
            u.status === "fulfilled" && u.value.publicKey === wallet.publicKey
        );

        if (update && update.status === "fulfilled") {
          return { ...wallet, ...update.value };
        }

        return wallet;
      }),
    }));
  },

  getTotalBalance: () => {
    const { wallets } = get();

    const total = wallets.reduce(
      (total, wallet) => total + (wallet.balance || 0),
      0
    );

    return total;
  },

  fetchSolanaPrice: async () => {
    const { solanaPrice } = get();

    // Check if we have recent data (within cache duration)
    const now = Date.now();
    const isStale = now - solanaPrice.timestamp > PRICE_CACHE_DURATION;

    if (!isStale && solanaPrice.status === "success") {
      return;
    }

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
        const fallbackResponse = await fetch(
          "https://api.coinbase.com/v2/exchange-rates?currency=SOL"
        );

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const fallbackPrice = parseFloat(fallbackData.data?.rates?.USD);

          if (!isNaN(fallbackPrice)) {
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
    const { solanaPrice } = get();

    if (solanaPrice.status === "success" && solanaPrice.usd > 0) {
      return solanaPrice.usd;
    }

    return null;
  },

  convertSolToUsd: (solAmount: number) => {
    const rate = get().getSolToUsdRate();

    if (rate === null) {
      return null;
    }

    const usdAmount = solAmount * rate;

    return usdAmount;
  },

  convertUsdToSol: (usdAmount: number) => {
    const rate = get().getSolToUsdRate();

    if (rate === null) {
      return null;
    }

    const solAmount = usdAmount / rate;

    return solAmount;
  },
}));

// Simple hook that auto-loads on mount
export function useWallets() {
  const store = useWalletStore();
  const { wallets, isLoading, loadWallets, fetchSolanaPrice } = store;

  // Load wallets on mount if not loaded
  React.useEffect(() => {
    if (wallets.length === 0 && !isLoading) {
      loadWallets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallets.length, isLoading]); // Only depend on stable values

  // Separate effect for price fetching to prevent loops
  React.useEffect(() => {
    fetchSolanaPrice();

    const priceInterval = setInterval(() => {
      fetchSolanaPrice();
    }, PRICE_CACHE_DURATION);

    return () => {
      clearInterval(priceInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // No dependencies - only run once on mount

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
