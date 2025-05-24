"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, TrendingUp, Plus } from "lucide-react"

interface EarningsSummaryProps {
  totalEarnings: number
  pendingPayouts: number
  activeGigs: number
  onCreateGig: () => void
}

export function EarningsSummary({ totalEarnings, pendingPayouts, activeGigs, onCreateGig }: EarningsSummaryProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8">
      <Card className="flex-1 bg-gradient-to-br from-purple-900/40 to-black border-purple-800/30 hover:border-purple-700/50 transition-colors">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
              <div className="flex items-baseline mt-2">
                <h3 className="text-3xl font-bold">{totalEarnings.toFixed(4)}</h3>
                <span className="ml-2 text-sm font-medium text-purple-400">SOL</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="text-green-400">{pendingPayouts.toFixed(4)} SOL</span> pending payout
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-500/10 text-purple-400">
              <Wallet className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-green-400">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+12.5% from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1 bg-gradient-to-br from-violet-900/40 to-black border-violet-800/30 hover:border-violet-700/50 transition-colors">
        <CardContent className="p-6 flex justify-between items-center h-full">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Gigs</p>
            <h3 className="text-3xl font-bold mt-2">{activeGigs}</h3>
            <p className="text-sm text-muted-foreground mt-1">Generating income</p>
          </div>
          <Button onClick={onCreateGig} className="bg-violet-600 hover:bg-violet-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Create New Gig
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
