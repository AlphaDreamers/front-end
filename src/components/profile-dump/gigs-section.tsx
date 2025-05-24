import type { Gig } from "@/lib/data"
import { Clock, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GigsSectionProps {
  gigs: Gig[]
}

export function GigsSection({ gigs }: GigsSectionProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Services Offered</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs.map((gig) => (
          <div
            key={gig.id}
            className="border border-muted/20 rounded-lg overflow-hidden hover:border-primary/50 transition-colors group"
          >
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={gig.image || "/placeholder.svg"}
                alt={gig.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center text-xs text-muted-foreground mb-2">
                <Tag className="h-3 w-3 mr-1" />
                <span>{gig.category}</span>
                <span className="mx-2">•</span>
                <Clock className="h-3 w-3 mr-1" />
                <span>{gig.deliveryTime}</span>
              </div>
              <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                {gig.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{gig.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">Starting at</span>
                  <div className="font-bold text-primary">
                    {gig.price.amount} {gig.price.currency}
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
