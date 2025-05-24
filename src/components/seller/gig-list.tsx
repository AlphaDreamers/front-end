"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit, Trash2, MoreVertical, Power, PowerOff, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Gig {
  id: string
  title: string
  image: string
  price: number
  status: "active" | "paused" | "draft" | "under_review"
  orders: number
  views: number
  createdAt: string
  category: string
}

interface GigListProps {
  gigs: Gig[]
  onEdit: (gig: Gig) => void
  onDelete: (gig: Gig) => void
  onToggleStatus: (gig: Gig) => void
}

export function GigList({ gigs, onEdit, onDelete, onToggleStatus }: GigListProps) {
  const [gigToDelete, setGigToDelete] = useState<Gig | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const getStatusColor = (status: Gig["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/30"
      case "paused":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
      case "draft":
        return "bg-gray-500/10 text-gray-400 border-gray-500/30"
      case "under_review":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusLabel = (status: Gig["status"]) => {
    switch (status) {
      case "active":
        return "Active"
      case "paused":
        return "Paused"
      case "draft":
        return "Draft"
      case "under_review":
        return "Under Review"
      default:
        return status.replace("_", " ")
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return "Invalid date"
    }
  }

  const handleDeleteClick = (gig: Gig) => {
    setGigToDelete(gig)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (gigToDelete) {
      onDelete(gigToDelete)
      setIsDeleteDialogOpen(false)
      setGigToDelete(null)
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg">Your Gigs</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-xs font-medium text-muted-foreground">Gig</th>
                <th className="text-center p-4 text-xs font-medium text-muted-foreground">Price</th>
                <th className="text-center p-4 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-center p-4 text-xs font-medium text-muted-foreground">Orders</th>
                <th className="text-center p-4 text-xs font-medium text-muted-foreground">Views</th>
                <th className="text-center p-4 text-xs font-medium text-muted-foreground">Created</th>
                <th className="text-right p-4 text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {gigs.map((gig) => (
                <tr key={gig.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                        <img
                          src={gig.image || "/placeholder.svg"}
                          alt={gig.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{gig.title}</div>
                        <div className="text-xs text-muted-foreground">{gig.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="font-medium text-purple-400">{gig.price} SOL</div>
                  </td>
                  <td className="p-4 text-center">
                    <Badge variant="outline" className={getStatusColor(gig.status)}>
                      {getStatusLabel(gig.status)}
                    </Badge>
                  </td>
                  <td className="p-4 text-center">{gig.orders}</td>
                  <td className="p-4 text-center">{gig.views}</td>
                  <td className="p-4 text-center text-xs text-muted-foreground">{formatDate(gig.createdAt)}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`/gigs/${gig.id}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">View Gig</span>
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEdit(gig)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleStatus(gig)}
                        className={gig.status === "active" ? "text-yellow-400" : "text-green-400"}
                      >
                        {gig.status === "active" ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                        <span className="sr-only">{gig.status === "active" ? "Pause Gig" : "Activate Gig"}</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More Options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(gig)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(gig)} className="text-red-500">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Gig</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete <span className="font-semibold">{gigToDelete?.title}</span>? This action
              cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
