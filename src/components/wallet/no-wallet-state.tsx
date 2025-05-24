"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Plus, Import } from "lucide-react"

interface NoWalletStateProps {
  onCreateWallet: () => void
  onImportWallet: () => void
}

export default function NoWalletState({ onCreateWallet, onImportWallet }: NoWalletStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md bg-gradient-to-b from-purple-900/40 to-black border-primary/20 animate-fadeIn">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl font-bold text-white">Set Up Your Solana Wallet</CardTitle>
          <CardDescription className="text-base mt-2">
            A Solana wallet is required to buy or sell services on our platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              className="h-auto py-6 flex flex-col items-center gap-2 bg-primary hover:bg-primary/90 hover:scale-[1.02] transition-all duration-200"
              onClick={onCreateWallet}
            >
              <Plus className="h-6 w-6 mb-1" />
              <span className="text-lg font-semibold">Create Wallet</span>
              <span className="text-xs text-center">Generate a new Solana wallet</span>
            </Button>

            <Button
              className="h-auto py-6 flex flex-col items-center gap-2 bg-secondary hover:bg-secondary/90 hover:scale-[1.02] transition-all duration-200"
              onClick={onImportWallet}
              variant="secondary"
            >
              <Import className="h-6 w-6 mb-1" />
              <span className="text-lg font-semibold">Import Wallet</span>
              <span className="text-xs text-center">Use an existing wallet</span>
            </Button>
          </div>

          <div className="flex items-start gap-2 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-500">Security Notice</p>
              <p className="text-muted-foreground mt-1">
                Keep your private key and seed phrase safe. Never share them with anyone, including our support team.
              </p>
              <a href="#" className="text-primary hover:underline text-sm mt-2 inline-block">
                Learn more about wallet security
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
