import { redirect } from "next/navigation";
import PageTemplate from "@/components/templates/page-template";
import { getWalletTransactions } from "@/lib/actions/wallet";
import TransactionCard from "./wrapper";
import { auth } from "@/lib/auth";

export default async function Page({
  params,
}: {
  params: Promise<{ publicKey: string }>;
}) {
  const { publicKey } = await params;
  const session = await auth();

  if (!session) {
    redirect(
      `/sign-in?callback-url=${encodeURIComponent(`/dashboard/wallets/${publicKey}`)}`
    );
  }

  const transactions = await getWalletTransactions(publicKey);

  return (
    <PageTemplate
      title="My Wallet"
      description="View and manage your Solana wallet, including transaction history and balance."
      className="flex flex-col gap-6"
    >
      <div className="grid gap-4">
        {transactions.map((transaction) => (
          <TransactionCard
            key={transaction.txId}
            transaction={transaction}
            currentUserPublicKey={publicKey}
          />
        ))}
      </div>
    </PageTemplate>
  );
}
