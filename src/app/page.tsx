import HeroSection from "@/components/home/hero-section";
import { FeaturedGigs } from "@/components/home/featured-gigs";
import { CategoriesShowcase } from "@/components/home/categories-showcase";
import TestimonialsSection from "@/components/home/testimonials-section";
import { prisma } from "@/lib/prisma";
import { Category, Color, Gig, LucideIconName, Testimonial } from "@/lib/types";
import { getTestimonials } from "@/lib/actions/review";

const getCategories = async (): Promise<Category[]> => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      title: true,
      _count: {
        select: {
          gigs: true,
        },
      },
      icon: true,
      color: true,
    },
    take: 10,
  });

  return categories.map((category) => ({
    id: category.id,
    label: category.title,
    gigsCnt: category._count.gigs,
    icon: category.icon as LucideIconName,
    color: category.color as Color,
  }));
};

const getFeaturedGigs = async (): Promise<Gig[]> => {
  const gigs = await prisma.gig.findMany({
    take: 10,
    select: {
      id: true,
      packages: {
        select: {
          price: true,
        },
      },
      title: true,
      description: true,
      images: {
        select: {
          isPrimary: true,
          file: {
            select: {
              url: true,
            },
          },
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
      tags: {
        select: {
          title: true,
          id: true,
        },
      },
      seller: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          publicKey: true,
          avatar: true,
          badgeProgress: {
            where: {
              isFeatured: true,
            },
            select: {
              badge: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return gigs.map((gig) => ({
    id: gig.id,
    image:
      gig.images.find((img) => img.isPrimary)?.file.url || "/gig-fallback.png",
    startsAtPrice: gig.packages.reduce(
      (min, pkg) => Math.min(min, pkg.price),
      Infinity
    ),
    title: gig.title,
    description: gig.description,
    ratingCount: gig.reviews.length,
    averageRating:
      gig.reviews.reduce((sum, review) => sum + review.rating, 0) /
      (gig.reviews.length || 1),
    tags: gig.tags.map((tag) => ({
      id: tag.id,
      label: tag.title,
    })),
    seller: {
      id: gig.seller.id,
      username: gig.seller.username,
      firstName: gig.seller.firstName,
      lastName: gig.seller.lastName,
      publicKey: gig.seller.publicKey,
      badge:
        gig.seller.badgeProgress.length > 0
          ? {
              title: gig.seller.badgeProgress[0].badge.title,
            }
          : null,
      avatar: gig.seller.avatar,
    },
  }));
};


export default async function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <FeaturedGigs getFeaturedGigs={getFeaturedGigs} />
      <CategoriesShowcase getCategories={getCategories} />
      <TestimonialsSection getTestimonials={getTestimonials} />
    </main>
  );
}
