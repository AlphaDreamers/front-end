"use client";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { deleteGig } from "@/lib/actions";

interface DeleteGigButtonProps {
  gigId: string;
}
const DeleteGigButton = ({ gigId }: DeleteGigButtonProps) => {
  const handleDelete = async () => {
    toast.promise(
      async () => {
        await deleteGig(gigId);
      },
      {
        loading: "Deleting gig...",
        success: "Gig deleted successfully",
        error: "Failed to delete gig",
      }
    );
  };

  return (
    <Button variant="destructive" onClick={handleDelete}>
      Confirm
    </Button>
  );
};

export default DeleteGigButton;
