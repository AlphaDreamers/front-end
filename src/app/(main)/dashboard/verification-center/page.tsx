import { redirect } from "next/navigation";
import Async from "@/components/async";
import {
  getVerificationStatus,
  getUserBadgesWithProgress,
  getUserAchievements,
} from "@/lib/actions/badges";
import {
  VerificationStatusCard,
  VerificationStatusCardSkeleton,
} from "@/components/verification/verification-status-card";
import {
  BadgesCard,
  BadgesCardSkeleton,
} from "@/components/verification/badges-card";
import {
  AchievementsCard,
  AchievementsCardsSkeleton,
} from "@/components/verification/achievements-card";
import PageTemplate from "@/components/templates/page-template";
import { auth } from "@/lib/auth";

export default async function VerificationCenterPage() {
  const session = await auth();

  if (!session) {
    redirect(
      `/sign-in?callback-url=${encodeURIComponent(`/dashboard/varification-center`)}`
    );
  }

  const fetchVerificationStatus = async () => {
    const status = await getVerificationStatus(session.user.id);
    if (status.success === false) {
      throw new Error(status.error || "Failed to fetch verification status");
    }
    return status.data;
  };

  const fetchUserBadgesWithProgress = async () => {
    const badges = await getUserBadgesWithProgress();
    if (badges.success === false) {
      throw new Error(badges.error || "Failed to fetch user badges");
    }
    return badges.data;
  };

  const fetchUserAchievements = async () => {
    const achievements = await getUserAchievements();
    if (achievements.success === false) {
      throw new Error(
        achievements.error || "Failed to fetch user achievements"
      );
    }
    return achievements.data;
  };

  return (
    <PageTemplate
      title="Verification Center"
      description="Complete verification steps to increase visibility and trust with buyers. Earn badges and showcase your achievements to stand out in the marketplace."
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <Async
            fetch={fetchVerificationStatus}
            fallback={<VerificationStatusCardSkeleton />}
          >
            {({ orderCompletion, profileCompletion, isKycVerified }) => (
              <VerificationStatusCard
                overallProgress={
                  (orderCompletion +
                    profileCompletion +
                    (isKycVerified ? 100 : 0)) /
                  3
                }
                profileCompletion={profileCompletion}
                isKycVerified={isKycVerified}
                orderCompletion={orderCompletion}
                recievedVerification={session.user.isVerified}
              />
            )}
          </Async>

          <Async
            fetch={fetchUserBadgesWithProgress}
            fallback={<BadgesCardSkeleton />}
          >
            {(badges) => <BadgesCard badges={badges} />}
          </Async>
        </div>

        <div className="w-full md:max-w-md">
          <Async
            fetch={fetchUserAchievements}
            fallback={<AchievementsCardsSkeleton />}
          >
            {(achievements) => <AchievementsCard achievements={achievements} />}
          </Async>
        </div>
      </div>
    </PageTemplate>
  );
}
