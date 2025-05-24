"use client"

import { useState } from "react"
import { Copy, ExternalLink, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface WalletManagementProps {
  connectedWallet?: {
    address: string
    balance: number
  }
}

export function WalletManagement({ connectedWallet }: WalletManagementProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)

  const handleConnect = () => {
    setIsConnecting(true)

    // Simulate wallet connection
    setTimeout(() => {
      setIsConnecting(false)
      toast({
        title: "Wallet connected",
        description: "Your Solana wallet has been connected successfully.",
      })
      // This would typically refresh the page or update state
    }, 1500)
  }

  const handleDisconnect = () => {
    setIsDisconnecting(true)

    // Simulate wallet disconnection
    setTimeout(() => {
      setIsDisconnecting(false)
      toast({
        title: "Wallet disconnected",
        description: "Your Solana wallet has been disconnected.",
      })
      // This would typically refresh the page or update state
    }, 1000)
  }

  const copyAddress = () => {
    if (connectedWallet) {
      navigator.clipboard.writeText(connectedWallet.address)
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard.",
      })
    }
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Wallet Management</CardTitle>
        <CardDescription>Connect your Solana wallet to receive payments for your services.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {connectedWallet ? (
          <>
            <div className="rounded-lg bg-purple-900/20 p-4 border border-purple-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-purple-300">Connected Wallet</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-purple-400 hover:text-purple-300"
                  onClick={copyAddress}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
              <p className="text-xs text-gray-400 break-all font-mono">{connectedWallet.address}</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Balance</p>
                  <p className="text-lg font-medium text-white">{connectedWallet.balance} SOL</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => window.open("https://explorer.solana.com", "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View on Explorer
                </Button>
              </div>
            </div>

            <Alert className="bg-yellow-900/20 border-yellow-800/50 text-yellow-300">
              <AlertTitle className="text-yellow-300">Important</AlertTitle>
              <AlertDescription className="text-yellow-200/80">
                Keep your wallet secure. Never share your private keys or seed phrase with anyone.
              </AlertDescription>
            </Alert>

            <Button
              variant="destructive"
              className="w-full md:w-auto"
              onClick={handleDisconnect}
              disabled={isDisconnecting}
            >
              {isDisconnecting ? "Disconnecting..." : "Disconnect Wallet"}
            </Button>
          </>
        ) : (
          <>
            <div className="rounded-lg bg-gray-800/50 p-6 flex flex-col items-center justify-center space-y-4 border border-gray-700">
              <div className="h-16 w-16 rounded-full bg-purple-900/30 flex items-center justify-center">
                <Wallet className="h-8 w-8 text-purple-400" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-white">No Wallet Connected</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Connect your Solana wallet to receive payments and manage your earnings.
                </p>
              </div>
            </div>

            <Alert className="bg-blue-900/20 border-blue-800/50 text-blue-300">
              <AlertTitle className="text-blue-300">What is a Solana wallet?</AlertTitle>
              <AlertDescription className="text-blue-200/80">
                A Solana wallet allows you to store, send, and receive SOL tokens. Popular options include Phantom,
                Solflare, and Sollet.
              </AlertDescription>
            </Alert>

            <Button
              className="bg-purple-600 hover:bg-purple-700 w-full md:w-auto"
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
