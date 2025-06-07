import Link from "next/link"
import { ArrowLeft, Settings, User, Bell, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

export default function AccountManagement() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Help Center
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Account Management</h1>
              <p className="text-muted-foreground">Manage your profile, settings, and security</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-500" />
                Account Management Basics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your account is the foundation of your experience on our platform. Proper account management ensures
                security, helps you build credibility, and allows you to customize your experience. From profile
                settings to security configurations, managing your account effectively is key to success.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-sm">Profile Management</h4>
                  <p className="text-xs text-muted-foreground">Showcase your skills</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Bell className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-sm">Notifications</h4>
                  <p className="text-xs text-muted-foreground">Stay informed</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-sm">Security</h4>
                  <p className="text-xs text-muted-foreground">Protect your account</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Profile Settings
              </CardTitle>
              <CardDescription>Keep your profile updated and professional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Basic Information:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Profile Picture</p>
                        <p className="text-xs text-muted-foreground">
                          Upload a professional headshot (recommended: 400x400px)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Display Name</p>
                        <p className="text-xs text-muted-foreground">How others will see your name on the platform</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Professional Title</p>
                        <p className="text-xs text-muted-foreground">Brief description of your expertise</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Bio/Description</p>
                        <p className="text-xs text-muted-foreground">Detailed overview of your skills and experience</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-secondary">Professional Details:</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Skills & Expertise</p>
                        <p className="text-xs text-muted-foreground">Add relevant skills and proficiency levels</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Portfolio</p>
                        <p className="text-xs text-muted-foreground">Showcase your best work samples</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Certifications</p>
                        <p className="text-xs text-muted-foreground">Add relevant certifications and credentials</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Availability</p>
                        <p className="text-xs text-muted-foreground">Set your working hours and availability status</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Profile Optimization Tips</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-green-600 mb-2">✓ Best Practices:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Use a clear, professional profile photo</li>
                      <li>• Write a compelling bio that highlights your unique value</li>
                      <li>• Keep your skills list relevant and up-to-date</li>
                      <li>• Regularly update your portfolio with recent work</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-red-600 mb-2">✗ Avoid:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Using generic or unprofessional photos</li>
                      <li>• Leaving sections incomplete or outdated</li>
                      <li>• Overstating skills or experience</li>
                      <li>• Using inappropriate language or content</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-green-500" />
                Notification Settings
              </CardTitle>
              <CardDescription>Customize how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">New Message Alerts</h4>
                    <p className="text-sm text-muted-foreground">Get notified when you receive new messages</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">Order Updates</h4>
                    <p className="text-sm text-muted-foreground">Notifications about order status changes</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">Payment Notifications</h4>
                    <p className="text-sm text-muted-foreground">Alerts for payments and transactions</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">Marketing Communications</h4>
                    <p className="text-sm text-muted-foreground">Platform updates, tips, and promotional content</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">Browser Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">Real-time notifications in your browser</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Notification Frequency</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Choose how often you want to receive digest emails:
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline">Immediate</Badge>
                  <Badge variant="secondary">Daily</Badge>
                  <Badge variant="outline">Weekly</Badge>
                  <Badge variant="outline">Never</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" />
                Account Security
              </CardTitle>
              <CardDescription>Protect your account with these security measures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Authentication:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <div>
                        <p className="text-sm font-medium">Two-Factor Authentication</p>
                        <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <div>
                        <p className="text-sm font-medium">Password Strength</p>
                        <p className="text-xs text-muted-foreground">Last updated 30 days ago</p>
                      </div>
                      <Badge variant="outline">Strong</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <div>
                        <p className="text-sm font-medium">Login Alerts</p>
                        <p className="text-xs text-muted-foreground">Get notified of new logins</p>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-secondary">Wallet Security:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <div>
                        <p className="text-sm font-medium">Wallet Connection</p>
                        <p className="text-xs text-muted-foreground">Phantom wallet connected</p>
                      </div>
                      <Badge variant="secondary">Verified</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <div>
                        <p className="text-sm font-medium">Transaction Limits</p>
                        <p className="text-xs text-muted-foreground">Daily spending limit</p>
                      </div>
                      <Badge variant="outline">$5,000</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <div>
                        <p className="text-sm font-medium">Withdrawal Approval</p>
                        <p className="text-xs text-muted-foreground">Email confirmation required</p>
                      </div>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Security Recommendations</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Use a Strong Password</p>
                        <p className="text-xs text-muted-foreground">
                          At least 12 characters with mixed case, numbers, and symbols
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Enable 2FA</p>
                        <p className="text-xs text-muted-foreground">Use an authenticator app for maximum security</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Regular Password Updates</p>
                        <p className="text-xs text-muted-foreground">Change your password every 3-6 months</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Monitor Account Activity</p>
                        <p className="text-xs text-muted-foreground">
                          Review login history and active sessions regularly
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Secure Your Wallet</p>
                        <p className="text-xs text-muted-foreground">Never share your seed phrase or private keys</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        •
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">Use Trusted Networks</p>
                        <p className="text-xs text-muted-foreground">Avoid public WiFi for sensitive operations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-3">Account Management Support</h3>
              <p className="text-primary-foreground/80 mb-4">
                Need help managing your account settings or have security concerns? Our account support team is here to
                assist.
              </p>
              <Button variant="secondary">Contact Account Support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
