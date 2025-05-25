import { Prisma } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface RecentActivityCardProps {
  notifications?: Prisma.NotificationGetPayload<{
    select: {
      id: true;
      type: true;
      title: true;
      description: true;
      createdAt: true;
      isRead: true;
    };
  }>[];
}

const RecentActivityCard = ({
  notifications = [],
}: RecentActivityCardProps) => {
  return (
    <Card className="lg:w-2/3 pb-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>

        <Button variant="ghost" size="sm">
          View All
        </Button>
      </CardHeader>

      <CardContent className="px-0 divide-y">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={cn(
              "p-4 transition-colors flex items-center justify-between gap-4",
              notification.isRead
                ? "bg-secondary/10 hover:bg-secondary/35"
                : "bg-primary/5 border-l-2 border-l-primary hover:bg-primary/15"
            )}
          >
            <div className="flex items-center justify-center">
              {<MessageSquare className="size-5 text-primary" />}
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <p className="text-base font-medium flex items-center gap-2">
                  {notification.title}
                </p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(notification.createdAt)}
                </span>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
export default RecentActivityCard;
