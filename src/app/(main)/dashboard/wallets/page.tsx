import { WalletProvider } from "@/components/wallet/wallet-provider";
import WalletDashboard from "@/components/wallet/wallet-dashboard";

export default async function WalletsPage() {
  return (
    <WalletProvider>
      <WalletDashboard />
    </WalletProvider>
  );
}
