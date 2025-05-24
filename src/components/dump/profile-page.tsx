import Link from "next/link";
import Image from "next/image";
import {
  Award,
  Clock,
  Github,
  Globe,
  Instagram,
  Linkedin,
  MapPin,
  MessageSquare,
  Star,
  Twitter,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ProfileHeader } from "@/components/profile/profile-header";
import { StatsBar } from "@/components/profile/stats-bar";
import { SkillsSection } from "@/components/profile/skills-section";
import { GigsGallery } from "@/components/gigs-gallery";
import { ReviewsSection } from "@/components/reviews-section";
import { PortfolioSection } from "@/components/profile/portfolio-section";
import { Prisma } from "@prisma/client";

interface ProfilePageProps {
  user: Prisma.UserGetPayload<{
    select: {
      id: true;
      gigs: {
        select: {
          packages: {
            select: {
              _count: {
                select: {
                  orders: true;
                };
              };
            };
          };
          reviews: {
            select: {
              rating: true;
            };
          };
        };
      };
      firstName: true;
      lastName: true;
      username: true;
      avatar: true;
      banner: true;
      isKycVerified: true;
      headline: true;
      bio: true;
      badgeProgress: {
        select: {
          badge: {
            select: {
              title: true;
            };
          };
          isFeatured: true;
          highestTier: true;
        };
      };
    };
  }>;
  isAuth: boolean;
  isMe: boolean;
}

export default function ProfilePage({ user, isAuth, isMe }: ProfilePageProps) {
  const viewerContext = "buyer";

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProfileHeader user={user} isMe={isMe} isAuth={isAuth} />

          <StatsBar user={user} />

          <div className="mt-8">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="gigs">Gigs</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6 space-y-8">
                <Card className="bg-[#1E1E1E] border-0">
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Blockchain developer with 5+ years of experience building
                      decentralized applications and smart contracts.
                      Specialized in Solana ecosystem development with a focus
                      on marketplace solutions and NFT projects.
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
                        <MessageSquare
                          size={16}
                          className="text-muted-foreground"
                        />
                        <span>
                          Avg. Response:{" "}
                          <span className="font-medium">2 hours</span>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <SkillsSection />

                <Card className="bg-[#1E1E1E] border-0">
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
                          <h4 className="font-medium">
                            Solana Certified Developer
                          </h4>
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
                          <h4 className="font-medium">
                            Web3 Security Specialist
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Blockchain Council • 2022
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gigs" className="mt-6">
                <GigsGallery viewerContext={viewerContext} />
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <ReviewsSection />
              </TabsContent>

              <TabsContent value="portfolio" className="mt-6">
                <PortfolioSection />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#1E1E1E] border-0">
            <CardHeader>
              <CardTitle className="text-base">Connect</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="#"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#252525] hover:bg-[#333333] transition-colors"
                      >
                        <Twitter size={18} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Twitter</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="#"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#252525] hover:bg-[#333333] transition-colors"
                      >
                        <Github size={18} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>GitHub</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="#"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#252525] hover:bg-[#333333] transition-colors"
                      >
                        <Linkedin size={18} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>LinkedIn</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="#"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#252525] hover:bg-[#333333] transition-colors"
                      >
                        <Instagram size={18} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Instagram</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="#"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#252525] hover:bg-[#333333] transition-colors"
                      >
                        <Globe size={18} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Website</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  For secure communication, please use the platform&apos;s
                  messaging system.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E1E1E] border-0">
            <CardHeader>
              <CardTitle className="text-base">Similar Sellers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={`/placeholder.svg?height=40&width=40&text=S${i}`}
                      alt={`Similar Seller ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">Seller{i}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Star size={12} className="mr-1 text-yellow-500" />
                      <span>{4 + i * 0.1}/5</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
