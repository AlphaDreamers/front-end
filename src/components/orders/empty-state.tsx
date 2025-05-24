import { PackageSearch } from "lucide-react"

interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg border-purple-800/20">
      <PackageSearch className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium text-center">{message}</h3>
      <p className="text-sm text-muted-foreground text-center mt-1">Orders matching your criteria will appear here</p>
    </div>
  )
}
