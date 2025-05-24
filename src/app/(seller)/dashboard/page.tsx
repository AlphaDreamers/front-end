"use client"

import { WelcomeHeader } from "@/components/dashboard/welcome-header"
import { StatsSummary } from "@/components/dashboard/stats-summary"
import { WalletWidget } from "@/components/dashboard/wallet-widget"
import { QuickLinks } from "@/components/dashboard/quick-links"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { ActiveOrders } from "@/components/dashboard/active-orders"
import { mockUser, mockStats, mockWallet, mockActivities, mockOrders } from "@/lib/mock-data"

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 px-4 animate-fadeIn">
      <WelcomeHeader user={mockUser} unreadNotifications={2} />

      <StatsSummary stats={mockStats} userType={mockUser.userType} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <WalletWidget
          balance={mockWallet.balance}
          address={mockWallet.address}
          pendingTransactions={mockWallet.pendingTransactions}
        />

        <div className="lg:col-span-2">
          <QuickLinks />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActiveOrders orders={mockOrders} />
        </div>

        <div>
          <ActivityFeed activities={mockActivities} />
        </div>
      </div>
    </div>
  )
}
