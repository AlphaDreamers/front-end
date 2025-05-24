import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface SummaryCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  iconColor?: string
  linkText: string
  linkHref: string
  className?: string
}

export function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-purple-400",
  linkText,
  linkHref,
  className,
}: SummaryCardProps) {
  return (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-md hover:border-purple-500/50 ${className}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          <div className={`p-3 rounded-full bg-purple-500/10 ${iconColor}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/10 p-3 border-t border-border/50">
        <Button variant="link" asChild className="p-0 h-auto text-sm font-medium text-purple-400 hover:text-purple-300">
          <Link href={linkHref}>
            {linkText} <span aria-hidden="true">→</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
