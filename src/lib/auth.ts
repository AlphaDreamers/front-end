import NextAuth, { DefaultSession } from "next-auth";
import { authOptions } from "./auth-options";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      unreadNotifications: number;
      firstName: string;
      lastName: string;
      username: string;
      avatar?: string;
      isVerified: boolean;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    email: string;
    unreadNotifications: number;
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string;
    isVerified: boolean;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    email: string;
    unreadNotifications: number;
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string;
    isVerified: boolean;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
