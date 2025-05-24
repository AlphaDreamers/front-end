import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Gig } from "@/lib/mock-data"
import Link from "next/link"
import { Plus } from "lucide-react"

interface ActiveGigsProps {
  gigs: Gig[]
}

export function ActiveGigs({ gigs }: ActiveGigsProps) {
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle>Active Gigs</CardTitle>
        <Button size="sm" className="h-8">
          <Plus className="h-4 w-4 mr-1" /> Create New Gig
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0 divide-y divide-border/50">
          {gigs.map((gig) => (
            <div key={gig.id} className="p-4 transition-colors hover:bg-muted/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm">{gig.title}</h3>
                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                      {gig.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{gig.category}</span>
                    <span className="text-xs text-purple-400">
                      {gig.price} {gig.currency}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{gig.orders} orders completed</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/gigs/${gig.id}`}>Manage</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 text-center">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/gigs">View All Gigs</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
