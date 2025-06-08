import { User } from "@/lib/types";
import UserDetails from "@/components/user-details";
import Rating from "@/components/rating";

interface GigHeaderProps {
  title: string;
  seller: User;
  avgRating: number;
  reviewCount: number;
}

export default function GigHeader({
  title,
  seller,
  avgRating,
  reviewCount,
}: GigHeaderProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>

      <div className="flex items-center gap-4 flex-wrap">
        <UserDetails user={seller} />

        <div className="flex items-center gap-1">
          <Rating rating={avgRating} />

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span> {avgRating.toFixed(1)}</span>
            <span>({reviewCount} reviews)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
