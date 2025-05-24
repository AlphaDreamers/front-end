"use client"
import { Bell, ChevronRight, Lock, User, Wallet } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SettingsTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  const tabs = [
    {
      id: "personal",
      label: "Personal Information",
      icon: User,
    },
    {
      id: "wallet",
      label: "Wallet Management",
      icon: Wallet,
    },
    {
      id: "notifications",
      label: "Notification Preferences",
      icon: Bell,
    },
    {
      id: "security",
      label: "Security Settings",
      icon: Lock,
    },
  ]

  return (
    <div className="space-y-2 w-full md:w-64 flex-shrink-0">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 px-3 py-6 text-left",
            activeTab === tab.id && "bg-purple-900/20 text-purple-400",
          )}
          onClick={() => onTabChange(tab.id)}
        >
          <tab.icon className="h-5 w-5" />
          <span className="flex-1">{tab.label}</span>
          <ChevronRight className={cn("h-5 w-5 transition-transform", activeTab === tab.id && "rotate-90")} />
        </Button>
      ))}
    </div>
  )
}
