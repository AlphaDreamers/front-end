import { me } from "@/lib/actions/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import WalletList from "./wallet-list";

interface BaseWallet {
  id: string;
  name: string;
  publicKey: string;
}

export default async function WalletsPage() {
  const user = await me();

  if (!user?.isVerified) {
    redirect("/sign-in?callback-url=/dashboard/wallets");
  }

  const wallets = (await prisma.wallet.findMany({
    where: { userId: user.id },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      publicKey: true,
    },
  })) as BaseWallet[];

  return <WalletList wallets={wallets} />;
}
