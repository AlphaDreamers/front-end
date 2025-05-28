import type { Metadata } from "next";
import { Ubuntu_Sans } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import WalletProvider from "@/components/wallet-provider";
import { ThemeProvider } from "@/components/theme-provider";
import SessionProvider from "@/components/session-provider";
import Navbar from "@/components/nav-bar";
import { SidebarProvider } from "@/components/ui/sidebar";

import "./globals.css";

export const metadata: Metadata = {
  title: "Blue frog - Solana Services Marketplace",
  description: "A Solana services marketplace for developers and creators",
};

const spaceGrotesk = Ubuntu_Sans({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.className} antialiased bg-gradient-to-b from-background to-primary/15`}
      >
        <WalletProvider>
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider>
                <Navbar />
                <div className="mt-16 min-h-screen container mx-auto px-4 py-8">
                  {children}
                </div>

                <Toaster richColors />
              </SidebarProvider>
            </ThemeProvider>
          </SessionProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
