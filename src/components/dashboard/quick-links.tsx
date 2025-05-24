import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, ShoppingBag, User, MessageSquare, Heart, Settings, PlusCircle, Briefcase } from "lucide-react"

export function QuickLinks() {
  const links = [
    { icon: Search, label: "Browse Gigs", href: "/gigs" },
    { icon: ShoppingBag, label: "My Orders", href: "/orders" },
    { icon: Briefcase, label: "My Gigs", href: "/my-gigs" },
    { icon: PlusCircle, label: "Create Gig", href: "/create-gig" },
    { icon: User, label: "My Profile", href: "/profile" },
    { icon: MessageSquare, label: "Messages", href: "/messages" },
    { icon: Heart, label: "Saved Gigs", href: "/saved" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {links.map((link) => (
            <Button
              key={link.label}
              variant="outline"
              className="h-auto flex-col py-4 px-2 gap-2 hover:bg-purple-900/10 hover:text-purple-400 hover:border-purple-500/50"
              asChild
            >
              <a href={link.href}>
                <link.icon className="h-5 w-5" />
                <span className="text-xs font-normal">{link.label}</span>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
