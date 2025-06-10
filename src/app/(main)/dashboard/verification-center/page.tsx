import { redirect } from "next/navigation";
import Async from "@/components/async";
import { me } from "@/lib/actions/auth";
import {
  getVerificationStatus,
  getBadgesProgress,
  getAchievements,
} from "@/lib/actions/verification";
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

export default async function VerificationCenterPage() {
  const { user, error } = await me();

  if (!user?.isVerified) {
    redirect(
      `/sign-in?callback-url=${encodeURIComponent(`/dashboard/varification-center`)}&error=${encodeURIComponent(
        error === "INVALID_TOKEN"
          ? "Invalid token. Please log in again"
          : error === "TOKEN_EXPIRED"
            ? "Your session has expired. Please log in again"
            : "You must be logged in to access this page"
      )}`
    );
  }

  return (
    <PageTemplate
      title="Verification Center"
      description="Complete verification steps to increase visibility and trust with buyers. Earn badges and showcase your achievements to stand out in the marketplace."
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <Async
            fetch={() => getVerificationStatus(user.id)}
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
                recievedVerification={user.isProfileVerified}
              />
            )}
          </Async>

          <Async fetch={getBadgesProgress} fallback={<BadgesCardSkeleton />}>
            {(badges) => <BadgesCard badges={badges} />}
          </Async>
        </div>

        <div className="w-full md:max-w-md">
          <Async
            fetch={getAchievements}
            fallback={<AchievementsCardsSkeleton />}
          >
            {(achievements) => <AchievementsCard achievements={achievements} />}
          </Async>
        </div>
      </div>
    </PageTemplate>
  );
}
