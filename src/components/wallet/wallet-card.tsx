"use client";

import { useEffect } from "react";

interface BaseWallet {
  id: string;
  name: string;
  publicKey: string;
}

interface Wallet extends BaseWallet {
  balance: number;
}

interface WalletCardProps {
  wallet: BaseWallet | Wallet;
  onWalletUpdate: (data: Omit<Wallet, keyof BaseWallet>) => void;
}

const WalletCard = ({ wallet, onWalletUpdate }: WalletCardProps) => {
  //extract data needed for the onWalletUpdate function

  useEffect(() => {});

  return <div>Enter</div>;
};

export default WalletCard;
