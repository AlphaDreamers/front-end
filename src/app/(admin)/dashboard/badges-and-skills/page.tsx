import { Card, CardContent, Progress } from "@/components/ui";
import { cn } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";
import { Award } from "lucide-react";

const prisma = new PrismaClient();

export default async function Page() {
  const userId = "1e72d5d2-63c6-464e-a37d-d097d38a6a0c";
  const badges = await prisma.badge.findMany({
    include: {
      userBadges: {
        where: {
          userId: userId,
        },
      },
    },
  });

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        {badges.map((badge) => (
          <Card
            key={badge.id}
            className={cn(
              "py-4",
              badge.userBadges[0]?.isFeatured && "border-primary"
            )}
          >
            <CardContent className="px-4 flex flex-row items-center gap-4">
              <div className="flex flex-row items-center w-2/5">
                <Award
                  className={cn(
                    "min-w-12 stroke-[1.5] min-h-12 aspect-square rounded-full p-2.5 border text-background",
                    {
                      "bg-gradient-to-br from-stone-400 to-stone-600":
                        badge.userBadges[0]?.tier === undefined,
                      "bg-gradient-to-br from-orange-400 to-orange-600":
                        badge.userBadges[0]?.tier === "BRONZE",
                      "bg-gradient-to-br from-blue-400 to-blue-600":
                        badge.userBadges[0]?.tier === "SILVER",
                      "bg-gradient-to-br from-amber-400 to-amber-600":
                        badge.userBadges[0]?.tier === "GOLD",
                      "bg-gradient-to-br from-indigo-400 to-indigo-600":
                        badge.userBadges[0]?.tier === "PLATINUM",
                      "bg-gradient-to-br from-emerald-400 to-emerald-600":
                        badge.userBadges[0]?.tier === "DIAMOND",
                    }
                  )}
                />
                <span className="font-mono font-medium ml-4">
                  {badge.label}
                </span>
              </div>

              <Progress
                value={
                  badge.userBadges[0]?.tier === undefined
                    ? 0
                    : badge.userBadges[0]?.tier === "BRONZE"
                    ? 25
                    : badge.userBadges[0]?.tier === "SILVER"
                    ? 50
                    : badge.userBadges[0]?.tier === "GOLD"
                    ? 75
                    : badge.userBadges[0]?.tier === "PLATINUM"
                    ? 90
                    : badge.userBadges[0]?.tier === "DIAMOND"
                    ? 100
                    : 0
                }
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
