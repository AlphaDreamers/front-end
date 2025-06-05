import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GigHeaderProps {
  title: string;
  sellerName: string;
  sellerAvatar: string | null;
  sellerBadge?: string;
  sellerTier?: string;
  avgRating: number;
  reviewCount: number;
}

export default function GigHeader({
  title,
  sellerName,
  sellerAvatar,
  sellerBadge,
  sellerTier,
  avgRating,
  reviewCount,
}: GigHeaderProps) {
  // Function to get badge color based on tier
  const getBadgeColor = (tier?: string) => {
    switch (tier) {
      case "BRONZE":
        return "bg-amber-700";
      case "SILVER":
        return "bg-gray-400";
      case "GOLD":
        return "bg-yellow-500";
      case "PLATINUM":
        return "bg-blue-300";
      case "DIAMOND":
        return "bg-purple-400";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={sellerAvatar || undefined} alt={sellerName} />
            <AvatarFallback>
              {sellerName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{sellerName}</span>

          {sellerBadge && (
            <Badge
              className={`${getBadgeColor(sellerTier)} hover:${getBadgeColor(sellerTier)} transition-transform hover:scale-105`}
            >
              {sellerBadge}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(avgRating)
                    ? "fill-primary text-primary"
                    : "fill-none text-gray-400"
                }`}
              />
            ))}
          </div>
          <span className="text-sm">
            {avgRating.toFixed(1)} ({reviewCount} reviews)
          </span>
        </div>
      </div>
    </div>
  );
}
