"use server";

import { PublicKey } from "@solana/web3.js";

import { me } from "./auth";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { DetailedWallet, Transaction } from "../types/wallet";

export const createWallet = async (values: {
  publicKey: string;
  name: string;
}) => {
  const user = await me();

  if (!user?.isVerified) {
    throw new Error("Please verify your email before creating a wallet");
  }

  const { publicKey, name } = values;

  // Validate the public key format
  try {
    new PublicKey(publicKey); // This will throw if invalid
  } catch {
    throw new Error("Invalid wallet address format");
  }

  // Check if wallet already exists
  const existingWallet = await prisma.wallet.findFirst({
    where: {
      OR: [{ publicKey }, { userId: user.id, name }],
    },
  });

  if (existingWallet) {
    if (existingWallet.publicKey === publicKey) {
      throw new Error("This wallet is already registered");
    }
    if (existingWallet.name === name) {
      throw new Error("You already have a wallet with this name");
    }
  }

  // Create the wallet
  await prisma.wallet.create({
    data: {
      publicKey,
      name,
      userId: user.id,
    },
  });
};

export async function setMainWallet(walletId: string) {
  const user = await me();

  if (!user?.isVerified) {
    throw new Error("User not authenticated");
  }

  // Verify the wallet belongs to the user
  const wallet = await prisma.wallet.findFirst({
    where: {
      id: walletId,
      userId: user.id,
    },
  });

  if (!wallet) {
    throw new Error("Wallet not found");
  }

  // Update all wallets: set the selected one as main, others as not main
  await prisma.$transaction([
    // First, set all user's wallets to not main
    prisma.wallet.updateMany({
      where: { userId: user.id },
      data: { isMain: false },
    }),
    // Then set the selected wallet as main
    prisma.wallet.update({
      where: { id: walletId },
      data: { isMain: true },
    }),
  ]);

  revalidatePath("/dashboard/wallets");
}

export async function deleteWallet(walletId: string) {
  const user = await me();

  if (!user?.isVerified) {
    throw new Error("User not authenticated");
  }

  // Verify the wallet belongs to the user and is not main
  const wallet = await prisma.wallet.findFirst({
    where: {
      id: walletId,
      userId: user.id,
    },
  });

  if (!wallet) {
    throw new Error("Wallet not found");
  }

  if (wallet.isMain) {
    throw new Error("Cannot delete main wallet");
  }

  await prisma.wallet.delete({
    where: { id: walletId },
  });

  revalidatePath("/dashboard/wallets");
}

export const getWalletTransactions = async (
  publicKey: string
): Promise<Transaction[]> => {
  /*
  const wallet = await prisma.wallet.findUnique({
    where: { publicKey: publicKey },
    select:{
 publicKey: true,
  name: true,
  isMain: true,
  createdAt:true,
  transactions: {
      select: {
        txId: true,
        amount: true,
        createdAt: true,
        senderPublicKey: true,
        receiverPublicKey: true,
      },
  }
    }
    )
  });

  return {
    publicKey: wallet.publicKey,
    name: wallet.name,
    isMain: wallet.isMain,
    createdAt: wallet.createdAt,
  transactions:transactions.map((tx) => ({
    txId: tx.txId,
    amount: tx.amount,
    date: tx.createdAt,
    senderPublicKey: tx.senderId,
    receiverPublicKey: tx.receiverId,
  }));
  }
  */
  // Placeholder for actual transaction fetching logic
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return [
    {
      txId: "tx123",
      amount: 100,
      date: new Date(),
      senderPublicKey: "senderPublicKey123",
      receiverPublicKey: "receiverPublicKey123",
    },
    {
      txId: "tx456",
      amount: 200,
      date: new Date(),
      senderPublicKey: "senderPublicKey456",
      receiverPublicKey: "receiverPublicKey456",
    },
    {
      txId: "tx789",
      amount: 300,
      date: new Date(),
      senderPublicKey: "senderPublicKey789",
      receiverPublicKey: "receiverPublicKey789",
    },
    {
      txId: "tx101112",
      amount: 400,
      date: new Date(),
      senderPublicKey: "senderPublicKey101112",
      receiverPublicKey: "receiverPublicKey101112",
    },
    {
      txId: "tx131415",
      amount: 500,
      date: new Date(),
      senderPublicKey: "senderPublicKey131415",
      receiverPublicKey: "receiverPublicKey131415",
    },
    {
      txId: "tx161718",
      amount: 600,
      date: new Date(),
      senderPublicKey: "senderPublicKey161718",
      receiverPublicKey: "receiverPublicKey161718",
    },
    {
      txId: "tx192021",
      amount: 700,
      date: new Date(),
      senderPublicKey: "senderPublicKey192021",
      receiverPublicKey: "receiverPublicKey192021",
    },
    {
      txId: "tx222324",
      amount: 800,
      date: new Date(),
      senderPublicKey: "senderPublicKey222324",
      receiverPublicKey: "receiverPublicKey222324",
    },
    {
      txId: "tx252627",
      amount: 900,
      date: new Date(),
      senderPublicKey: "senderPublicKey252627",
      receiverPublicKey: "receiverPublicKey252627",
    },
  ];
};
