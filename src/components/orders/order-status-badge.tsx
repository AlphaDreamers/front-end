import { Badge } from "@/components/ui/badge"
import type { OrderStatus } from "@/lib/types"

interface OrderStatusBadgeProps {
  status: OrderStatus
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusConfig = {
    in_progress: {
      label: "In Progress",
      variant: "default" as const,
      className: "bg-blue-600 hover:bg-blue-700",
    },
    delivered: {
      label: "Delivered",
      variant: "default" as const,
      className: "bg-amber-600 hover:bg-amber-700",
    },
    completed: {
      label: "Completed",
      variant: "default" as const,
      className: "bg-green-600 hover:bg-green-700",
    },
    cancelled: {
      label: "Cancelled",
      variant: "default" as const,
      className: "bg-red-600 hover:bg-red-700",
    },
    disputed: {
      label: "Disputed",
      variant: "default" as const,
      className: "bg-orange-600 hover:bg-orange-700",
    },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}
