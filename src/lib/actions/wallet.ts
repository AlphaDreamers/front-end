"use server";

import { me } from "./auth";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { WalletWithBalance } from "@/components/wallet/wallet-provider";
import { Transaction } from "../types";

export const createWallet = async (publicKey: string, name: string) => {
  const { user } = await me();

  if (!user?.isVerified) {
    throw new Error("Please verify your email before creating a wallet");
  }

  const existingWallets = await prisma.wallet.findMany({
    where: {
      userId: user.id,
    },
  });

  const existingWallet = existingWallets.find(
    (wallet) => wallet.publicKey === publicKey || wallet.name === name
  );

  if (existingWallet) {
    if (existingWallet.publicKey === publicKey) {
      throw new Error("This wallet is already registered");
    }
    if (existingWallet.name === name) {
      throw new Error("You already have a wallet with this name");
    }
  }

  await prisma.wallet.create({
    data: {
      publicKey,
      name,
      userId: user.id,
      isMain: existingWallets.length === 0,
    },
  });
};

export async function setMainWallet(walletId: string) {
  const { user } = await me();

  if (!user?.isVerified) {
    throw new Error("User not authenticated");
  }

  const wallet = await prisma.wallet.findFirst({
    where: {
      publicKey: walletId,
      userId: user.id,
    },
  });

  if (!wallet) {
    throw new Error("Wallet not found");
  }

  await prisma.$transaction([
    // First, set all user's wallets to not main
    prisma.wallet.updateMany({
      where: { userId: user.id },
      data: { isMain: false },
    }),
    // Then set the selected wallet as main
    prisma.wallet.update({
      where: { publicKey: walletId },
      data: { isMain: true },
    }),
  ]);

  revalidatePath("/dashboard/wallets");
}

export async function deleteWallet(walletId: string) {
  const { user } = await me();

  if (!user?.isVerified) {
    throw new Error("User not authenticated");
  }

  // Verify the wallet belongs to the user and is not main
  const wallet = await prisma.wallet.findFirst({
    where: {
      publicKey: walletId,
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
    where: { publicKey: walletId },
  });

  revalidatePath("/dashboard/wallets");
}

export const getWalletTransactions = async (
  publicKey: string
): Promise<Transaction[]> => {
  const wallet = await prisma.wallet.findUnique({
    where: { publicKey: publicKey },
    select: {
      publicKey: true,
      name: true,
      isMain: true,
      createdAt: true,
      transactionsReceiver: {
        select: {
          txId: true,
          amount: true,
          createdAt: true,
          senderPublicKey: true,
          receiverPublicKey: true,
        },
      },
      transactionsSender: {
        select: {
          txId: true,
          amount: true,
          createdAt: true,
          senderPublicKey: true,
          receiverPublicKey: true,
        },
      },
    },
  });

  if (!wallet) {
    throw new Error("Wallet not found");
  }

  return [
    ...wallet.transactionsReceiver.map((tx) => ({
      txId: tx.txId,
      amount: tx.amount,
      date: tx.createdAt,
      senderPublicKey: tx.senderPublicKey,
      receiverPublicKey: tx.receiverPublicKey,
    })),
    ...wallet.transactionsSender.map((tx) => ({
      txId: tx.txId,
      amount: tx.amount,
      date: tx.createdAt,
      senderPublicKey: tx.senderPublicKey,
      receiverPublicKey: tx.receiverPublicKey,
    })),
  ];
};

export const getWallets = async (): Promise<WalletWithBalance[]> => {
  const { user } = await me();
  if (!user?.isVerified) {
    return [];
  }

  const wallets = await prisma.wallet.findMany({
    where: { userId: user.id },
    orderBy: [{ isMain: "desc" }, { createdAt: "desc" }],
    select: {
      name: true,
      publicKey: true,
      isMain: true,
      createdAt: true,
    },
  });

  return wallets.map((wallet) => ({
    ...wallet,
    balance: 0,
    status: "idle",
  }));
};

export const getOrderForTransaction = async (orderId: string) => {
  const { user } = await me();
  if (!user?.isVerified) {
    throw new Error("User not authenticated");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId, buyerId: user.id },
    select: {
      sellerId: true,
      buyer: { select: { id: true } },
      seller: {
        select: {
          wallets: {
            where: {
              isMain: true,
            },
            select: {
              publicKey: true,
            },
          },
        },
      },
      package: { select: { price: true } },
    },
  });

  if (!order || order.seller.wallets.length === 0) {
    return null;
  }
  console.log(order.seller.wallets[0].publicKey);
  return {
    recipientPublickey: order.seller.wallets[0].publicKey,
    price: order.package.price,
    sellerId: order.sellerId,
    buyerId: order.buyer.id,
  };
};

export const confirmTransaction = async (
  orderId: string,
  signature: string,
  amount: number,
  recipientPublicKey: string,
  senderPublicKey: string,
  sellerId: string,
  buyerId: string
) => {
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "IN_PROGRESS",
      transaction: {
        create: {
          txId: signature,
          amount,
          senderPublicKey: senderPublicKey,
          receiverPublicKey: recipientPublicKey,
        },
      },
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        recipientId: sellerId,
        type: "PAYMENT",
        title: "Payment Received",
        description: `You have received a payment of ${amount} SOL for order #${orderId}.`,
      },
      {
        recipientId: buyerId,
        type: "PAYMENT",
        title: "Payment Sent",
        description: `You have sent a payment of ${amount} SOL for order #${orderId}.`,
      },
    ],
  });
};
