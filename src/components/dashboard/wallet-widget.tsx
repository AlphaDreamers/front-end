"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, ArrowUpRight, ArrowDownLeft, Copy, Check, Eye, EyeOff, ExternalLink } from "lucide-react"
import { formatSOL } from "@/lib/utils"

interface WalletWidgetProps {
  balance: number
  address: string
  pendingTransactions: number
}

export function WalletWidget({ balance, address, pendingTransactions }: WalletWidgetProps) {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(!isBalanceHidden)
  }

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const shortenAddress = (addr: string) => {
    return `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}`
  }

  return (
    <Card className="bg-gradient-to-br from-violet-900/40 to-black border-violet-800/30 hover:border-violet-700/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <Wallet className="mr-2 h-5 w-5 text-violet-400" />
          Solana Wallet
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={toggleBalanceVisibility} className="h-8 w-8">
          {isBalanceHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <h3 className="text-3xl font-bold mt-1">
              {isBalanceHidden ? "••••••" : formatSOL(balance)} <span className="text-violet-400">SOL</span>
            </h3>
            {pendingTransactions > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {pendingTransactions} pending transaction{pendingTransactions !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between bg-black/40 rounded-md p-2 text-sm">
            <span className="text-muted-foreground font-mono">{shortenAddress(address)}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyAddress} title="Copy address">
              {isCopied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="w-full">
              <ArrowDownLeft className="mr-2 h-4 w-4" />
              Deposit
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Withdraw
            </Button>
          </div>

          <Button variant="link" size="sm" className="w-full text-violet-400 p-0 h-auto">
            <ExternalLink className="mr-1 h-3 w-3" />
            <span className="text-xs">View transaction history</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
