import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { me } from "@/lib/actions/auth";
import EditGigForm from "@/components/gig/edit-gig-form";

interface EditGigPageProps {
  params: Promise<{ gigId: string }>;
}

export default async function EditGigPage({ params }: EditGigPageProps) {
  // First, authenticate the user
  const user = await me();
  const { gigId } = await params;

  if (!user?.isVerified) {
    redirect("/sign-in?callback-url=/dashboard/gigs/" + gigId + "/edit");
  }

  // Fetch the gig with all its related data
  const gig = await prisma.gig.findUnique({
    where: { id: gigId },
    include: {
      // Include all the data we need for editing
      category: {
        select: {
          id: true,
          title: true,
          icon: true,
          color: true,
        },
      },
      tags: {
        select: {
          id: true,
          title: true,
        },
      },
      features: {
        select: {
          id: true,
          title: true,
        },
        orderBy: {
          // Order matters for feature inclusions in packages
          createdAt: "asc",
        },
      },
      packages: {
        include: {
          features: {
            include: {
              feature: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
            orderBy: {
              feature: {
                createdAt: "asc", // Maintain consistent order
              },
            },
          },
        },
        orderBy: {
          price: "asc", // Order packages by price (Basic, Standard, Premium)
        },
      },
      images: {
        include: {
          file: {
            select: {
              url: true,
            },
          },
        },
        orderBy: [
          { isPrimary: "desc" }, // Primary image first
          { createdAt: "asc" }, // Then by creation order
        ],
      },
      seller: {
        select: {
          id: true,
        },
      },
    },
  });

  // Handle various error cases
  if (!gig) {
    notFound();
  }

  if (gig.sellerId !== user.id) {
    redirect("/dashboard/gigs");
  }

  // Fetch categories and tags for the form dropdowns
  // We do this in parallel for better performance
  const [categories, allTags] = await Promise.all([
    prisma.category.findMany({
      select: {
        id: true,
        title: true,
        icon: true,
        color: true,
      },
      orderBy: {
        title: "asc",
      },
    }),
    prisma.tag.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: "asc",
      },
    }),
  ]);

  // Transform the gig data into the format expected by our form
  // This is crucial - we need to convert database relations into form-friendly objects
  const formData = {
    id: gig.id,
    title: gig.title,
    description: gig.description,
    categoryId: gig.category.id,

    // Convert tag objects to just their IDs for the form
    tags: gig.tags.map((tag) => tag.id),

    // Convert features to form format with database IDs
    features: gig.features.map((feature) => ({
      id: feature.id,
      label: feature.title,
    })),

    // Transform packages and their feature inclusions
    packages: gig.packages.map((pkg) => {
      // Create feature inclusions array based on package features
      // This maps each gig feature to whether it's included in this package
      const featureInclusions = gig.features.map((gigFeature) => {
        return pkg.features.some(
          (pkgFeature) =>
            pkgFeature.feature.id === gigFeature.id && pkgFeature.isIncluded
        );
      });

      return {
        id: pkg.id,
        title: pkg.title,
        deliveryTime: pkg.deliveryTime,
        price: pkg.price,
        revisions: pkg.revisions,
        featureInclusions,
      };
    }),

    // Transform images to the discriminated union format
    images: gig.images.map((image) => ({
      type: "existing" as const,
      id: image.id,
      url: image.file.url,
      isPrimary: image.isPrimary,
    })),
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl font-bold">Edit Gig</h1>
        <p className="text-muted-foreground">
          Update your service details and settings
        </p>
      </div>

      <EditGigForm gig={formData} categories={categories} tags={allTags} />
    </div>
  );
}
