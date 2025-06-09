"use client";

import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import { deleteGig } from "@/lib/actions/gig";
import { useState } from "react";

interface GigDeleteButtonProps {
  gigId: string;
}

const GigDeleteButton = ({ gigId }: GigDeleteButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleDelete = async () =>
    toast.promise(async () => deleteGig(gigId), {
      loading: "Deleting gig...",
      success: () => {
        setOpen(false);

        return "Gig deleted successfully.";
      },
      error: "Failed to delete gig. Please try again.",
    });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Gig</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this gig? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="outline">
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => handleDelete()}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GigDeleteButton;
