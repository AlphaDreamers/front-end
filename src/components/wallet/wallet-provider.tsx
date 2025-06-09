"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { toast } from "sonner";
import { setMainWallet, deleteWallet } from "@/lib/actions/wallet";

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

// State
interface WalletState {
  wallets: WalletWithBalance[];
  isRefreshing: boolean;
  connection: Connection;
}

// Actions
type WalletAction =
  | { type: "SET_WALLETS"; wallets: Wallet[] }
  | {
      type: "UPDATE_WALLET_STATUS";
      publicKey: string;
      status: WalletWithBalance["status"];
      error?: string;
    }
  | { type: "UPDATE_WALLET_BALANCE"; publicKey: string; balance: number }
  | { type: "SET_MAIN_WALLET"; publicKey: string }
  | { type: "DELETE_WALLET"; publicKey: string }
  | { type: "SET_REFRESHING"; isRefreshing: boolean }
  | { type: "ADD_WALLET"; wallet: Wallet };

// Reducer
function walletReducer(state: WalletState, action: WalletAction): WalletState {
  switch (action.type) {
    case "SET_WALLETS":
      return {
        ...state,
        wallets: action.wallets.map((wallet) => ({
          ...wallet,
          balance: null,
          status: "idle",
        })),
      };

    case "UPDATE_WALLET_STATUS":
      return {
        ...state,
        wallets: state.wallets.map((wallet) =>
          wallet.publicKey === action.publicKey
            ? { ...wallet, status: action.status, error: action.error }
            : wallet
        ),
      };

    case "UPDATE_WALLET_BALANCE":
      return {
        ...state,
        wallets: state.wallets.map((wallet) =>
          wallet.publicKey === action.publicKey
            ? {
                ...wallet,
                balance: action.balance,
                status: "success",
                error: undefined,
                lastFetched: new Date(),
              }
            : wallet
        ),
      };

    case "SET_MAIN_WALLET":
      return {
        ...state,
        wallets: state.wallets.map((wallet) => ({
          ...wallet,
          isMain: wallet.publicKey === action.publicKey,
        })),
      };

    case "DELETE_WALLET":
      return {
        ...state,
        wallets: state.wallets.filter(
          (wallet) => wallet.publicKey !== action.publicKey
        ),
      };

    case "SET_REFRESHING":
      return {
        ...state,
        isRefreshing: action.isRefreshing,
      };

    case "ADD_WALLET":
      return {
        ...state,
        wallets: [
          {
            ...action.wallet,
            balance: null,
            status: "idle",
          },
          ...state.wallets,
        ],
      };

    default:
      return state;
  }
}

// Context
interface WalletContextValue {
  wallets: WalletWithBalance[];
  isRefreshing: boolean;
  fetchWalletBalance: (walletId: string) => Promise<void>;
  fetchAllBalances: () => Promise<void>;
  refreshBalances: () => Promise<void>;
  setMainWallet: (walletId: string) => Promise<void>;
  deleteWallet: (walletId: string) => Promise<void>;
  getTotalBalance: () => number;
}

const WalletContext = createContext<WalletContextValue | null>(null);

// Provider component
export function WalletProvider({
  children,
  initialWallets,
}: {
  children: React.ReactNode;
  initialWallets: Wallet[];
}) {
  // Initialize connection once
  const [state, dispatch] = useReducer(walletReducer, {
    wallets: [],
    isRefreshing: false,
    connection: new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com",
      "confirmed"
    ),
  });

  // Set initial wallets
  useEffect(() => {
    dispatch({ type: "SET_WALLETS", wallets: initialWallets });
  }, [initialWallets]);

  // Fetch balance for a single wallet
  const fetchWalletBalance = useCallback(
    async (walletPublicKey: string) => {
      const wallet = state.wallets.find((w) => w.publicKey === walletPublicKey);
      if (!wallet) return;

      dispatch({
        type: "UPDATE_WALLET_STATUS",
        publicKey: walletPublicKey,
        status: "loading",
      });

      try {
        const publicKey = new PublicKey(wallet.publicKey);
        const balanceInLamports = await state.connection.getBalance(publicKey);
        const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL;

        dispatch({
          type: "UPDATE_WALLET_BALANCE",
          publicKey: walletPublicKey,
          balance: balanceInSOL,
        });
      } catch (error) {
        console.error(
          `Failed to fetch balance for wallet ${walletPublicKey}:`,
          error
        );
        dispatch({
          type: "UPDATE_WALLET_STATUS",
          publicKey: walletPublicKey,
          status: "error",
          error:
            error instanceof Error ? error.message : "Failed to fetch balance",
        });
      }
    },
    [state.wallets, state.connection]
  );

  // Fetch all balances in batches for efficiency
  const fetchAllBalances = useCallback(async () => {
    const BATCH_SIZE = 10; // Fetch 10 wallets at a time
    const walletBatches = [];

    for (let i = 0; i < state.wallets.length; i += BATCH_SIZE) {
      walletBatches.push(state.wallets.slice(i, i + BATCH_SIZE));
    }

    for (const batch of walletBatches) {
      await Promise.all(
        batch.map((wallet) => fetchWalletBalance(wallet.publicKey))
      );
    }
  }, [state.wallets, fetchWalletBalance]);

  // Refresh all balances
  const refreshBalances = useCallback(async () => {
    dispatch({ type: "SET_REFRESHING", isRefreshing: true });

    try {
      await fetchAllBalances();
      toast.success("Balances refreshed successfully");
    } catch {
      toast.error("Failed to refresh some balances");
    } finally {
      dispatch({ type: "SET_REFRESHING", isRefreshing: false });
    }
  }, [fetchAllBalances]);

  // Set main wallet
  const handleSetMainWallet = useCallback(
    async (walletId: string) => {
      try {
        // Optimistically update UI
        dispatch({ type: "SET_MAIN_WALLET", publicKey: walletId });

        // Call server action
        await setMainWallet(walletId);

        toast.success("Main wallet updated");
      } catch {
        // Revert on error
        const previousMain = state.wallets.find((w) => w.isMain);
        if (previousMain) {
          dispatch({
            type: "SET_MAIN_WALLET",
            publicKey: previousMain.publicKey,
          });
        }

        toast.error("Failed to update main wallet");
      }
    },
    [state.wallets]
  );

  // Delete wallet
  const handleDeleteWallet = useCallback(
    async (walletId: string) => {
      const wallet = state.wallets.find((w) => w.publicKey === walletId);
      if (!wallet) return;

      if (wallet.isMain) {
        toast.error(
          "Cannot delete main wallet. Please set another wallet as main first."
        );
        return;
      }

      try {
        // Optimistically remove from UI
        dispatch({ type: "DELETE_WALLET", publicKey: walletId });

        // Call server action
        await deleteWallet(walletId);

        toast.success("Wallet deleted successfully");
      } catch {
        // Re-add on error
        dispatch({ type: "ADD_WALLET", wallet });

        toast.error("Failed to delete wallet");
      }
    },
    [state.wallets]
  );

  // Calculate total balance
  const getTotalBalance = useCallback(() => {
    return state.wallets.reduce((total, wallet) => {
      return total + (wallet.balance || 0);
    }, 0);
  }, [state.wallets]);

  // Auto-fetch balances on mount
  useEffect(() => {
    fetchAllBalances();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value: WalletContextValue = {
    wallets: state.wallets,
    isRefreshing: state.isRefreshing,
    fetchWalletBalance,
    fetchAllBalances,
    refreshBalances,
    setMainWallet: handleSetMainWallet,
    deleteWallet: handleDeleteWallet,
    getTotalBalance,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

// Hook to use wallet context
export function useWallets() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallets must be used within WalletProvider");
  }
  return context;
}
