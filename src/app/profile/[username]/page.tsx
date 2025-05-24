import Image from "next/image";
import { Award, Clock, Globe, MapPin, MessageSquare } from "lucide-react";
import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ProfileHeader } from "@/components/profile/profile-header";
import { StatsBar } from "@/components/profile/stats-bar";
import { SkillsSection } from "@/components/profile/skills-section";
import { GigsGallery } from "@/components/gigs-gallery";
import ReviewsSection from "@/components/reviews-section";
import PortfolioSection from "@/components/profile/portfolio-section";
import { getCurrentUser, getSimilarSellers } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import SimilarSellersCard from "@/components/profile/similar-sellers-card";
import ConnectCard from "@/components/profile/connect-card";

const getUser = async (username: string) => {
  return await prisma.user.findFirst({
    where: {
      username,
    },
    select: {
      id: true,
      gigs: {
        select: {
          title: true,
          seller: {
            select: {
              avatar: true,
              username: true,
              badgeProgress: {
                select: {
                  isFeatured: true,
                  badge: {
                    select: {
                      title: true,
                    },
                  },
                },
              },
            },
          },
          images: {
            select: {
              url: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
          tags: {
            select: {
              label: true,
            },
          },
          packages: {
            select: {
              title: true,
              price: true,
              orders: {
                select: {
                  id: true,
                },
              },
            },
          },
          description: true,
          id: true,
          category: {
            select: {
              label: true,
            },
          },
        },
      },
      firstName: true,
      lastName: true,
      username: true,
      avatar: true,
      banner: true,
      isKycVerified: true,
      headline: true,
      bio: true,
      badgeProgress: {
        select: {
          badge: {
            select: {
              title: true,
            },
          },
          isFeatured: true,
          highestTier: true,
        },
      },
      socialLinks: true,
      portfolioItems: {
        select: {
          id: true,
          title: true,
          images: true,
          description: true,
          url: true,
        },
        take: 8,
      },
      reviews: {
        select: {
          id: true,
          rating: true,
          createdAt: true,
          author: {
            select: {
              avatar: true,
              firstName: true,
              lastName: true,
              username: true,
            },
          },
          title: true,
          description: true,
        },
        take: 3,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
};

const getReviewRatings = async (userId: string) => {
  return await prisma.review.findMany({
    where: {
      gig: {
        sellerId: userId,
      },
    },
    select: {
      rating: true,
    },
  });
};

export type ProfileUserReturnType = Awaited<ReturnType<typeof getUser>>;

export default async function ProfilePage({
  params,
}: {
  params: Promise<{
    username: string;
  }>;
}) {
  const { username } = await params;

  const user = await getUser(username);

  if (!user) {
    return notFound();
  }

  const me = await getCurrentUser();

  const isMe = me?.id === user.id;

  const isAuth = !!me;

  const reviewRatings = await getReviewRatings(user.id);

  const statistics = {
    total: reviewRatings.length,
    average:
      reviewRatings.reduce((acc, review) => acc + review.rating, 0) /
      Math.max(reviewRatings.length, 1),
    distribution: reviewRatings.reduce(
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
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-2/3 flex flex-col gap-4">
        <ProfileHeader user={user} isMe={isMe} isAuth={isAuth} />

        <StatsBar user={user} />

        <div>
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="gigs">Gigs</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            </TabsList>

            <TabsContent value="about">
              <AboutHeaderCard />

              <SkillsSection />

              <CertificationsCard />
            </TabsContent>

            <TabsContent value="gigs">
              <GigsGallery gigs={user.gigs} isMe={isMe} />
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsSection
                userId={user.id}
                statistics={statistics}
                initialReviews={user.reviews}
              />
            </TabsContent>

            <TabsContent value="portfolio">
              <PortfolioSection portfolioItems={user.portfolioItems} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="flex flex-col lg:w-1/3 gap-4">
        {user.socialLinks.length > 0 && (
          <ConnectCard links={user.socialLinks} />
        )}

        <SimilarSellersCard getSimilarSellers={getSimilarSellers} />
      </div>
    </div>
  );
}

const AboutHeaderCard = () => {
  return (
    <Card className="border-0">
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Blockchain developer with 5+ years of experience building
          decentralized applications and smart contracts. Specialized in Solana
          ecosystem development with a focus on marketplace solutions and NFT
          projects.
        </p>

        <div className="flex flex-wrap gap-4 pt-4">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-muted-foreground" />
            <span>United States</span>
            <Image
              src="/placeholder.svg?height=16&width=24"
              alt="US Flag"
              width={24}
              height={16}
              className="ml-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <Globe size={16} className="text-muted-foreground" />
            <span>English (Native), Spanish (Conversational)</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={16} className="text-muted-foreground" />
            <span>Member since March 2022</span>
          </div>

          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-muted-foreground" />
            <span>
              Avg. Response: <span className="font-medium">2 hours</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CertificationsCard = () => {
  return (
    <Card className="border-0">
      <CardHeader>
        <CardTitle>Certifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3 rounded-lg bg-[#252525] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9F7AEA]/20">
              <Award size={20} className="text-[#9F7AEA]" />
            </div>
            <div>
              <h4 className="font-medium">Solana Certified Developer</h4>
              <p className="text-sm text-muted-foreground">
                Solana Foundation • 2023
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg bg-[#252525] p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9F7AEA]/20">
              <Award size={20} className="text-[#9F7AEA]" />
            </div>
            <div>
              <h4 className="font-medium">Web3 Security Specialist</h4>
              <p className="text-sm text-muted-foreground">
                Blockchain Council • 2022
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
