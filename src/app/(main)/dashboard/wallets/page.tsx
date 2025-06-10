import { me } from "@/lib/actions/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { WalletProvider } from "@/components/wallet/wallet-provider";
import WalletDashboard from "@/components/wallet/wallet-dashboard";

export default async function WalletsPage() {
  const { user, error } = await me();

  if (!user?.isVerified) {
    redirect(
      `/sign-in?callback-url=${encodeURIComponent(`/dashboard/wallets`)}&error=${encodeURIComponent(
        error === "INVALID_TOKEN"
          ? "Invalid token. Please log in again"
          : error === "TOKEN_EXPIRED"
            ? "Your session has expired. Please log in again"
            : "You must be logged in to access this page"
      )}`
    );
  }

  // Fetch wallets with all necessary data
  const wallets = await prisma.wallet.findMany({
    where: { userId: user.id },
    orderBy: [
      { isMain: "desc" }, // Main wallet first
      { createdAt: "desc" },
    ],
    select: {
      name: true,
      publicKey: true,
      isMain: true,
      createdAt: true,
    },
  });

  return (
    <WalletProvider initialWallets={wallets}>
      <WalletDashboard />
    </WalletProvider>
  );
}
