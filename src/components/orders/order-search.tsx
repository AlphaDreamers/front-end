"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface OrderSearchProps {
  onSearch: (query: string) => void
}

export function OrderSearch({ onSearch }: OrderSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search orders by title, ID, or name..."
        className="pl-10 bg-background border-purple-800/20 focus-visible:ring-purple-600"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}
