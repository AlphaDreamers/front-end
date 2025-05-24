import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Order } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ActiveOrdersProps {
  orders: Order[]
}

export function ActiveOrders({ orders }: ActiveOrdersProps) {
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30"
      case "delivered":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
      case "completed":
        return "bg-green-500/10 text-green-400 border-green-500/30"
      case "cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/30"
      case "disputed":
        return "bg-orange-500/10 text-orange-400 border-orange-500/30"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30"
    }
  }

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = date.getTime() - now.getTime()
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

    if (diffInDays < 0) {
      return "Overdue"
    } else if (diffInDays < 1) {
      return "Due today"
    } else if (diffInDays < 2) {
      return "Due tomorrow"
    } else {
      return `Due in ${Math.floor(diffInDays)} days`
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Active Orders</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0 divide-y divide-border/50">
          {orders.map((order) => (
            <div key={order.id} className="p-4 transition-colors hover:bg-muted/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={order.otherParty.avatar || "/placeholder.svg"} alt={order.otherParty.username} />
                    <AvatarFallback>{order.otherParty.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-sm">{order.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">with {order.otherParty.username}</span>
                      <span className="text-xs text-purple-400">{order.price} SOL</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getStatusColor(order.status)}>
                    {order.status.replace("_", " ")}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{formatDueDate(order.dueDate)}</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/orders/${order.id}`}>View</a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 text-center">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href="/orders">View All Orders</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
