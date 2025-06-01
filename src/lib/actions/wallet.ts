"use server";

import { PublicKey } from "@solana/web3.js";

import { me } from "./auth";
import { prisma } from "../prisma";

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
