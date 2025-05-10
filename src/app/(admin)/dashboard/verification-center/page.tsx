import { cn } from "@/lib/utils";
import { getUserBadges, me } from "@/lib/actions";
import { redirect } from "next/navigation";
import {
  Award,
  CheckCircle,
  Clock,
  FileCheck,
  Info,
  Medal,
  Phone,
  Shield,
  Trophy,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Progress,
  Separator,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
import AchievementsCard from "./AchievementsCard";
import Icon, { LucideIconString } from "@/components/Icon";

export default async function Page() {
  const user = await me();

  if (!user?.verified) {
    redirect("/sign-in?callback-url=/dashboard/verification-center");
  }

  const badges = await getUserBadges();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl text-primary font-bold mb-2">
          Verification Center
        </h2>
        <p className="text-muted-foreground">
          Complete verification steps to increase visibility and trust with
          buyers
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-1 flex-col gap-4">
          <VerficationStatusCard />
          <BadgesCard badges={badges} />
        </div>

        <AchievementsCard badges={badges} />
      </div>
    </div>
  );
}

const VerficationStatusCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Shield className="text-primary mr-3" size={22} />
          Verification Status
        </CardTitle>
        <CardDescription className="text-sm">
          Complete these requirements to become a verified seller and boost your
          marketplace presence.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-4">
        {[
          {
            id: "profile-completion",
            name: "Complete your profile (100%)",
            icon: <CheckCircle size={16} className="text-green-500" />,
            progress: 100,
          },
          {
            id: "phone-verification",
            name: "Verify phone number",
            icon: <Phone size={16} className="text-gray-400" />,
            progress: 0,
          },
          {
            id: "completed-orders",
            name: "Complete 5 orders with positive ratings",
            icon: <FileCheck size={16} className="text-gray-400" />,
            progress: 60,
          },
        ].map((requirement, index) => (
          <div className="flex flex-col gap-3" key={index}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {requirement.progress === 100 ? (
                  <div className="rounded-full bg-primary/10 size-10 flex items-center justify-center border border-primary">
                    <CheckCircle size={20} className="text-primary" />
                  </div>
                ) : (
                  <div className="rounded-full bg-muted size-10 flex items-center justify-center border">
                    <Clock size={20} className="text-muted-foreground" />
                  </div>
                )}
                <span className="font-medium">{requirement.name}</span>
              </div>

              {requirement.progress !== 100 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Complete
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Progress value={requirement.progress} className="h-2 flex-1" />
              <span
                className={`text-xs font-medium w-10 ${
                  requirement.progress === 100
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >
                {requirement.progress}%
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const BadgesCard = ({
  badges,
}: {
  badges: Prisma.BadgeGetPayload<{
    include: {
      userBadges: true;
    };
  }>[];
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center">
            <Award className="text-primary mr-2" />
            <h2>Your Badges</h2>
          </div>
        </CardTitle>

        <CardDescription>
          Earn badges by completing tasks and achieving milestones. Badges
          showcase your skills and accomplishments.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        <Table>
          <TableCaption>
            Your badges and progress towards earning new ones. Click on a badge
            to view details and upload proof if required.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Badge</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Criteria</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {badges.map((badge) => {
              const userBadge = badge.userBadges[0];

              return (
                <TableRow key={badge.id}>
                  <TableCell>
                    <div
                      className={cn(
                        "rounded-full bg-card size-12 flex items-center justify-center mx-auto border"
                      )}
                      style={{
                        color: badge.color,
                      }}
                    >
                      <Icon icon={badge.icon as LucideIconString} size={20} />
                    </div>
                  </TableCell>

                  <TableCell className="flex items-center gap-2">
                    <h4>{badge.label}</h4>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info size={14} />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px]">
                          <h5 className="font-medium mb-1">{badge.label}</h5>
                          <p>{badge.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>

                  <TableCell></TableCell>

                  <TableCell className="flex items-center">
                    {userBadge.tier === "PLATINUM" ? (
                      <div className="text-primary text-sm">Completed</div>
                    ) : (
                      <div className="flex flex-col items-end">
                        <div className="text-xs text-chart-3 mb-2">
                          In Progress - {userBadge.progress.toFixed(0)}%
                        </div>

                        <Progress
                          value={userBadge.progress}
                          className="bg-secondary *:bg-chart-3"
                        />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
