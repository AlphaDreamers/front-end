import { OrderItem } from "./order-item"
import { EmptyState } from "./empty-state"

interface OrderListProps {
  orders: any[]
  userType: "buyer" | "seller" | "both"
  emptyMessage: string
}

export function OrderList({ orders, userType, emptyMessage }: OrderListProps) {
  if (orders.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderItem key={order.id} order={order} userType={userType} />
      ))}
    </div>
  )
}
