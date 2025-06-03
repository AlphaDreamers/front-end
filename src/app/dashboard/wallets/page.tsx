import { me } from "@/lib/actions";
import { redirect } from "next/navigation";
import WalletPage from "./Temp";

export default async function WalletPag() {
  const user = await me();

  if (!user?.isVerified) {
    redirect("/sign-in?callback-url=/wallet");
  }

  if (!user.publicKey) {
    redirect("/add-wallet?callback-url=/wallet");
  }

  return <WalletPage />;
}
