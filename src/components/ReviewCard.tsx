"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "./ui/card";
import { formatDate } from "@/lib/utils";
import Rating from "./Rating";
import { useState } from "react";
import { buttonVariants } from "./ui/button";

interface ReviewCardProps {
  author: {
    avatar?: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  rating: number;
  title: string;
  text: string;
  maxLength?: number;
}

const ReviewCard = ({
  author,
  createdAt,
  rating,
  title,
  text,
  maxLength = 100, // Default max length for truncation
}: ReviewCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine if the text needs to be truncated
  const shouldTruncate = text.length > maxLength;
  const displayText =
    shouldTruncate && !isExpanded ? `${text.substring(0, maxLength)}...` : text;

  return (
    <Card className="max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2.5">
          {author.avatar ? (
            <Image
              src={author.avatar}
              alt={`${author.firstName} ${author.lastName}`}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              {author.firstName.charAt(0)}
              {author.lastName.charAt(0)}
            </div>
          )}

          <div className="flex flex-col">
            <p className="tracking-wide font-semibold">
              {author.firstName} {author.lastName}
            </p>
            <time
              dateTime={createdAt.toISOString()}
              className="text-xs text-muted-foreground"
            >
              {formatDate(createdAt)}
            </time>
          </div>
        </div>
        <div>
          <Rating rating={rating} />
        </div>
      </CardHeader>

      <CardContent>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <div className="leading-relaxed">
          {displayText}
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className={buttonVariants({
                variant: "link",
                size: "sm",
                className: "inline p-0 m-0",
              })}
            >
              {isExpanded ? " Show less" : " Show more"}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
