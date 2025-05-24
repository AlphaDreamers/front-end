import { FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  userRole: "seller" | "buyer"
}

export function EmptyState({ userRole }: EmptyStateProps) {
  return (
    <div className="text-center py-16 border-2 border-dashed border-muted/50 rounded-lg animate-fadeIn">
      <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">No Reviews Found</h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {userRole === "seller"
          ? "You haven't received any reviews yet. Complete more orders and provide excellent service to earn reviews from your clients."
          : "You haven't given any reviews yet. After completing orders, you can leave reviews for the services you received."}
      </p>
      <Button>{userRole === "seller" ? "View Active Orders" : "Browse Services"}</Button>
    </div>
  )
}
