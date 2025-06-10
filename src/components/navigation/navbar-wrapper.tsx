import { me } from "@/lib/actions/auth";
import NavBar from "./nav-bar";

export default async function NavbarWrapper() {
  const {user,} = await me();

  return <NavBar user={user} />;
}
