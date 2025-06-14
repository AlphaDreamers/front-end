import type { Metadata } from "next";
import { Ubuntu_Sans } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import ThemeProvider from "@/components/ui/theme-provider";

import SessionProvider from "@/components/session-provider";

import "./globals.css";
import SearchProviderWrapper from "@/components/navigation/search-provider-wrapper";
import NavBar from "@/components/navigation/nav-bar";

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
            <SearchProviderWrapper>
              <NavBar />

              <div className="bg-gradient-to-b from-background to-primary/25">
                <div className="container mx-auto pt-[calc(2rem+64px)] pb-8 px-4 min-h-screen">
                  {children}
                </div>
              </div>

              <Toaster richColors />
            </SearchProviderWrapper>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
