import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"

export default function KycLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider defaultTheme="dark" forcedTheme="dark">
      <div className="min-h-screen bg-gradient-to-b from-background to-background/90">{children}</div>
    </ThemeProvider>
  )
}
