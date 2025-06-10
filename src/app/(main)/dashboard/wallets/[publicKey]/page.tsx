import { me } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import PageTemplate from "@/components/templates/page-template";
import { getWalletTransactions } from "@/lib/actions/wallet";
import TransactionCard from "./wrapper";
import Pagination from "@/components/pagination";

export default async function Page({
  params,
}: {
  params: Promise<{ publicKey: string }>;
}) {
  const { publicKey } = await params;
  const { user, error } = await me();

  if (!user?.isVerified) {
    redirect(
      `/sign-in?callback-url=${encodeURIComponent(`/dashboard/wallets/${publicKey}`)}&error=${encodeURIComponent(
        error === "INVALID_TOKEN"
          ? "Invalid token. Please log in again"
          : error === "TOKEN_EXPIRED"
            ? "Your session has expired. Please log in again"
            : "You must be logged in to access this page"
      )}`
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
