"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

interface NotificationSetting {
  id: string
  title: string
  description: string
  emailEnabled: boolean
  appEnabled: boolean
}

interface NotificationPreferencesProps {
  initialSettings: NotificationSetting[]
}

export function NotificationPreferences({ initialSettings }: NotificationPreferencesProps) {
  const [settings, setSettings] = useState<NotificationSetting[]>(initialSettings)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = (id: string, type: "email" | "app", value: boolean) => {
    setSettings(
      settings.map((setting) => {
        if (setting.id === id) {
          return {
            ...setting,
            [type === "email" ? "emailEnabled" : "appEnabled"]: value,
          }
        }
        return setting
      }),
    )
  }

  const handleSave = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log(settings)
      setIsLoading(false)
      toast({
        title: "Notification preferences updated",
        description: "Your notification preferences have been saved successfully.",
      })
    }, 1000)
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Notification Preferences</CardTitle>
        <CardDescription>Customize how and when you receive notifications.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-400 mb-2 px-4">
          <div className="col-span-6">Notification Type</div>
          <div className="col-span-3 text-center">Email</div>
          <div className="col-span-3 text-center">In-App</div>
        </div>

        <div className="space-y-4">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="grid grid-cols-12 gap-4 items-center p-4 rounded-lg bg-gray-800/40 border border-gray-700/50"
            >
              <div className="col-span-6">
                <h4 className="font-medium text-white">{setting.title}</h4>
                <p className="text-sm text-gray-400 mt-1">{setting.description}</p>
              </div>
              <div className="col-span-3 flex justify-center">
                <Switch
                  checked={setting.emailEnabled}
                  onCheckedChange={(value) => handleToggle(setting.id, "email", value)}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>
              <div className="col-span-3 flex justify-center">
                <Switch
                  checked={setting.appEnabled}
                  onCheckedChange={(value) => handleToggle(setting.id, "app", value)}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Preferences"}
        </Button>
      </CardFooter>
    </Card>
  )
}
