import { PrismaClient, type Tier } from "@prisma/client";
import { Color, LucideIconName } from "@/lib/types";

const prisma = new PrismaClient();

// Clear database function
async function clearDatabase() {
  console.log("🧹 Clearing existing data...");

  await prisma.badgeMilestone.deleteMany({});
  await prisma.userBadgeProgress.deleteMany({});
  await prisma.badge.deleteMany({});
  await prisma.userSkill.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.gigFeature.deleteMany({});
  await prisma.gigFaq.deleteMany({});
  await prisma.packageFeature.deleteMany({});
  await prisma.package.deleteMany({});
  await prisma.gig.deleteMany({});
  await prisma.category.deleteMany({});

  console.log("✅ Database cleared successfully.");
}

// Main seed function
async function seed() {
  try {
    console.log("🚀 Starting focused database seeding...");

    await clearDatabase();

    // Seed Categories with Nesting
    console.log("📁 Seeding categories...");
    const parentCategoriesData: {
      title: string;
      icon: LucideIconName;
      color: Color;
    }[] = [
      { title: "Web Development", icon: "Globe", color: "blue" },
      { title: "Blockchain & Crypto", icon: "Blocks", color: "purple" },
      { title: "Design & UI/UX", icon: "Palette", color: "yellow" },
      { title: "Content Writing", icon: "FileText", color: "green" },
      { title: "Digital Marketing", icon: "Megaphone", color: "gray" },
    ];

    const parentCategories = await Promise.all(
      parentCategoriesData.map((cat) =>
        prisma.category.create({
          data: {
            title: cat.title,
            icon: cat.icon,
            color: cat.color,
            depth: 0,
          },
        })
      )
    );

    const subcategoriesData = [
      {
        title: "Front-end Development",
        parentId: parentCategories[0].id,
        parentColor: parentCategories[0].color,
        parentIcon: parentCategories[0].icon,
      },
      {
        title: "Back-end Development",
        parentId: parentCategories[0].id,
        parentColor: parentCategories[0].color,
        parentIcon: parentCategories[0].icon,
      },
      {
        title: "Full-stack Development",
        parentId: parentCategories[0].id,
        parentColor: parentCategories[0].color,
        parentIcon: parentCategories[0].icon,
      },
      {
        title: "Smart Contracts",
        parentId: parentCategories[1].id,
        parentColor: parentCategories[1].color,
        parentIcon: parentCategories[1].icon,
      },
      {
        title: "NFTs",
        parentId: parentCategories[1].id,
        parentColor: parentCategories[1].color,
        parentIcon: parentCategories[1].icon,
      },
      {
        title: "DeFi",
        parentId: parentCategories[1].id,
        parentColor: parentCategories[1].color,
        parentIcon: parentCategories[1].icon,
      },
      {
        title: "Graphic Design",
        parentId: parentCategories[2].id,
        parentColor: parentCategories[2].color,
        parentIcon: parentCategories[2].icon,
      },
      {
        title: "UI Design",
        parentId: parentCategories[2].id,
        parentColor: parentCategories[2].color,
        parentIcon: parentCategories[2].icon,
      },
      {
        title: "UX Design",
        parentId: parentCategories[2].id,
        parentColor: parentCategories[2].color,
        parentIcon: parentCategories[2].icon,
      },
      {
        title: "Blog Writing",
        parentId: parentCategories[3].id,
        parentColor: parentCategories[3].color,
        parentIcon: parentCategories[3].icon,
      },
      {
        title: "Technical Writing",
        parentId: parentCategories[3].id,
        parentColor: parentCategories[3].color,
        parentIcon: parentCategories[3].icon,
      },
      {
        title: "Copywriting",
        parentId: parentCategories[3].id,
        parentColor: parentCategories[3].color,
        parentIcon: parentCategories[3].icon,
      },
      {
        title: "SEO",
        parentId: parentCategories[4].id,
        parentColor: parentCategories[4].color,
        parentIcon: parentCategories[4].icon,
      },
      {
        title: "Social Media Marketing",
        parentId: parentCategories[4].id,
        parentColor: parentCategories[4].color,
        parentIcon: parentCategories[4].icon,
      },
      {
        title: "Email Marketing",
        parentId: parentCategories[4].id,
        parentColor: parentCategories[4].color,
        parentIcon: parentCategories[4].icon,
      },
    ];

    await Promise.all(
      subcategoriesData.map((subcat) =>
        prisma.category.create({
          data: {
            title: subcat.title,
            icon: subcat.parentIcon,
            color: subcat.parentColor,
            depth: 1,
            parentId: subcat.parentId,
          },
        })
      )
    );
    console.log("✅ Seeded categories with subcategories");

    // Seed Tags
    console.log("🏷️ Seeding tags...");
    const tags = [
      "React",
      "Next.js",
      "TypeScript",
      "Solana",
      "Smart Contracts",
      "Web3",
      "NFT",
      "UI Design",
      "UX Design",
      "Figma",
      "SEO",
      "Content Marketing",
      "Technical Writing",
      "Node.js",
      "PostgreSQL",
      "GraphQL",
      "Tailwind CSS",
      "Rust",
      "Anchor",
      "DeFi",
    ];

    await Promise.all(
      tags.map((title) =>
        prisma.tag.create({
          data: { title },
        })
      )
    );
    console.log(`✅ Seeded ${tags.length} tags`);

    // Seed Skills
    console.log("💡 Seeding skills...");
    const skills = [
      ...tags,
      "JavaScript",
      "Python",
      "Java",
      "C++",
      "C#",
      "Ruby",
      "PHP",
      "Swift",
      "Kotlin",
      "Angular",
      "Vue.js",
      "Django",
      "Flask",
      "Spring",
      "Git",
      "Docker",
      "Kubernetes",
      "Jenkins",
      "AWS",
      "Azure",
      "Google Cloud",
      "HTML",
      "CSS",
      "SASS",
      "LESS",
      "Bootstrap",
      "Material UI",
      "Communication",
      "Teamwork",
      "Leadership",
      "Time Management",
      "Problem Solving",
      "Project Management",
    ];

    await Promise.all(
      [...new Set(skills)].map((title) =>
        prisma.skill.create({
          data: { title },
        })
      )
    );
    console.log(`✅ Seeded ${skills.length} skills`);

    // Seed Badges
    console.log("🏆 Seeding badges...");
    const badges = [
      {
        id: "top_rated_seller",
        title: "Top Rated Seller",
        description: "Awarded to sellers who deliver quality work on time",
        condition:
          "Accumulate on-time deliveries with positive reviews (4+ stars)",
        icon: "Award",
        color: "gold",
        milestones: [
          { threshold: 5, tier: "BRONZE" as Tier },
          { threshold: 15, tier: "SILVER" as Tier },
          { threshold: 30, tier: "GOLD" as Tier },
          { threshold: 50, tier: "PLATINUM" as Tier },
          { threshold: 100, tier: "DIAMOND" as Tier },
        ],
      },
      {
        id: "power_buyer",
        title: "Power Buyer",
        description: "Awarded to buyers who actively use the platform",
        condition: "Complete orders as a buyer",
        icon: "ShoppingBag",
        color: "purple",
        milestones: [
          { threshold: 5, tier: "BRONZE" as Tier },
          { threshold: 15, tier: "SILVER" as Tier },
          { threshold: 30, tier: "GOLD" as Tier },
          { threshold: 50, tier: "PLATINUM" as Tier },
          { threshold: 100, tier: "DIAMOND" as Tier },
        ],
      },
      {
        id: "community_star",
        title: "Community Star",
        description: "Awarded for leaving detailed and helpful reviews",
        condition: "Leave reviews with detailed feedback (50+ words)",
        icon: "Star",
        color: "blue",
        milestones: [
          { threshold: 5, tier: "BRONZE" as Tier },
          { threshold: 15, tier: "SILVER" as Tier },
          { threshold: 30, tier: "GOLD" as Tier },
          { threshold: 50, tier: "PLATINUM" as Tier },
          { threshold: 100, tier: "DIAMOND" as Tier },
        ],
      },
    ];

    for (const badge of badges) {
      await prisma.badge.upsert({
        where: { id: badge.id },
        update: {},
        create: {
          id: badge.id,
          title: badge.title,
          description: badge.description,
          condition: badge.condition,
          icon: badge.icon,
          color: badge.color,
        },
      });

      await prisma.badgeMilestone.createMany({
        data: badge.milestones.map((milestone) => ({
          badgeId: badge.id,
          threshold: milestone.threshold,
          tier: milestone.tier,
        })),
        skipDuplicates: true,
      });
    }
    console.log(`✅ Seeded ${badges.length} badges with milestones`);

    // Final Summary
    console.log("\n🎉 Database seeding completed successfully!");
    console.log("📊 Summary:");
    console.log(
      `   - Categories: ${parentCategories.length + subcategoriesData.length}`
    );
    console.log(`   - Tags: ${tags.length}`);
    console.log(`   - Skills: ${skills.length}`);
    console.log(`   - Badges: ${badges.length}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seed().catch((error) => {
  console.error("💥 Fatal error:", error);
  process.exit(1);
});
