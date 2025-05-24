//import { FeaturedGigs } from "@/components/home/featured-gigs";
import { CategoriesShowcase } from "@/components/home/categories-showcase";
import { Footer } from "@/components/footer";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/home/hero-section";

export default async function HomePage() {
  await prisma.gig.findMany({
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
    },
  });

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      label: true,
      _count: {
        select: {
          gigs: true,
        },
      },
    },
    take: 12,
  });

  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      {/*<FeaturedGigs gigs={gigs} />*/}
      <CategoriesShowcase categories={categories} />
      <Footer />
    </main>
  );
}
