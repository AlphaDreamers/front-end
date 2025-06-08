import type { Metadata } from "next";
import { Ubuntu_Sans } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import ThemeProvider from "@/components/ui/theme-provider";

import NavbarWrapper from "@/components/navigation/navbar-wrapper";

import "./globals.css";
import { SessionProvider } from "@/hooks/use-session";

export const metadata: Metadata = {
  title: "Blue frog - Solana Services Marketplace",
  description: "A Solana services marketplace for developers and creators",
};

const ubuntuSans = Ubuntu_Sans({
  subsets: ["latin"],
  variable: "--font-ubuntu-sans",
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ubuntuSans.className} antialiased`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NavbarWrapper />

            <div className="bg-gradient-to-b from-background to-primary/25">
              <div className="container mx-auto pt-[calc(2rem+64px)] pb-8 px-4 min-h-screen">
                {children}
              </div>
            </div>

            <Toaster richColors />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
