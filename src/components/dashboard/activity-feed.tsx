"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ShoppingBag, Star, Wallet, Bell, MoreHorizontal, ChevronRight, CheckCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Activity } from "@/lib/types"

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const [expandedActivities, setExpandedActivities] = useState<string[]>([])

  const toggleExpand = (id: string) => {
    setExpandedActivities((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-400" />
      case "order":
        return <ShoppingBag className="h-4 w-4 text-green-400" />
      case "review":
        return <Star className="h-4 w-4 text-yellow-400" />
      case "payment":
        return <Wallet className="h-4 w-4 text-purple-400" />
      case "system":
        return <Bell className="h-4 w-4 text-gray-400" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)
    const diffInDays = diffInHours / 24

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) === 1 ? "" : "s"} ago`
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} day${Math.floor(diffInDays) === 1 ? "" : "s"} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <Button variant="ghost" size="sm" className="text-xs">
          Mark all as read
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0 divide-y divide-border/50">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`p-4 transition-colors hover:bg-muted/20 ${!activity.read ? "bg-purple-900/5 border-l-2 border-l-purple-500" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">
                      {activity.title}
                      {!activity.read && (
                        <Badge variant="outline" className="ml-2 bg-purple-500/10 text-purple-400 border-purple-500/30">
                          New
                        </Badge>
                      )}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{formatDate(activity.date)}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Mark as {activity.read ? "unread" : "read"}</DropdownMenuItem>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Hide</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <p
                    className={`text-sm text-muted-foreground ${expandedActivities.includes(activity.id) ? "" : "line-clamp-2"}`}
                  >
                    {activity.description}
                  </p>
                  {activity.description.length > 100 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-xs text-purple-400 hover:text-purple-300"
                      onClick={() => toggleExpand(activity.id)}
                    >
                      {expandedActivities.includes(activity.id) ? "Show less" : "Show more"}
                    </Button>
                  )}
                  {activity.actionable && (
                    <div className="pt-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        {activity.actionText || "Take action"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 text-center">
          <Button variant="outline" size="sm" className="w-full">
            View All Activity <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
