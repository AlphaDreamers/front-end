"use client";

import { BookmarkMinus, BookmarkPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "../ui/button";

import { toggleBookmark } from "@/lib/actions/gig";

interface BookmarkToggleProps {
  isBookmarked?: boolean;
  gigId: string;
}

const BookmarkToggle = ({
  gigId,
  isBookmarked: initalIsBookmarked,
}: BookmarkToggleProps) => {
  const [isBookmarked, setIsBookmarked] = useState(initalIsBookmarked);

  const onToggle = async () =>
    toast.promise(async () => await toggleBookmark(gigId), {
      loading: "Toggling bookmark...",
      success: () => {
        setIsBookmarked((prev) => !prev);
        return "Bookmark updated!";
      },
      error: "Failed to update bookmark",
    });

  return (
    <Button
      onClick={onToggle}
      variant={isBookmarked ? "default" : "outline"}
      size="sm"
    >
      {isBookmarked ? <BookmarkPlus /> : <BookmarkMinus />}
    </Button>
  );
};
export default BookmarkToggle;
