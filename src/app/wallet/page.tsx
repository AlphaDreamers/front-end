import { getCurrentUser } from "@/lib/actions";
import { redirect } from "next/navigation";
import WalletPage from "./Temp";

export default async function WalletPag() {
  const user = await getCurrentUser();

  if (!user?.isVerified) {
    redirect("/sign-in?callback-url=/wallet");
  }

  return <WalletPage />;
}
