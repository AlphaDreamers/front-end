import { notFound } from "next/navigation";
import { Edit } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ProfileHeader from "@/components/profile/profile-header";
import ProfileAbout from "@/components/profile/profile-about";
import ProfilePortfolio from "@/components/profile/profile-portfolio";

import { getDetailedUser } from "@/lib/actions/profile";

import GigCard from "@/components/gig/gig-card";
import ReviewsSection from "@/components/reviews/reviews-list";
import { auth } from "@/lib/auth";
import { buildReviewFilter, REVIEW_FILTERS_CONFIG } from "@/lib/utils";
import { ReviewSearchParams } from "@/lib/types";
import { Prisma } from "@prisma/client";
import {
  getReviewCnt,
  getReviews,
  getReviewsStats,
} from "@/lib/actions/review";
import { format } from "date-fns";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<ReviewSearchParams>;
}) {
  const { username } = await params;

  const [user, session] = await Promise.all([
    getDetailedUser(username),
    auth(),
  ]);

  if (!user) {
    return notFound();
  }

  const isMe = session?.user?.id === user.id;

  return (
    <main className="flex flex-col gap-4">
      <ProfileHeader user={user} />

      {/* Edit Profile Button */}
      {isMe && (
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/profile/edit">
              <Edit />
              Edit Profile
            </Link>
          </Button>
        </div>
      )}

      {/* Content Tabs */}
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="gigs">Gigs ({user.gigCnt})</TabsTrigger>
          <TabsTrigger value="portfolio">
            Portfolio ({user.portfolioItemsCnt})
          </TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({user.ratingCnt})</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="mt-6">
          <ProfileAbout user={user} />
        </TabsContent>

        <TabsContent value="gigs" className="mt-6">
          {user.gigs.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                {isMe
                  ? "You haven't created any gigs yet."
                  : `${user.username} hasn't created any gigs yet.`}
              </p>
            </Card>
          ) : (
            <div className="grid xs:grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {user.gigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="portfolio" className="mt-6">
          <ProfilePortfolio items={user.portfolioItems} />
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <ReviewsSection
            fallback={
              <Card className="py-14">
                <CardHeader className="flex flex-col items-center justify-center text-center">
                  <CardTitle>No reviews yet</CardTitle>
                  <CardDescription className="flex flex-col items-center gap-1">
                    <span>New seller</span>
                    <span>Joined in {format(user.joinedAt, "MMMM yyyy")}</span>
                  </CardDescription>
                </CardHeader>
              </Card>
            }
            getReviewsData={async () => {
              const args = buildReviewFilter(await searchParams);
              const finalArgs: Prisma.ReviewFindManyArgs = {
                ...args,
                where: {
                  gig: {
                    sellerId: user.id,
                  },
                },
              };
              return await Promise.all([
                getReviews(finalArgs),
                getReviewCnt(finalArgs),
              ]);
            }}
            getReviewStats={() =>
              getReviewsStats({
                where: {
                  gig: {
                    sellerId: user.id,
                  },
                },
              })
            }
            getFilters={async () => REVIEW_FILTERS_CONFIG}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
