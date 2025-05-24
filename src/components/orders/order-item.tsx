"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { CheckCircle, Clock, ExternalLink, HelpCircle, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { OrderStatusBadge } from "./order-status-badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface OrderItemProps {
  order: any
  userType: "buyer" | "seller" | "both"
}

export function OrderItem({ order, userType }: OrderItemProps) {
  const [deliveryDialogOpen, setDeliveryDialogOpen] = useState(false)
  const [supportDialogOpen, setSupportDialogOpen] = useState(false)
  const [deliveryMessage, setDeliveryMessage] = useState("")
  const [supportMessage, setSupportMessage] = useState("")

  const isSeller = userType === "seller" || (userType === "both" && order.userRole === "seller")
  const otherParty = isSeller ? order.buyer : order.seller
  const dueDate = new Date(order.dueDate)
  const isPastDue = dueDate < new Date()
  const canDeliver = isSeller && order.status === "in_progress"

  const handleDelivery = () => {
    // Here you would implement the actual delivery logic
    console.log("Delivering order:", order.id, "with message:", deliveryMessage)
    setDeliveryDialogOpen(false)
    // You would typically call an API here
  }

  const handleSupportRequest = () => {
    // Here you would implement the support request logic
    console.log("Support requested for order:", order.id, "with message:", supportMessage)
    setSupportDialogOpen(false)
    // You would typically call an API here
  }

  return (
    <>
      <Card className="overflow-hidden border-purple-800/20">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-lg">{order.title}</h3>
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <span>Order #{order.id.substring(0, 8)}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="flex items-center mt-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={otherParty.avatar || "/placeholder.svg"} alt={otherParty.name} />
                  <AvatarFallback>{otherParty.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium">{otherParty.name}</p>
                  <p className="text-xs text-muted-foreground">{isSeller ? "Buyer" : "Seller"}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className={`h-4 w-4 mr-1.5 ${isPastDue ? "text-red-500" : "text-muted-foreground"}`} />
                  <span className={`text-sm ${isPastDue ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                    {isPastDue
                      ? `Overdue by ${formatDistanceToNow(dueDate)}`
                      : `Due ${formatDistanceToNow(dueDate, { addSuffix: true })}`}
                  </span>
                </div>
                <div className="text-lg font-semibold text-purple-400">{order.price} SOL</div>
              </div>
            </div>

            <div className="bg-purple-900/10 p-6 flex flex-col justify-center space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-purple-800/20 hover:bg-purple-900/20 hover:text-purple-300"
                onClick={() => (window.location.href = `/orders/${order.id}`)}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Details
              </Button>

              {canDeliver && (
                <Button
                  variant="default"
                  className="w-full justify-start bg-purple-600 hover:bg-purple-700"
                  onClick={() => setDeliveryDialogOpen(true)}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Delivered
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full justify-start border-purple-800/20 hover:bg-purple-900/20 hover:text-purple-300"
                onClick={() => (window.location.href = `/messages?order=${order.id}`)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start border-purple-800/20 hover:bg-purple-900/20 hover:text-purple-300"
                onClick={() => setSupportDialogOpen(true)}
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Get Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Dialog */}
      <Dialog open={deliveryDialogOpen} onOpenChange={setDeliveryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Mark Order as Delivered</DialogTitle>
            <DialogDescription>
              Let the buyer know what you're delivering and any instructions they might need.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Describe what you're delivering..."
              className="min-h-[120px]"
              value={deliveryMessage}
              onChange={(e) => setDeliveryMessage(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeliveryDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleDelivery}
              disabled={!deliveryMessage.trim()}
            >
              Deliver Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Support Dialog */}
      <Dialog open={supportDialogOpen} onOpenChange={setSupportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Support</DialogTitle>
            <DialogDescription>Describe the issue you're experiencing with this order.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Describe your issue..."
              className="min-h-[120px]"
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSupportDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleSupportRequest}
              disabled={!supportMessage.trim()}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
