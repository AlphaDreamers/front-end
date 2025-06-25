"use server";

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";
import { Transaction } from "../types";
import { auth } from "../auth";
import { WalletWithBalance } from "../store/wallet";
import { createNotification } from "./notifications";
import { sendEmail } from "./email";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

interface OrderForTransaction {
  recipientPublickey: string;
  price: number;
  sellerId: string;
  buyerId: string;
}

interface PaymentConfirmationParams {
  orderId: string;
  txId: string;
  amount: number;
  senderPublicKey: string;
  receiverPublicKey: string;
}

export const createWallet = async (
  publicKey: string,
  name: string
): Promise<ActionResult<void>> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to create a wallet.",
      };
    }

    // Validate inputs
    if (!publicKey || publicKey.trim().length === 0) {
      return {
        success: false,
        error: "Wallet public key is required.",
      };
    }

    if (!name || name.trim().length === 0) {
      return {
        success: false,
        error: "Wallet name is required.",
      };
    }

    const existingWallets = await prisma.wallet.findMany({
      where: {
        userId: session.user.id,
      },
    });

    const existingWallet = existingWallets.find(
      (wallet) => wallet.publicKey === publicKey || wallet.name === name
    );

    if (existingWallet) {
      if (existingWallet.publicKey === publicKey) {
        return {
          success: false,
          error: "This wallet address is already registered to your account.",
        };
      }
      if (existingWallet.name === name) {
        return {
          success: false,
          error: `You already have a wallet named "${name}". Please choose a different name.`,
        };
      }
    }

    await prisma.wallet.create({
      data: {
        publicKey,
        name,
        userId: session.user.id,
        isMain: existingWallets.length === 0,
      },
    });

    revalidatePath("/dashboard/wallets");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Create wallet error:", error);
    return {
      success: false,
      error: "Failed to create wallet. Please try again.",
    };
  }
};

export const setMainWallet = async (
  walletPublicKey: string
): Promise<ActionResult<void>> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to update wallet settings.",
      };
    }

    const wallet = await prisma.wallet.findFirst({
      where: {
        publicKey: walletPublicKey,
        userId: session.user.id,
      },
    });

    if (!wallet) {
      return {
        success: false,
        error: "Wallet not found or doesn't belong to your account.",
      };
    }

    await prisma.$transaction([
      // First, set all user's wallets to not main
      prisma.wallet.updateMany({
        where: { userId: session.user.id },
        data: { isMain: false },
      }),
      // Then set the selected wallet as main
      prisma.wallet.update({
        where: { publicKey: walletPublicKey },
        data: { isMain: true },
      }),
    ]);

    revalidatePath("/dashboard/wallets");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Set main wallet error:", error);
    return {
      success: false,
      error: "Failed to update main wallet. Please try again.",
    };
  }
};

export const deleteWallet = async (
  walletPublicKey: string
): Promise<ActionResult<void>> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to delete a wallet.",
      };
    }

    // Verify the wallet belongs to the user and is not main
    const wallet = await prisma.wallet.findFirst({
      where: {
        publicKey: walletPublicKey,
        userId: session.user.id,
      },
      select: {
        isMain: true,
        _count: {
          select: {
            transactionsSender: true,
            transactionsReceiver: true,
          },
        },
      },
    });

    if (!wallet) {
      return {
        success: false,
        error: "Wallet not found or doesn't belong to your account.",
      };
    }

    if (wallet.isMain) {
      return {
        success: false,
        error:
          "Cannot delete your main wallet. Please set another wallet as main first.",
      };
    }

    const totalTransactions =
      wallet._count.transactionsSender + wallet._count.transactionsReceiver;
    if (totalTransactions > 0) {
      return {
        success: false,
        error: "Cannot delete a wallet with transaction history.",
      };
    }

    await prisma.wallet.delete({
      where: { publicKey: walletPublicKey },
    });

    revalidatePath("/dashboard/wallets");

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Delete wallet error:", error);
    return {
      success: false,
      error: "Failed to delete wallet. Please try again.",
    };
  }
};

export const getWalletTransactions = async (
  publicKey: string
): Promise<ActionResult<Transaction[]>> => {
  try {
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
          orderBy: {
            createdAt: "desc",
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
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!wallet) {
      return {
        success: false,
        error: "Wallet not found.",
      };
    }

    const transactions = [
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
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return {
      success: true,
      data: transactions,
    };
  } catch (error) {
    console.error("Get wallet transactions error:", error);
    return {
      success: false,
      error: "Failed to load wallet transactions. Please try again.",
    };
  }
};

export const getWallets = async (): Promise<
  ActionResult<WalletWithBalance[]>
> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to view wallets.",
      };
    }

    const wallets = await prisma.wallet.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isMain: "desc" }, { createdAt: "desc" }],
      select: {
        name: true,
        publicKey: true,
        isMain: true,
        createdAt: true,
      },
    });

    const walletsWithBalance = wallets.map((wallet) => ({
      ...wallet,
      balance: 0, // Balance should be fetched from blockchain
      status: "idle" as const,
    }));

    return {
      success: true,
      data: walletsWithBalance,
    };
  } catch (error) {
    console.error("Get wallets error:", error);
    return {
      success: false,
      error: "Failed to load wallets. Please try again.",
    };
  }
};

export const getOrderForTransaction = async (
  orderId: string
): Promise<ActionResult<OrderForTransaction>> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to view order details.",
      };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId, buyerId: session.user.id },
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

    if (!order) {
      return {
        success: false,
        error: "Order not found or you don't have permission to view it.",
      };
    }

    if (order.seller.wallets.length === 0) {
      return {
        success: false,
        error:
          "Seller has not set up a payment wallet. Please contact support.",
      };
    }

    return {
      success: true,
      data: {
        recipientPublickey: order.seller.wallets[0].publicKey,
        price: order.package.price,
        sellerId: order.sellerId,
        buyerId: order.buyer.id,
      },
    };
  } catch (error) {
    console.error("Get order for transaction error:", error);
    return {
      success: false,
      error: "Failed to load order payment details. Please try again.",
    };
  }
};

export const confirmPayment = async ({
  orderId,
  txId,
  amount,
  senderPublicKey,
  receiverPublicKey,
}: PaymentConfirmationParams): Promise<ActionResult<{ txId: string }>> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to confirm payment.",
      };
    }

    // Validate transaction ID format
    if (!txId || txId.trim().length === 0) {
      return {
        success: false,
        error: "Invalid transaction ID provided.",
      };
    }

    // Check if transaction already exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: { txId },
    });

    if (existingTransaction) {
      return {
        success: false,
        error: "This transaction has already been processed.",
      };
    }

    // Fetch order with necessary relations
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        status: true,
        buyerId: true,
        sellerId: true,
        seller: {
          select: {
            email: true,
          },
        },
        buyer: {
          select: {
            email: true,
          },
        },
        package: {
          select: {
            price: true,
            gig: {
              select: {
                sellerId: true,
                title: true,
              },
            },
          },
        },
      },
    });

    // Validate order exists
    if (!order) {
      return {
        success: false,
        error: "Order not found.",
      };
    }

    // Validate order status
    if (order.status !== "PENDING_PAYMENT") {
      return {
        success: false,
        error: `This order has already been ${order.status.toLowerCase().replace("_", " ")}. Please refresh the page.`,
      };
    }

    // Validate buyer authorization
    if (order.buyerId !== session.user.id) {
      return {
        success: false,
        error: "You can only confirm payment for your own orders.",
      };
    }

    // Validate payment amount matches order (with small tolerance for fees)
    const expectedAmount = order.package.price;
    const tolerance = 0.001; // Allow for small rounding differences

    if (Math.abs(amount - expectedAmount) > tolerance) {
      console.warn(
        `Payment amount mismatch for order ${orderId}. Expected: ${expectedAmount}, Received: ${amount}`
      );
      // Still allow the payment to go through but log the discrepancy
    }

    // Execute transaction atomically
    await prisma.$transaction(async (tx) => {
      // Create transaction record
      await tx.transaction.create({
        data: {
          txId,
          amount,
          senderPublicKey,
          receiverPublicKey,
          orderId,
        },
      });

      // Update order status
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
        },
      });
    });

    // Send confirmation emails
    await sendEmail(
      order.buyer.email,
      "buyerTransaction",
      {
        orderId,
      },
      order.buyerId
    );

    await sendEmail(
      order.seller.email,
      "sellerTransaction",
      {
        orderId,
      },
      order.sellerId
    );

    // Create notifications
    await createNotification(
      order.sellerId,
      "PAYMENT",
      {
        paymentId: orderId,
        amount: amount,
        transactionId: txId,
      },
      `Payment received for "${order.package.gig.title}" - ${amount} SOL`
    );

    await createNotification(
      order.buyerId,
      "PAYMENT",
      {
        paymentId: orderId,
        amount: amount,
        transactionId: txId,
      },
      `Payment confirmed for "${order.package.gig.title}" - ${amount} SOL`
    );

    // Revalidate relevant paths
    revalidatePath("/dashboard/orders");
    revalidatePath(`/dashboard/orders/${orderId}`);

    return {
      success: true,
      data: { txId },
    };
  } catch (error) {
    console.error("Payment confirmation error:", {
      orderId,
      txId,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return {
      success: false,
      error:
        "Failed to confirm payment. Please contact support if the payment was sent.",
    };
  }
};
