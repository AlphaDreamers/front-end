"use client";

import { Copy, ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Transaction } from "@/lib/types/wallet";
import HiddenField from "@/components/hidden-field";
import Link from "next/link";

interface TransactionCardProps {
  transaction: Transaction;
  currentUserPublicKey?: string;
}

export default function TransactionCard({
  transaction,
  currentUserPublicKey,
}: TransactionCardProps) {
  const isReceive = transaction.senderPublicKey !== currentUserPublicKey;

  return (
    <div className="group relative rounded border hover:border-primary/50 hover:bg-primary/5 transition-colors duration-300 p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-lg font-semibold",
            isReceive ? "text-green-600" : "text-red-600"
          )}
        >
          {isReceive ? "Received" : "Sent"} {transaction.amount} SOL
        </span>

        <Link
          href={`https://explorer.solana.com/tx/${transaction.txId}`}
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "icon",
            })
          )}
        >
          <ExternalLink />
        </Link>
      </div>

      <HiddenField
        label="Transaction ID"
        icon={Copy}
        value={transaction.txId}
        variant={4}
      />
    </div>
  );
}
