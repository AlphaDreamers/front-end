import type { User } from "@/lib/types"
import { Shield, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WelcomeHeaderProps {
  user: User
  unreadNotifications: number
}

export function WelcomeHeader({ user, unreadNotifications }: WelcomeHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Welcome back, {user.displayName}
          {user.isVerified && (
            <span className="inline-flex items-center rounded-full bg-purple-100/10 px-2 py-1 text-xs font-medium text-purple-400 ring-1 ring-inset ring-purple-400/30">
              <Shield className="mr-1 h-3 w-3" /> Verified
            </span>
          )}
        </h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your account today.</p>
      </div>
      <div className="mt-4 md:mt-0 flex items-center gap-4">
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4 mr-2" />
          Notifications
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs text-white">
              {unreadNotifications}
            </span>
          )}
        </Button>
        <div className="text-sm text-muted-foreground">
          Last login: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
