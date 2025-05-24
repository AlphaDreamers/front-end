"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Eye, EyeOff } from "lucide-react"

interface ImportWalletModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (privateKey: string) => void
}

export default function ImportWalletModal({ isOpen, onClose, onConfirm }: ImportWalletModalProps) {
  const [privateKey, setPrivateKey] = useState("")
  const [password, setPassword] = useState("")
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [error, setError] = useState("")

  const handleImport = () => {
    // Basic validation
    if (!privateKey.trim()) {
      setError("Please enter a private key or seed phrase")
      return
    }

    // In a real app, you would validate the format of the private key
    if (privateKey.length < 20) {
      setError("Invalid private key or seed phrase format")
      return
    }

    setError("")
    onConfirm(privateKey)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#121212] border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Import Existing Wallet</DialogTitle>
          <DialogDescription>
            Enter your private key or seed phrase to import your existing Solana wallet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-start gap-2 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-500">Security Warning</p>
              <p className="text-muted-foreground mt-1">
                Only enter your private key or seed phrase on trusted devices. Make sure no one is watching your screen.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="private-key" className="text-sm font-medium">
                Private Key or Seed Phrase
              </Label>
              <div className="relative">
                <Textarea
                  id="private-key"
                  placeholder="Enter your private key or seed phrase"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  className={`resize-none h-24 pr-10 bg-[#1A1A1A] border ${error ? "border-red-500" : "border-primary/20"}`}
                  type={showPrivateKey ? "text" : "password"}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full hover:bg-primary/20"
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                >
                  {showPrivateKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet-password" className="text-sm font-medium">
                App Password (Optional)
              </Label>
              <Input
                id="wallet-password"
                type="password"
                placeholder="Create a password for additional security"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#1A1A1A] border-primary/20"
              />
              <p className="text-xs text-muted-foreground">
                This password encrypts your wallet data within the app. It's not a blockchain password.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:w-auto w-full">
            Cancel
          </Button>
          <Button onClick={handleImport} className="sm:w-auto w-full bg-primary hover:bg-primary/90 transition-all">
            Import Wallet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
