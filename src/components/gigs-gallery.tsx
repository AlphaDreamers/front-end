import { Prisma } from "@prisma/client";
import GigCard from "./gig-card";
import DashboardGigCard from "./dashboard-gig-card";

interface GigsGalleryProps {
  isMe: boolean;
  viewerContext?: "owner" | "buyer" | "guest";
  gigs: Prisma.GigGetPayload<{
    select: {
      title: true;
      seller: {
        select: {
          avatar: true;
          username: true;
          badgeProgress: {
            select: {
              isFeatured: true;
              badge: {
                select: {
                  title: true;
                };
              };
            };
          };
        };
      };
      images: {
        select: {
          url: true;
        };
      };
      reviews: {
        select: {
          rating: true;
        };
      };
      tags: {
        select: {
          label: true;
        };
      };
      packages: {
        select: {
          title: true;
          price: true;
          orders: {
            select: {
              id: true;
            };
          };
        };
      };
      description: true;
      id: true;
      category: {
        select: {
          label: true;
        };
      };
    };
  }>[];
}

export function GigsGallery({ isMe, gigs }: GigsGalleryProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {gigs.map((gig) => {
        if (isMe) {
          return <DashboardGigCard key={gig.id} gig={gig} />;
        } else {
          return <GigCard key={gig.id} gig={gig} />;
        }
      })}
    </div>
  );
}
