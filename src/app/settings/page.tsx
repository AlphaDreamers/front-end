"use client"

import { useState } from "react"

import { SettingsTabs } from "@/components/settings/settings-tabs"
import { PersonalInfo } from "@/components/settings/personal-info"
import { WalletManagement } from "@/components/settings/wallet-management"
import { NotificationPreferences } from "@/components/settings/notification-preferences"
import { SecuritySettings } from "@/components/settings/security-settings"
import { personalInfoData, walletData, notificationSettings, securityData } from "@/lib/settings-mock-data"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("personal")

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1">
          {activeTab === "personal" && <PersonalInfo initialData={personalInfoData} />}

          {activeTab === "wallet" && <WalletManagement connectedWallet={walletData} />}

          {activeTab === "notifications" && <NotificationPreferences initialSettings={notificationSettings} />}

          {activeTab === "security" && <SecuritySettings twoFactorEnabled={securityData.twoFactorEnabled} />}
        </div>
      </div>
    </div>
  )
}
