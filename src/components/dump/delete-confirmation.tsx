"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Gig } from "@/lib/mock-data"

interface DeleteConfirmationProps {
  gig: Gig | null
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteConfirmation({ gig, open, onClose, onConfirm }: DeleteConfirmationProps) {
  if (!gig) return null

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this gig?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your gig and remove it from our servers.
            <div className="mt-2 p-3 bg-muted/20 rounded-md">
              <p className="font-medium">{gig.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {gig.orders} orders • {gig.packages.length} packages
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-500 hover:bg-red-600">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
