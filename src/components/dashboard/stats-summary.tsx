import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, CheckCircle, Clock, AlertTriangle, ArrowUpRight } from "lucide-react"

interface StatsSummaryProps {
  stats: {
    inProgress: number
    completed: number
    pending: number
    disputed: number
  }
  userType: "buyer" | "seller"
}

export function StatsSummary({ stats, userType }: StatsSummaryProps) {
  const orderLabel = userType === "seller" ? "Orders" : "Purchases"

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-purple-900/40 to-black border-purple-800/30 hover:border-purple-700/50 transition-colors">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">In Progress</p>
              <h3 className="text-2xl font-bold mt-2">{stats.inProgress}</h3>
              <p className="text-sm text-muted-foreground mt-1">Active {orderLabel.toLowerCase()}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-500/10 text-purple-400">
              <Clock className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-green-400">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            <span>View all</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-900/40 to-black border-green-800/30 hover:border-green-700/50 transition-colors">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <h3 className="text-2xl font-bold mt-2">{stats.completed}</h3>
              <p className="text-sm text-muted-foreground mt-1">Finished {orderLabel.toLowerCase()}</p>
            </div>
            <div className="p-3 rounded-full bg-green-500/10 text-green-400">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-green-400">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            <span>View all</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-900/40 to-black border-blue-800/30 hover:border-blue-700/50 transition-colors">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <h3 className="text-2xl font-bold mt-2">{stats.pending}</h3>
              <p className="text-sm text-muted-foreground mt-1">Awaiting action</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500/10 text-blue-400">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-green-400">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            <span>View all</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-900/40 to-black border-orange-800/30 hover:border-orange-700/50 transition-colors">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Disputed</p>
              <h3 className="text-2xl font-bold mt-2">{stats.disputed}</h3>
              <p className="text-sm text-muted-foreground mt-1">Needs resolution</p>
            </div>
            <div className="p-3 rounded-full bg-orange-500/10 text-orange-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-green-400">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            <span>View all</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
