import NavBar from "./nav-bar";
import { auth } from "@/lib/auth";

export default async function NavbarWrapper() {
  const session = await auth();

  return <NavBar user={session?.user} />;
}
