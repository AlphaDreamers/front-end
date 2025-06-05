import { me } from "@/lib/actions/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { WalletProvider } from "@/components/wallet/wallet-provider";
import WalletDashboard from "@/components/wallet/wallet-dashboard";

export default async function WalletsPage() {
  const user = await me();

  if (!user?.isVerified) {
    redirect("/sign-in?callback-url=/dashboard/wallets");
  }

  // Fetch wallets with all necessary data
  const wallets = await prisma.wallet.findMany({
    where: { userId: user.id },
    orderBy: [
      { isMain: "desc" }, // Main wallet first
      { createdAt: "desc" },
    ],
    select: {
      id: true,
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
