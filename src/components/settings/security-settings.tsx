"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { QrCode, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Current password is required.",
    }),
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type PasswordValues = z.infer<typeof passwordSchema>

interface SecuritySettingsProps {
  twoFactorEnabled: boolean
}

export function SecuritySettings({ twoFactorEnabled: initialTwoFactorEnabled }: SecuritySettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(initialTwoFactorEnabled)
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false)

  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  function onSubmit(data: PasswordValues) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log(data)
      setIsLoading(false)
      form.reset()
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      })
    }, 1000)
  }

  const handleTwoFactorToggle = (enabled: boolean) => {
    if (enabled && !twoFactorEnabled) {
      setShowTwoFactorSetup(true)
    } else if (!enabled && twoFactorEnabled) {
      // Simulate disabling 2FA
      setIsLoading(true)
      setTimeout(() => {
        setTwoFactorEnabled(false)
        setIsLoading(false)
        toast({
          title: "Two-factor authentication disabled",
          description: "Two-factor authentication has been disabled for your account.",
        })
      }, 1000)
    }
  }

  const setupTwoFactor = () => {
    setIsLoading(true)

    // Simulate 2FA setup
    setTimeout(() => {
      setTwoFactorEnabled(true)
      setShowTwoFactorSetup(false)
      setIsLoading(false)
      toast({
        title: "Two-factor authentication enabled",
        description: "Two-factor authentication has been enabled for your account.",
      })
    }, 1500)
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-white">Security Settings</CardTitle>
        <CardDescription>Manage your password and account security settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Form>
        </div>

        <Separator className="bg-gray-700" />

        <div>
          <h3 className="text-lg font-medium text-white mb-4">Two-Factor Authentication</h3>

          {showTwoFactorSetup ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-800/50 p-6 flex flex-col items-center justify-center space-y-4 border border-gray-700">
                <div className="h-48 w-48 bg-white p-4 rounded-lg flex items-center justify-center">
                  <QrCode className="h-full w-full text-gray-900" />
                </div>
                <div className="text-center">
                  <h4 className="text-md font-medium text-white">Scan QR Code</h4>
                  <p className="text-sm text-gray-400 mt-1">Scan this QR code with your authenticator app.</p>
                </div>
                <div className="flex flex-col w-full space-y-2">
                  <Input placeholder="Enter verification code" className="text-center" />
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1" onClick={() => setShowTwoFactorSetup(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      onClick={setupTwoFactor}
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/40 border border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-purple-900/30 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-400">
                    {twoFactorEnabled
                      ? "Your account is protected with two-factor authentication."
                      : "Add an extra layer of security to your account."}
                  </p>
                </div>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={handleTwoFactorToggle}
                className="data-[state=checked]:bg-purple-600"
                disabled={isLoading}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
