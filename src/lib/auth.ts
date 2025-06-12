import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { validateCredentials } from "@/lib/actions/auth";

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
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const user = await validateCredentials(
          credentials as {
            email: string;
            password: string;
          }
        );
        return user;
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
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      session.user.username = token.username;
      session.user.avatar = token.avatar;

      session.user.unreadNotifications = await prisma.notification.count({
        where: {
          recipientId: token.id,
          isRead: false,
        },
      });

      return session;
    },
  },
});
