import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, ShoppingBag, Star, TrendingUp, TrendingDown, BarChart3 } from "lucide-react"

interface PerformanceStatsProps {
  stats: {
    views: {
      total: number
      change: number
    }
    orders: {
      total: number
      change: number
    }
    rating: {
      average: number
      total: number
    }
    conversionRate: number
  }
}

export function PerformanceStats({ stats }: PerformanceStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-gray-900/40 to-black border-gray-800/30 hover:border-gray-700/50 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <Eye className="h-4 w-4 mr-2 text-blue-400" />
            Profile Views
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.views.total.toLocaleString()}</div>
          <div className="flex items-center mt-1 text-xs">
            {stats.views.change >= 0 ? (
              <>
                <TrendingUp className="h-3 w-3 mr-1 text-green-400" />
                <span className="text-green-400">+{stats.views.change}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-3 w-3 mr-1 text-red-400" />
                <span className="text-red-400">{stats.views.change}%</span>
              </>
            )}
            <span className="text-muted-foreground ml-1">vs last month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gray-900/40 to-black border-gray-800/30 hover:border-gray-700/50 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2 text-purple-400" />
            Completed Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.orders.total}</div>
          <div className="flex items-center mt-1 text-xs">
            {stats.orders.change >= 0 ? (
              <>
                <TrendingUp className="h-3 w-3 mr-1 text-green-400" />
                <span className="text-green-400">+{stats.orders.change}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-3 w-3 mr-1 text-red-400" />
                <span className="text-red-400">{stats.orders.change}%</span>
              </>
            )}
            <span className="text-muted-foreground ml-1">vs last month</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gray-900/40 to-black border-gray-800/30 hover:border-gray-700/50 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <Star className="h-4 w-4 mr-2 text-yellow-400" />
            Average Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <div className="text-2xl font-bold">{stats.rating.average.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground ml-2">({stats.rating.total} reviews)</div>
          </div>
          <div className="flex mt-1 text-xs">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= Math.round(stats.rating.average) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-gray-900/40 to-black border-gray-800/30 hover:border-gray-700/50 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <BarChart3 className="h-4 w-4 mr-2 text-green-400" />
            Conversion Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.conversionRate}%</div>
          <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-violet-500 h-1.5 rounded-full"
              style={{ width: `${stats.conversionRate}%` }}
            ></div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">Views to orders</div>
        </CardContent>
      </Card>
    </div>
  )
}
