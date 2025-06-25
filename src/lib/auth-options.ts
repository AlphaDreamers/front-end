import { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { validateCredentials } from "./actions/auth";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const user = await validateCredentials(
            credentials as {
              email: string;
              password: string;
            }
          );
          return user;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.unreadNotifications = user.unreadNotifications;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.username = user.username;
        token.avatar = user.avatar;
        token.isVerified = user.isVerified;
      }

      return token;
    },
    async session({ session, token, trigger }) {
      if (trigger === "update") {
        if ("username" in session && typeof session.username === "string") {
          session.user.username = session.username;
        }
        if ("firstName" in session && typeof session.firstName === "string") {
          session.user.firstName = session.firstName;
        }
        if ("lastName" in session && typeof session.lastName === "string") {
          session.user.lastName = session.lastName;
        }
        if ("avatar" in session && typeof session.avatar === "string") {
          session.user.avatar = session.avatar;
        }
        if (
          "isVerified" in session &&
          typeof session.isVerified === "boolean"
        ) {
          session.user.isVerified = session.isVerified;
        }
        if (
          "unreadNotifications" in session &&
          typeof session.unreadNotifications === "number"
        ) {
          session.user.unreadNotifications = session.unreadNotifications;
        }
      } else {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.username = token.username;
        session.user.avatar = token.avatar;
        session.user.isVerified = token.isVerified;
      }

      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
};
