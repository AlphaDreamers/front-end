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
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Copy, AlertTriangle, Check } from "lucide-react"

interface CreateWalletModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (seedPhrase: string) => void
}

export default function CreateWalletModal({ isOpen, onClose, onConfirm }: CreateWalletModalProps) {
  const [confirmed, setConfirmed] = useState(false)
  const [copied, setCopied] = useState(false)

  // Generate a mock seed phrase
  const seedPhrase =
    "abandon ability able about above absent absorb abstract absurd abuse access accident account accuse achieve acid acoustic acquire across act action actor actress actual"

  const handleCopy = () => {
    navigator.clipboard.writeText(seedPhrase)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConfirm = () => {
    if (confirmed) {
      onConfirm(seedPhrase)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#121212] border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Solana Wallet</DialogTitle>
          <DialogDescription>
            We've generated a new wallet for you. Please save your seed phrase securely.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-start gap-2 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-500">Important Security Warning</p>
              <p className="text-muted-foreground mt-1">
                This seed phrase is the only way to recover your wallet. Write it down and store it in a secure
                location. Never share it with anyone.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="p-4 bg-[#1A1A1A] border border-primary/20 rounded-lg font-mono text-sm break-all">
              {seedPhrase}
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full hover:bg-primary/20"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirm-save"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked as boolean)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor="confirm-save" className="text-sm font-medium">
              I have saved my seed phrase in a secure location
            </Label>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:w-auto w-full">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!confirmed}
            className="sm:w-auto w-full bg-primary hover:bg-primary/90 transition-all"
          >
            Complete Setup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
