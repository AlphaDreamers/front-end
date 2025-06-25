"use client";

import { BookmarkMinus, BookmarkPlus } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { toggleGigBookmark } from "@/lib/actions/gigs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useSession } from "next-auth/react";

interface BookmarkToggleProps {
  isBookmarked?: boolean;
  gigId: string;
}

const BookmarkToggle = ({
  gigId,
  isBookmarked: initialIsBookmarked = false,
}: BookmarkToggleProps) => {
  const { status } = useSession();
  const [isPending, startTransition] = useTransition();

  const [optimisticBookmarked, setOptimisticBookmarked] = useOptimistic(
    initialIsBookmarked,
    (currentState, newState: boolean) => newState
  );

  const onToggle = () => {
    if (isPending) return;

    startTransition(async () => {
      setOptimisticBookmarked(!optimisticBookmarked);

      try {
        const res = await toggleGigBookmark(gigId);
        if (res.success === false) {
          throw new Error(res.error || "Failed to toggle bookmark");
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
      }
    });
  };

  if (status !== "authenticated") {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onToggle}
            variant={optimisticBookmarked ? "default" : "outline"}
            size="sm"
          >
            {optimisticBookmarked ? <BookmarkMinus /> : <BookmarkPlus />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {optimisticBookmarked ? "Remove Bookmark" : "Add Bookmark"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BookmarkToggle;
