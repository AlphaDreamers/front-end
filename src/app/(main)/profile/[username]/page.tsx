import { notFound } from "next/navigation";
import { Edit } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ProfileHeader from "@/components/profile/profile-header";
import ProfileAbout from "@/components/profile/profile-about";
import ProfilePortfolio from "@/components/profile/profile-portfolio";

import { me } from "@/lib/actions/auth";
import { getDetailedUser } from "@/lib/actions/profile";

import GigCard from "@/components/gig/gig-card";
import ReviewsSection from "@/components/reviews/reviews-list";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const [user, { user: currentUser }] = await Promise.all([
    getDetailedUser(username),
    me(),
  ]);

  if (!user) {
    return notFound();
  }

  const isMe = currentUser?.id === user.id;

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
          <div className="grid xs:grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {user.gigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="portfolio" className="mt-6">
          <ProfilePortfolio items={user.portfolioItems} />
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <ReviewsSection
            initialReviews={user.reviews}
            reviewStats={{
              average: user.avgRating,
              total: user.ratingCnt,
              distribution: user.reviews.reduce(
                (acc, review) => {
                  acc[review.rating] = (acc[review.rating] || 0) + 1;
                  return acc;
                },
                {
                  1: 0,
                  2: 0,
                  3: 0,
                  4: 0,
                  5: 0,
                } as Record<number, number>
              ),
            }}
            totalReviews={user.ratingCnt}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
