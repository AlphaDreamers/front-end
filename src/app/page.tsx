import HeroSection from "@/components/home/hero-section";
import { FeaturedGigs } from "@/components/home/featured-gigs";
import { CategoriesShowcase } from "@/components/home/categories-showcase";
import TestimonialsSection from "@/components/home/testimonials-section";
import { prisma } from "@/lib/prisma";
import { Category, Color, LucideIconName } from "@/lib/types";
import { getTestimonials } from "@/lib/actions/review";
import { fetchGigsWithFilters } from "@/lib/actions/gigs";

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

export default async function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <FeaturedGigs
        getFeaturedGigs={async () => {
          const res = await fetchGigsWithFilters({}, 10);
          return res.gigs;
        }}
      />
      <CategoriesShowcase getCategories={getCategories} />
      <TestimonialsSection getTestimonials={getTestimonials} />
    </main>
  );
}
