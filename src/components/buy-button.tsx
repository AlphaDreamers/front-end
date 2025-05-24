"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface BuyButtonProps {
  recipient: string;
}

const BuyButton = ({ recipient }: BuyButtonProps) => {
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const { sendTransaction } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    const stored = localStorage.getItem("wallet_key");
    if (!stored) {
      console.error("Wallet not found");
      return;
    }

    const { publicKeyBase58 } = JSON.parse(stored);
    setPublicKey(new PublicKey(publicKeyBase58));
  }, []);

  const sendSol = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!publicKey) {
      console.error("Wallet not connected");
      return;
    }

    try {
      const recipientPubKey = new PublicKey(recipient);

      const transaction = new Transaction();
      const sendSolInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPubKey,
        lamports: 0.1 * LAMPORTS_PER_SOL,
      });

      transaction.add(sendSolInstruction);

      const signature = await sendTransaction(transaction, connection);
      console.log(`Transaction signature: ${signature}`);
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };

  return <Button onClick={sendSol}>Buy</Button>;
};

export default BuyButton;
