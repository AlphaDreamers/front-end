"use server";

import { PublicKey } from "@solana/web3.js";

import { me } from "./auth";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

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
