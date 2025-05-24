import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, AlertTriangle } from "lucide-react"

interface PendingOrder {
  id: string
  title: string
  buyer: {
    name: string
    avatar: string
  }
  price: number
  dueDate: string
  isUrgent: boolean
}

interface PendingOrdersProps {
  orders: PendingOrder[]
}

export function PendingOrders({ orders }: PendingOrdersProps) {
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = date.getTime() - now.getTime()
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

    if (diffInDays < 0) {
      return { text: "Overdue", color: "text-red-400" }
    } else if (diffInDays < 1) {
      return { text: "Due today", color: "text-yellow-400" }
    } else if (diffInDays < 2) {
      return { text: "Due tomorrow", color: "text-yellow-400" }
    } else {
      return { text: `Due in ${Math.floor(diffInDays)} days`, color: "text-muted-foreground" }
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Pending Orders</CardTitle>
        <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
          {orders.length} Active
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        {orders.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">No pending orders at the moment.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {orders.map((order) => {
              const dueDate = formatDueDate(order.dueDate)
              return (
                <div key={order.id} className="p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={order.buyer.avatar || "/placeholder.svg"} alt={order.buyer.name} />
                        <AvatarFallback>{order.buyer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-sm">{order.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">from {order.buyer.name}</span>
                          <span className="text-xs text-purple-400">{order.price} SOL</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className={`flex items-center text-xs ${dueDate.color}`}>
                            <Clock className="h-3 w-3 mr-1" />
                            {dueDate.text}
                          </div>
                          {order.isUrgent && (
                            <div className="flex items-center text-xs text-red-400">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Urgent
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/orders/${order.id}`}>View Details</a>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
