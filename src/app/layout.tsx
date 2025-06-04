import type { Metadata } from "next";
import { Ubuntu_Sans } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ThemeProvider from "@/components/ui/theme-provider";

import SessionProvider from "@/components/session-provider";
import Navbar from "@/components/nav-bar";

import "./globals.css";

export const metadata: Metadata = {
  title: "Blue frog - Solana Services Marketplace",
  description: "A Solana services marketplace for developers and creators",
};

const ubuntuSans = Ubuntu_Sans({
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
      <body className={`${ubuntuSans.className} antialiased`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider>
              <SidebarInset>
                <div className="min-h-screen container mx-auto py-4 px-4">
                  {children}
                </div>

                <Toaster richColors />
              </SidebarInset>
            </SidebarProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
