"use client";

import { useState } from "react";
import WalletCard from "./wallet-card";

interface BaseWallet {
  id: string;
  name: string;
  publicKey: string;
}

interface Wallet extends BaseWallet {
  balance: number;
}

interface WalletListProps {
  wallets: {
    id: string;
    name: string;
    publicKey: string;
  }[];
}

const WalletList = ({ wallets: initialWallets }: WalletListProps) => {
  const [wallets, setWallets] =
    useState<(BaseWallet | Wallet)[]>(initialWallets);

  return wallets.map((wallet) => (
    <WalletCard
      key={wallet.id}
      wallet={wallet}
      onWalletUpdate={(data) => {
        setWallets((prev) =>
          prev.map((w) => (w.id === wallet.id ? { ...w, ...data } : w))
        );
      }}
    />
  ));
};

export default WalletList;
