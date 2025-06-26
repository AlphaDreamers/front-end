import type { Metadata } from "next";
import { Ubuntu_Sans } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import ThemeProvider from "@/components/ui/theme-provider";

import SessionProvider from "@/components/session-provider";

import "./globals.css";
import SearchProviderWrapper from "@/components/navigation/search-provider-wrapper";
import NavBar from "@/components/navigation/nav-bar";
import ComparisonWrapper from "@/components/comparison-wrapper";
import { NotificationSocketProvider } from "@/components/providers/notification-socket-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Blue frog - Solana Services Marketplace",
  description: "A Solana services marketplace for developers and creators",
  // add favicon
  icons: {
    icon: "/favicon.ico",
  },
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
          <NotificationSocketProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SearchProviderWrapper>
                <NavBar />

                <ComparisonWrapper>
                  <TooltipProvider>
                    <div className="bg-gradient-to-b from-background to-primary/25 min-h-screen flex flex-col">
                      {children}
                    </div>
                  </TooltipProvider>
                </ComparisonWrapper>
                <Toaster richColors />
              </SearchProviderWrapper>
            </ThemeProvider>
          </NotificationSocketProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
