import {
  OrderStatus,
  PrismaClient,
  SocialLinkType,
  Tier,
} from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Define realistic categories and their subcategories for the freelancing platform
const CATEGORIES = [
  {
    label: "Web Development",
    slug: "web-development",
    children: [
      { label: "Frontend Development", slug: "frontend-development" },
      { label: "Backend Development", slug: "backend-development" },
      { label: "Full Stack Development", slug: "fullstack-development" },
      { label: "WordPress Development", slug: "wordpress-development" },
    ],
  },
  {
    label: "Mobile Development",
    slug: "mobile-development",
    children: [
      { label: "iOS Development", slug: "ios-development" },
      { label: "Android Development", slug: "android-development" },
      { label: "React Native", slug: "react-native" },
      { label: "Flutter Development", slug: "flutter-development" },
    ],
  },
  {
    label: "Design & Creative",
    slug: "design-creative",
    children: [
      { label: "Logo Design", slug: "logo-design" },
      { label: "UI/UX Design", slug: "ui-ux-design" },
      { label: "Graphic Design", slug: "graphic-design" },
      { label: "Brand Identity", slug: "brand-identity" },
    ],
  },
  {
    label: "Writing & Translation",
    slug: "writing-translation",
    children: [
      { label: "Content Writing", slug: "content-writing" },
      { label: "Technical Writing", slug: "technical-writing" },
      { label: "Translation Services", slug: "translation-services" },
      { label: "Copywriting", slug: "copywriting" },
    ],
  },
  {
    label: "Digital Marketing",
    slug: "digital-marketing",
    children: [
      { label: "SEO Services", slug: "seo-services" },
      { label: "Social Media Marketing", slug: "social-media-marketing" },
      { label: "PPC Advertising", slug: "ppc-advertising" },
      { label: "Email Marketing", slug: "email-marketing" },
    ],
  },
];

// Common skills that freelancers might have
const SKILLS = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "PHP",
  "WordPress",
  "Shopify",
  "HTML/CSS",
  "Vue.js",
  "Angular",
  "TypeScript",
  "Swift",
  "Kotlin",
  "Flutter",
  "React Native",
  "Figma",
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Sketch",
  "Content Writing",
  "SEO",
  "Google Ads",
  "Facebook Ads",
  "Email Marketing",
  "Social Media Management",
  "Data Analysis",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
];

// Badge types that reflect platform achievements
const BADGES = [
  {
    title: "Fast Responder",
    description: "Consistently responds to messages within 1 hour",
    condition: "Average response time under 1 hour",
    milestones: [
      { threshold: 10, tier: "BRONZE" },
      { threshold: 50, tier: "SILVER" },
      { threshold: 100, tier: "GOLD" },
      { threshold: 250, tier: "PLATINUM" },
      { threshold: 500, tier: "DIAMOND" },
    ],
  },
  {
    title: "Top Rated Seller",
    description: "Maintains excellent customer satisfaction",
    condition: "Average rating above 4.8 stars",
    milestones: [
      { threshold: 5, tier: "BRONZE" },
      { threshold: 25, tier: "SILVER" },
      { threshold: 100, tier: "GOLD" },
      { threshold: 250, tier: "PLATINUM" },
      { threshold: 500, tier: "DIAMOND" },
    ],
  },
  {
    title: "Order Completion Pro",
    description: "Successfully completes orders on time",
    condition: "Orders completed on schedule",
    milestones: [
      { threshold: 10, tier: "BRONZE" },
      { threshold: 25, tier: "SILVER" },
      { threshold: 50, tier: "GOLD" },
      { threshold: 100, tier: "PLATINUM" },
      { threshold: 200, tier: "DIAMOND" },
    ],
  },
  {
    title: "Communication Expert",
    description: "Exceptional communication with clients",
    condition: "High communication ratings from buyers",
    milestones: [
      { threshold: 20, tier: "BRONZE" },
      { threshold: 50, tier: "SILVER" },
      { threshold: 100, tier: "GOLD" },
      { threshold: 200, tier: "PLATINUM" },
      { threshold: 400, tier: "DIAMOND" },
    ],
  },
];

// Helper function to generate realistic gig features based on category
type CategorySlug =
  | "frontend-development"
  | "backend-development"
  | "fullstack-development"
  | "wordpress-development"
  | "logo-design"
  | "ui-ux-design"
  | "content-writing"
  | "seo-services";

function getGigFeatures(categorySlug: string) {
  const featureMap: Record<CategorySlug, string[]> = {
    "frontend-development": [
      "Responsive Design",
      "Cross-browser Compatibility",
      "Mobile Optimization",
      "Performance Optimization",
      "SEO-friendly Code",
    ],
    "backend-development": [
      "Database Design",
      "API Development",
      "Security Implementation",
      "Performance Optimization",
      "Documentation",
    ],
    "fullstack-development": [
      "Frontend & Backend",
      "Database Integration",
      "User Authentication",
      "Payment Integration",
      "Deployment",
    ],
    "wordpress-development": [
      "Custom Theme",
      "Plugin Integration",
      "SEO Optimization",
      "Mobile Responsive",
      "Security Setup",
    ],
    "logo-design": [
      "Vector Format",
      "Multiple Variations",
      "Brand Guidelines",
      "Social Media Kit",
      "Print Ready Files",
    ],
    "ui-ux-design": [
      "User Research",
      "Wireframing",
      "Prototyping",
      "User Testing",
      "Design System",
    ],
    "content-writing": [
      "SEO Optimization",
      "Research Included",
      "Unlimited Revisions",
      "Plagiarism Check",
      "Fast Delivery",
    ],
    "seo-services": [
      "Keyword Research",
      "On-page SEO",
      "Technical SEO",
      "Competitor Analysis",
      "Monthly Reports",
    ],
  };

  return (
    featureMap[categorySlug as CategorySlug] || [
      "Quality Work",
      "Fast Delivery",
      "Unlimited Revisions",
      "Customer Support",
      "Money Back Guarantee",
    ]
  );
}

// Helper function to generate realistic gig titles based on category
function getGigTitle(categorySlug: string) {
  const titleTemplates = {
    "frontend-development": [
      "I will create a modern responsive website using React and TypeScript",
      "I will build a stunning frontend with Vue.js and Tailwind CSS",
      "I will develop a fast and SEO-friendly website with Next.js",
      "I will create an interactive web application with animations",
    ],
    "backend-development": [
      "I will build a robust REST API with Node.js and Express",
      "I will create a scalable backend with Python and Django",
      "I will develop a secure API with authentication and database",
      "I will build a microservices architecture for your application",
    ],
    "logo-design": [
      "I will design a professional logo for your business",
      "I will create a modern minimalist logo with unlimited revisions",
      "I will design a unique brand identity package",
      "I will create a memorable logo that stands out",
    ],
    "ui-ux-design": [
      "I will design a modern mobile app UI with perfect UX",
      "I will create a complete website design with user research",
      "I will design an intuitive dashboard for your SaaS product",
      "I will create a user-friendly e-commerce website design",
    ],
    "content-writing": [
      "I will write engaging blog posts for your website",
      "I will create SEO-optimized content that ranks on Google",
      "I will write compelling website copy that converts",
      "I will create high-quality articles for your niche",
    ],
  };

  const templates = titleTemplates[
    categorySlug as keyof typeof titleTemplates
  ] || [
    "I will provide excellent service for your project",
    "I will deliver high-quality work on time",
    "I will help you achieve your business goals",
  ];

  return faker.helpers.arrayElement(templates);
}

// Helper function to create realistic social links
function generateSocialLinks(userId: string, count = 3) {
  const socialTypes: SocialLinkType[] = [
    "GITHUB",
    "LINKEDIN",
    "X",
    "WEBSITE",
    "INSTAGRAM",
  ];
  const selectedTypes = faker.helpers.arrayElements(socialTypes, count);

  return selectedTypes.map((type) => ({
    id: faker.string.uuid(),
    type: type as SocialLinkType,
    url:
      type === "GITHUB"
        ? `https://github.com/${faker.internet.username()}`
        : type === "LINKEDIN"
          ? `https://linkedin.com/in/${faker.internet.username()}`
          : type === "X"
            ? `https://x.com/${faker.internet.username()}`
            : type === "WEBSITE"
              ? faker.internet.url()
              : `https://instagram.com/${faker.internet.username()}`,
    userId,
  }));
}

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clear existing data in correct order to handle foreign key constraints
    console.log("🧹 Cleaning existing data...");
    await prisma.userBadgeProgress.deleteMany();
    await prisma.badgeMilestone.deleteMany();
    await prisma.badge.deleteMany();
    await prisma.message.deleteMany();
    await prisma.chat.deleteMany();
    await prisma.userSkill.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.review.deleteMany();
    await prisma.packageFeature.deleteMany();
    await prisma.gigFeature.deleteMany();
    await prisma.order.deleteMany();
    await prisma.package.deleteMany();
    await prisma.gigFaq.deleteMany();
    await prisma.image.deleteMany();
    await prisma.gig.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.category.deleteMany();
    await prisma.socialLink.deleteMany();
    await prisma.portfolioItem.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.user.deleteMany();

    // Create skills first since they're referenced by users
    console.log("📚 Creating skills...");
    const skills = await Promise.all(
      SKILLS.map((skill) =>
        prisma.skill.create({
          data: {
            id: faker.string.uuid(),
            label: skill,
          },
        })
      )
    );

    // Create categories and subcategories
    console.log("📂 Creating categories...");
    const createdCategories = [];

    for (const category of CATEGORIES) {
      const parentCategory = await prisma.category.create({
        data: {
          id: faker.string.uuid(),
          label: category.label,
          slug: category.slug,
        },
      });

      createdCategories.push(parentCategory);

      // Create subcategories
      for (const child of category.children) {
        const childCategory = await prisma.category.create({
          data: {
            id: faker.string.uuid(),
            label: child.label,
            slug: child.slug,
            parentId: parentCategory.id,
          },
        });
        createdCategories.push(childCategory);
      }
    }

    // Create tags for gigs
    console.log("🏷️ Creating tags...");
    const tagLabels = [
      "web-development",
      "mobile-app",
      "react",
      "nodejs",
      "python",
      "design",
      "logo",
      "branding",
      "wordpress",
      "ecommerce",
      "seo",
      "marketing",
      "writing",
      "translation",
      "photography",
      "video-editing",
      "animation",
    ];

    const tags = await Promise.all(
      tagLabels.map((label) =>
        prisma.tag.create({
          data: {
            id: faker.string.uuid(),
            label: label
              .replace("-", " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
            slug: label,
          },
        })
      )
    );

    // Create badges and their milestones
    console.log("🏆 Creating badges...");
    const badges = [];
    for (const badgeData of BADGES) {
      const badge = await prisma.badge.create({
        data: {
          id: faker.string.uuid(),
          title: badgeData.title,
          description: badgeData.description,
          condition: badgeData.condition,
        },
      });

      // Create milestones for this badge
      for (const milestone of badgeData.milestones) {
        await prisma.badgeMilestone.create({
          data: {
            id: faker.string.uuid(),
            threshold: milestone.threshold,
            tier: milestone.tier as Tier,
            badgeId: badge.id,
          },
        });
      }

      badges.push(badge);
    }

    // Create users (mix of buyers and sellers)
    console.log("👥 Creating users...");
    const users = [];

    for (let i = 0; i < 150; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const username = faker.internet
        .userName({ firstName, lastName })
        .toLowerCase();

      const user = await prisma.user.create({
        data: {
          id: faker.string.uuid(),
          publicKey: "AuSRiNVFTXeBoUxBD1Uj5dvtRgkU5Rqoz5s7W4vvX4BW",
          username,
          email: faker.internet.email({ firstName, lastName }).toLowerCase(),
          password: faker.internet.password(),
          isVerified: faker.datatype.boolean(0.8), // 80% verified
          avatar: faker.image.avatar(),
          banner: faker.datatype.boolean(0.3) ? faker.image.url() : null,
          headline: faker.datatype.boolean(0.7)
            ? faker.person.jobTitle()
            : null,
          bio: faker.datatype.boolean(0.6) ? faker.lorem.paragraphs(2) : null,
          firstName,
          lastName,
          isKycVerified: faker.datatype.boolean(0.4), // 40% KYC verified
        },
      });

      users.push(user);

      // Add social links for some users
      if (faker.datatype.boolean(0.4)) {
        const socialLinks = generateSocialLinks(
          user.id,
          faker.number.int({ min: 1, max: 4 })
        );
        await prisma.socialLink.createMany({
          data: socialLinks,
        });
      }

      // Add skills for users (sellers typically have more skills)
      const isSeller = faker.datatype.boolean(0.6); // 60% chance to be seller
      if (isSeller) {
        const userSkills = faker.helpers.arrayElements(
          skills,
          faker.number.int({ min: 3, max: 8 })
        );
        await prisma.userSkill.createMany({
          data: userSkills.map((skill) => ({
            id: faker.string.uuid(),
            userId: user.id,
            skillId: skill.id,
            level: faker.number.int({ min: 1, max: 5 }),
          })),
        });

        // Add portfolio items for sellers
        const portfolioCount = faker.number.int({ min: 1, max: 5 });
        for (let j = 0; j < portfolioCount; j++) {
          const portfolioItem = await prisma.portfolioItem.create({
            data: {
              id: faker.string.uuid(),
              title: faker.company.catchPhrase(),
              description: faker.lorem.paragraph(),
              url: faker.datatype.boolean(0.7) ? faker.internet.url() : null,
              userId: user.id,
            },
          });

          // Add images to portfolio items
          const imageCount = faker.number.int({ min: 1, max: 3 });
          for (let k = 0; k < imageCount; k++) {
            await prisma.image.create({
              data: {
                id: faker.string.uuid(),
                url: faker.image.url(),
                isPrimary: k === 0,
                portfolioItemId: portfolioItem.id,
              },
            });
          }
        }

        // Add badge progress for active sellers
        const userBadges = faker.helpers.arrayElements(
          badges,
          faker.number.int({ min: 1, max: 3 })
        );
        await prisma.userBadgeProgress.createMany({
          data: userBadges.map((badge) => ({
            id: faker.string.uuid(),
            userId: user.id,
            badgeId: badge.id,
            currentProgress: faker.number.int({ min: 0, max: 100 }),
            highestTier: faker.helpers.arrayElement([
              "NONE",
              "BRONZE",
              "SILVER",
              "GOLD",
              "PLATINUM",
            ]),
            isFeatured: faker.datatype.boolean(0.1),
          })),
        });
      }
    }

    // Create verification tokens for some unverified users
    console.log("🔐 Creating verification tokens...");
    const unverifiedUsers = users.filter((user) => !user.isVerified);
    for (const user of unverifiedUsers.slice(0, 10)) {
      await prisma.verificationToken.create({
        data: {
          id: faker.string.uuid(),
          code: faker.string.alphanumeric(6).toUpperCase(),
          expiresAt: faker.date.future(),
          userId: user.id,
        },
      });
    }

    // Create gigs for seller users
    console.log("💼 Creating gigs...");
    const sellers = users.filter(() => faker.datatype.boolean(0.6)); // Approximate sellers
    const gigs = [];

    for (const seller of sellers.slice(0, 80)) {
      // Create gigs for 80 sellers
      const gigCount = faker.number.int({ min: 1, max: 4 });

      for (let i = 0; i < gigCount; i++) {
        const category = faker.helpers.arrayElement(
          createdCategories.filter((cat) => cat.parentId !== null)
        );
        const gigTags = faker.helpers.arrayElements(
          tags,
          faker.number.int({ min: 2, max: 5 })
        );

        const gig = await prisma.gig.create({
          data: {
            id: faker.string.uuid(),
            title: getGigTitle(category.slug),
            description: faker.lorem.paragraphs(3),
            categoryId: category.id,
            sellerId: seller.id,
            tags: {
              connect: gigTags.map((tag) => ({ id: tag.id })),
            },
          },
        });

        gigs.push(gig);

        // Add images to gig
        const imageCount = faker.number.int({ min: 1, max: 4 });
        for (let j = 0; j < imageCount; j++) {
          await prisma.image.create({
            data: {
              id: faker.string.uuid(),
              url: faker.image.url(),
              isPrimary: j === 0,
              gigId: gig.id,
            },
          });
        }

        // Add gig features
        const features = getGigFeatures(category.slug);
        const gigFeatures = [];
        for (const feature of features) {
          const gigFeature = await prisma.gigFeature.create({
            data: {
              id: faker.string.uuid(),
              label: feature,
              gigId: gig.id,
            },
          });
          gigFeatures.push(gigFeature);
        }

        // Create packages for the gig
        const packageTypes = [
          { title: "Basic", priceMultiplier: 1, revisions: 2, deliveryTime: 7 },
          {
            title: "Standard",
            priceMultiplier: 2,
            revisions: 3,
            deliveryTime: 5,
          },
          {
            title: "Premium",
            priceMultiplier: 3,
            revisions: 5,
            deliveryTime: 3,
          },
        ];

        const basePrice = faker.number.int({ min: 50, max: 500 });

        for (const packageType of packageTypes) {
          const gigPackage = await prisma.package.create({
            data: {
              id: faker.string.uuid(),
              title: packageType.title,
              price: basePrice * packageType.priceMultiplier,
              revisions: packageType.revisions,
              deliveryTime: packageType.deliveryTime,
              gigId: gig.id,
            },
          });

          // Connect features to packages (higher tier packages include more features)
          const includedFeatures = gigFeatures.slice(
            0,
            packageType.priceMultiplier + 1
          );
          await prisma.packageFeature.createMany({
            data: includedFeatures.map((feature) => ({
              id: faker.string.uuid(),
              isIncluded: true,
              gigPackageId: gigPackage.id,
              featureId: feature.id,
            })),
          });
        }

        // Add FAQs to gig
        const faqCount = faker.number.int({ min: 2, max: 5 });
        for (let j = 0; j < faqCount; j++) {
          await prisma.gigFaq.create({
            data: {
              id: faker.string.uuid(),
              question: faker.lorem.sentence() + "?",
              answer: faker.lorem.paragraph(),
              gigId: gig.id,
            },
          });
        }
      }
    }

    // Create orders and related data
    console.log("📋 Creating orders...");
    const buyers = users.filter(
      (user) => !sellers.includes(user) || faker.datatype.boolean(0.3)
    );

    for (let i = 0; i < 200; i++) {
      const gig = faker.helpers.arrayElement(gigs);
      const packages = await prisma.package.findMany({
        where: { gigId: gig.id },
      });
      const selectedPackage = faker.helpers.arrayElement(packages);
      const buyer = faker.helpers.arrayElement(
        buyers.filter((u) => u.id !== gig.sellerId)
      );

      const orderStatuses: OrderStatus[] = [
        "PENDING",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ];
      const status = faker.helpers.arrayElement(orderStatuses);

      const order = await prisma.order.create({
        data: {
          id: faker.string.uuid(),
          deadline: faker.date.future(),
          status,
          packageId: selectedPackage.id,
          buyerId: buyer.id,
          sellerId: gig.sellerId,
          gigId: gig.id,
          createdAt: faker.date.past(),
        },
      });

      // Create chat for the order
      const chat = await prisma.chat.create({
        data: {
          id: faker.string.uuid(),
          buyerId: buyer.id,
          sellerId: gig.sellerId,
          orderId: order.id,
        },
      });

      // Add messages to the chat
      const messageCount = faker.number.int({ min: 3, max: 15 });
      for (let j = 0; j < messageCount; j++) {
        const isFromBuyer = faker.datatype.boolean();
        await prisma.message.create({
          data: {
            id: faker.string.uuid(),
            type: "TEXT",
            content: { text: faker.lorem.sentence() },
            isRead: faker.datatype.boolean(0.7),
            chatId: chat.id,
            senderId: isFromBuyer ? buyer.id : gig.sellerId,
            createdAt: faker.date.past(),
          },
        });
      }

      // Create review for completed orders
      if (status === "COMPLETED" && faker.datatype.boolean(0.8)) {
        await prisma.review.create({
          data: {
            id: faker.string.uuid(),
            rating: faker.number.int({ min: 1, max: 5 }),
            title: faker.lorem.sentence(),
            description: faker.lorem.paragraph(),
            orderId: order.id,
            authorId: buyer.id,
            gigId: gig.id,
            createdAt: faker.date.past(),
          },
        });
      }
    }

    // Create some standalone notifications
    console.log("🔔 Creating notifications...");
    for (let i = 0; i < 100; i++) {
      const recipient = faker.helpers.arrayElement(users);
      const sender = faker.helpers.arrayElement(
        users.filter((u) => u.id !== recipient.id)
      );

      await prisma.notification.create({
        data: {
          id: faker.string.uuid(),
          type: "CONTACT",
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          isRead: faker.datatype.boolean(0.4),
          recipientId: recipient.id,
          senderId: sender.id,
          createdAt: faker.date.past(),
        },
      });
    }

    // Add bookmarks (users bookmarking gigs)
    console.log("🔖 Creating bookmarks...");
    for (let i = 0; i < 150; i++) {
      const user = faker.helpers.arrayElement(users);
      const gig = faker.helpers.arrayElement(gigs);

      // Check if bookmark already exists to avoid duplicates
      const existingBookmark = await prisma.gig.findFirst({
        where: {
          id: gig.id,
          bookmarks: {
            some: { id: user.id },
          },
        },
      });

      if (!existingBookmark) {
        await prisma.gig.update({
          where: { id: gig.id },
          data: {
            bookmarks: {
              connect: { id: user.id },
            },
          },
        });
      }
    }

    console.log("✅ Database seeding completed successfully!");
    console.log(`
    📊 Summary:
    - Users: ${users.length}
    - Categories: ${createdCategories.length}
    - Skills: ${skills.length}
    - Tags: ${tags.length}
    - Badges: ${badges.length}
    - Gigs: ${gigs.length}
    - Orders: ~200
    - Notifications: ~100
    - Bookmarks: ~150
    `);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the seeding function
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
