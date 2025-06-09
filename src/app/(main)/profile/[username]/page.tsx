import { notFound } from "next/navigation";
import { Edit } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ProfileHeader from "@/components/profile/profile-header";
import ProfileAbout from "@/components/profile/profile-about";
import ProfilePortfolio from "@/components/profile/profile-portfolio";
import ProfileReviews from "@/components/profile/profile-reviews";
import { GigsGallery } from "@/components/gigs-gallery";

import { me } from "@/lib/actions/auth";
import { getDetailedUser, getProfileReviews } from "@/lib/actions/profile";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const [profileData, currentUser] = await Promise.all([
    getDetailedUser(username),
    me(),
  ]);

  if (!profileData) {
    return notFound();
  }

  const { user, gigs, portfolioItems, reviewStats } = profileData;
  const isMe = currentUser?.id === user.id;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Edit Profile Button */}
        {isMe && (
          <div className="flex justify-end">
            <Button asChild>
              <Link href="/profile/edit">
                <Edit className="size-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
          </div>
        )}

        {/* Content Tabs */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="gigs">Gigs ({gigs.length})</TabsTrigger>
            <TabsTrigger value="portfolio">
              Portfolio ({portfolioItems.length})
            </TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({reviewStats.total})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-6">
            <ProfileAbout
              user={user}
              socialLinks={user.socialLinks}
              skills={user.skills}
            />
          </TabsContent>

          <TabsContent value="gigs" className="mt-6">
            <GigsGallery gigs={gigs} isMe={isMe} />
          </TabsContent>

          <TabsContent value="portfolio" className="mt-6">
            <ProfilePortfolio items={portfolioItems} />
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <ProfileReviews
              userId={user.id}
              stats={reviewStats}
              fetchReviews={getProfileReviews}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
