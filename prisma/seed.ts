import {
  PrismaClient,
  type Category,
  type Tier,
  type SocialLinkType,
  type MediaType,
  type NotificationType,
  //type ContactMessageType,
  type OrderStatus,
  //type MessageStatus,
  //type ComplaintStatus,
  //type SupportPriority,
  //type SupportStatus,
  //type FeedbackCategory,
  type MediaFile,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import argon2 from "argon2";

const prisma = new PrismaClient();

// Helper data
const imageUrls = Array.from(
  { length: 20 },
  (_, i) => `https://picsum.photos/400/600?random=${i}`
);
const videoUrls = [
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://www.w3schools.com/html/movie.mp4",
  "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
];
const audioUrls = [
  "https://www.w3schools.com/html/horse.mp3",
  "https://www.w3schools.com/html/horse.ogg",
  "https://samplelib.com/lib/preview/mp3/sample-3s.mp3",
];
const documentUrls = [
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
];

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Poland",
  "Netherlands",
];
const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Polish",
  "Dutch",
  "Russian",
  "Chinese",
];

function getRandomMediaType(): MediaType {
  const rand = Math.random();
  if (rand < 0.7) return "IMAGE";
  if (rand < 0.85) return "VIDEO";
  if (rand < 0.92) return "AUDIO";
  if (rand < 0.98) return "DOCUMENT";
  return "OTHER";
}

function getRandomUrl(type: MediaType): string {
  switch (type) {
    case "IMAGE":
      return faker.helpers.arrayElement(imageUrls);
    case "VIDEO":
      return faker.helpers.arrayElement(videoUrls);
    case "AUDIO":
      return faker.helpers.arrayElement(audioUrls);
    case "DOCUMENT":
      return faker.helpers.arrayElement(documentUrls);
    default:
      return faker.internet.url();
  }
}

type CategoryWithChildren = {
  title: string;
  icon: string;
  color: string;
  children?: CategoryWithChildren[];
};

async function clearDatabase() {
  console.log("Clearing existing data...");

  // Clear in correct order to respect foreign key constraints
  await prisma.transaction.deleteMany({});
  await prisma.userPreferences.deleteMany({});
  await prisma.fAQ.deleteMany({});
  await prisma.wallet.deleteMany({});
  await prisma.generalContent.deleteMany({});
  await prisma.feedbackContent.deleteMany({});
  await prisma.supportContent.deleteMany({});
  await prisma.complaintContent.deleteMany({});
  await prisma.testimonialContent.deleteMany({});
  await prisma.contactMessage.deleteMany({});
  await prisma.systemContent.deleteMany({});
  await prisma.mediaContent.deleteMany({});
  await prisma.textContent.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.chat.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.packageFeature.deleteMany({});
  await prisma.package.deleteMany({});
  await prisma.gigFeature.deleteMany({});
  await prisma.gigFaq.deleteMany({});
  await prisma.gig.deleteMany({});
  await prisma.image.deleteMany({});
  await prisma.mediaFile.deleteMany({});
  await prisma.userMessage.deleteMany({});
  await prisma.portfolioItem.deleteMany({});
  await prisma.socialLink.deleteMany({});
  await prisma.userBadgeProgress.deleteMany({});
  await prisma.badgeMilestone.deleteMany({});
  await prisma.badge.deleteMany({});
  await prisma.userSkill.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.verificationToken.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Database cleared successfully.");
}

async function createCategory(
  category: CategoryWithChildren,
  parentId: string | null = null,
  depth = 0
): Promise<Category> {
  const created = await prisma.category.create({
    data: {
      title: category.title,
      depth,
      parentId,
      color: category.color,
      icon: category.icon,
    },
  });

  if (category.children) {
    for (const child of category.children) {
      await createCategory(child, created.id, depth + 1);
    }
  }

  return created;
}

async function seed() {
  try {
    console.log("🚀 Starting database seeding...");

    await clearDatabase();

    // 1. Seed FAQs (platform-wide FAQs)
    console.log("📋 Seeding FAQs...");
    const faqs = [
      {
        question: "How do I connect my Solana wallet?",
        answer:
          "Go to your dashboard, click 'Connect Wallet', and follow the Phantom wallet prompts.",
      },
      {
        question: "What payment methods are accepted?",
        answer:
          "We accept SOL (Solana) cryptocurrency payments through connected wallets.",
      },
      {
        question: "How does the escrow system work?",
        answer:
          "Payments are held in escrow until the order is completed and approved by the buyer.",
      },
      {
        question: "Can I cancel an order?",
        answer:
          "Orders can be cancelled within 24 hours if work hasn't started. Contact support for assistance.",
      },
      {
        question: "How do I become a verified seller?",
        answer:
          "Complete the KYC process in your account settings by providing required documentation.",
      },
    ];

    for (const faq of faqs) {
      await prisma.fAQ.create({ data: faq });
    }
    console.log(`✅ Seeded ${faqs.length} FAQs.`);

    // 2. Seed Categories
    console.log("📁 Seeding categories...");
    const categoryStructure: CategoryWithChildren[] = [
      {
        title: "Programming & Tech",
        icon: "Code",
        color: "purple",
        children: [
          {
            title: "Web Development",
            icon: "Globe",
            color: "blue",
            children: [
              { title: "Frontend Development", icon: "Layout", color: "cyan" },
              { title: "Backend Development", icon: "Server", color: "green" },
              {
                title: "Full Stack Development",
                icon: "Layers",
                color: "indigo",
              },
            ],
          },
          {
            title: "Mobile Development",
            icon: "Smartphone",
            color: "pink",
            children: [
              { title: "iOS Development", icon: "Apple", color: "gray" },
              { title: "Android Development", icon: "Bot", color: "green" },
              { title: "Cross-Platform", icon: "Shuffle", color: "purple" },
            ],
          },
          { title: "Blockchain & Crypto", icon: "Blocks", color: "orange" },
          { title: "AI & Machine Learning", icon: "Brain", color: "red" },
        ],
      },
      {
        title: "Design & Creative",
        icon: "Palette",
        color: "pink",
        children: [
          {
            title: "Graphic Design",
            icon: "PenTool",
            color: "yellow",
            children: [
              { title: "Logo Design", icon: "Hexagon", color: "blue" },
              { title: "Brand Identity", icon: "Tag", color: "purple" },
              { title: "Illustration", icon: "Brush", color: "orange" },
            ],
          },
          { title: "UI/UX Design", icon: "Layout", color: "green" },
          { title: "3D Design", icon: "Box", color: "red" },
        ],
      },
      {
        title: "Writing & Translation",
        icon: "FileText",
        color: "blue",
        children: [
          { title: "Content Writing", icon: "FileText", color: "gray" },
          { title: "Copywriting", icon: "Edit", color: "purple" },
          { title: "Technical Writing", icon: "FileCode", color: "green" },
          { title: "Translation", icon: "Languages", color: "orange" },
        ],
      },
      {
        title: "Video & Animation",
        icon: "Video",
        color: "red",
        children: [
          { title: "Video Editing", icon: "Film", color: "purple" },
          { title: "Animation", icon: "Play", color: "blue" },
          { title: "Motion Graphics", icon: "Zap", color: "yellow" },
        ],
      },
      {
        title: "Music & Audio",
        icon: "Music",
        color: "green",
        children: [
          { title: "Music Production", icon: "Headphones", color: "purple" },
          { title: "Voice Over", icon: "Mic", color: "blue" },
          { title: "Sound Design", icon: "Volume2", color: "orange" },
        ],
      },
      {
        title: "Business",
        icon: "Briefcase",
        color: "gray",
        children: [
          { title: "Business Consulting", icon: "TrendingUp", color: "blue" },
          { title: "Marketing Strategy", icon: "Target", color: "red" },
          { title: "Financial Services", icon: "DollarSign", color: "green" },
        ],
      },
    ];

    let categoryCount = 0;
    for (const category of categoryStructure) {
      await createCategory(category);
      categoryCount++;
    }
    console.log(
      `✅ Seeded ${categoryCount} top-level categories with subcategories.`
    );

    // 3. Seed Tags
    console.log("🏷️ Seeding tags...");
    const tags = [
      "JavaScript",
      "TypeScript",
      "React",
      "Vue",
      "Angular",
      "Node.js",
      "Python",
      "Django",
      "Flask",
      "Java",
      "Spring",
      "PHP",
      "Laravel",
      "WordPress",
      "Solana",
      "Web3",
      "Smart Contracts",
      "NFT",
      "DeFi",
      "Rust",
      "Golang",
      "Swift",
      "Kotlin",
      "Flutter",
      "React Native",
      "UI Design",
      "UX Design",
      "Figma",
      "Adobe XD",
      "Photoshop",
      "Illustrator",
      "After Effects",
      "Premiere Pro",
      "Blender",
      "3D Modeling",
      "Logo Design",
      "Brand Identity",
      "SEO",
      "Content Writing",
      "Copywriting",
      "Technical Writing",
      "Video Editing",
      "Animation",
      "Motion Graphics",
      "Music Production",
      "Voice Over",
      "Podcast Editing",
      "Mixing",
      "Mastering",
      "Business Strategy",
      "Marketing",
      "Social Media",
      "Email Marketing",
    ];

    await prisma.tag.createMany({
      data: tags.map((title) => ({ title })),
      skipDuplicates: true,
    });
    console.log(`✅ Seeded ${tags.length} tags.`);

    // 4. Seed Skills
    console.log("💡 Seeding skills...");
    const skillsList = [
      ...tags, // Include all tags as skills
      "HTML",
      "CSS",
      "SASS",
      "Tailwind CSS",
      "Bootstrap",
      "Material UI",
      "REST API",
      "GraphQL",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Redis",
      "Docker",
      "Kubernetes",
      "AWS",
      "Azure",
      "Google Cloud",
      "CI/CD",
      "Git",
      "GitHub",
      "GitLab",
      "Agile",
      "Scrum",
      "Project Management",
      "Communication",
      "Problem Solving",
      "Critical Thinking",
      "Creativity",
    ];

    const createdSkills = [];
    for (const skillTitle of [...new Set(skillsList)]) {
      const skill = await prisma.skill.create({
        data: { title: skillTitle },
      });
      createdSkills.push(skill);
    }
    console.log(`✅ Seeded ${createdSkills.length} skills.`);

    // 5. Seed Badges and Milestones
    console.log("🏆 Seeding badges and milestones...");
    const badges = [
      {
        title: "Top Seller",
        description: "Awarded to sellers with high sales volume",
        condition: "Number of completed orders",
        icon: "Trophy",
        color: "yellow",
        milestones: [
          { threshold: 10, tier: "BRONZE" as Tier },
          { threshold: 50, tier: "SILVER" as Tier },
          { threshold: 100, tier: "GOLD" as Tier },
          { threshold: 500, tier: "PLATINUM" as Tier },
          { threshold: 1000, tier: "DIAMOND" as Tier },
        ],
      },
      {
        title: "5-Star Seller",
        description: "Consistently high-rated seller",
        condition: "Number of 5-star reviews",
        icon: "Star",
        color: "gold",
        milestones: [
          { threshold: 5, tier: "BRONZE" as Tier },
          { threshold: 25, tier: "SILVER" as Tier },
          { threshold: 50, tier: "GOLD" as Tier },
          { threshold: 100, tier: "PLATINUM" as Tier },
          { threshold: 250, tier: "DIAMOND" as Tier },
        ],
      },
      {
        title: "Quick Responder",
        description: "Lightning fast response times",
        condition: "Messages replied within 1 hour",
        icon: "Zap",
        color: "blue",
        milestones: [
          { threshold: 20, tier: "BRONZE" as Tier },
          { threshold: 50, tier: "SILVER" as Tier },
          { threshold: 100, tier: "GOLD" as Tier },
          { threshold: 250, tier: "PLATINUM" as Tier },
          { threshold: 500, tier: "DIAMOND" as Tier },
        ],
      },
      {
        title: "Veteran Member",
        description: "Long-standing platform member",
        condition: "Months since joining",
        icon: "Award",
        color: "purple",
        milestones: [
          { threshold: 3, tier: "BRONZE" as Tier },
          { threshold: 6, tier: "SILVER" as Tier },
          { threshold: 12, tier: "GOLD" as Tier },
          { threshold: 24, tier: "PLATINUM" as Tier },
          { threshold: 48, tier: "DIAMOND" as Tier },
        ],
      },
      {
        title: "Verified Expert",
        description: "Completed identity verification",
        condition: "KYC verification completed",
        icon: "CheckCircle",
        color: "green",
        milestones: [{ threshold: 1, tier: "GOLD" as Tier }],
      },
      {
        title: "Portfolio Pro",
        description: "Showcase master with rich portfolio",
        condition: "Number of portfolio items",
        icon: "Image",
        color: "pink",
        milestones: [
          { threshold: 5, tier: "BRONZE" as Tier },
          { threshold: 15, tier: "SILVER" as Tier },
          { threshold: 30, tier: "GOLD" as Tier },
          { threshold: 50, tier: "PLATINUM" as Tier },
          { threshold: 100, tier: "DIAMOND" as Tier },
        ],
      },
      {
        title: "Multi-Talented",
        description: "Master of many skills",
        condition: "Number of verified skills",
        icon: "Layers",
        color: "orange",
        milestones: [
          { threshold: 5, tier: "BRONZE" as Tier },
          { threshold: 10, tier: "SILVER" as Tier },
          { threshold: 20, tier: "GOLD" as Tier },
          { threshold: 35, tier: "PLATINUM" as Tier },
          { threshold: 50, tier: "DIAMOND" as Tier },
        ],
      },
      {
        title: "Repeat Business",
        description: "Trusted by returning customers",
        condition: "Number of repeat buyers",
        icon: "Users",
        color: "indigo",
        milestones: [
          { threshold: 5, tier: "BRONZE" as Tier },
          { threshold: 15, tier: "SILVER" as Tier },
          { threshold: 30, tier: "GOLD" as Tier },
          { threshold: 60, tier: "PLATINUM" as Tier },
          { threshold: 100, tier: "DIAMOND" as Tier },
        ],
      },
    ];

    const createdBadges = [];
    for (const badge of badges) {
      const createdBadge = await prisma.badge.create({
        data: {
          title: badge.title,
          description: badge.description,
          condition: badge.condition,
          icon: badge.icon,
          color: badge.color,
          milestones: {
            create: badge.milestones,
          },
        },
      });
      createdBadges.push(createdBadge);
    }
    console.log(`✅ Seeded ${createdBadges.length} badges with milestones.`);

    // 6. Seed Users
    console.log("👤 Seeding users...");
    const users = [];

    // Create test users first
    const test1 = await prisma.user.create({
      data: {
        username: "test1user",
        email: "test1@gmail.com",
        password: await argon2.hash("test"),
        firstName: "Test",
        lastName: "One",
        isVerified: true,
        avatar: faker.image.avatar(),
        banner: faker.image.url({ width: 1200, height: 300 }),
        headline: "Professional Developer & Designer",
        bio: "Experienced full-stack developer with expertise in modern web technologies.",
        isKycVerified: true,
        country: "United States",
        languages: ["English", "Spanish"],
      },
    });
    users.push(test1);

    const test2 = await prisma.user.create({
      data: {
        username: "test2user",
        email: "test2@gmail.com",
        password: await argon2.hash("test"),
        firstName: "Test",
        lastName: "Two",
        isVerified: true,
        avatar: faker.image.avatar(),
        banner: faker.image.url({ width: 1200, height: 300 }),
        headline: "Creative Designer & Content Creator",
        bio: "Passionate about creating stunning visual designs and engaging content.",
        isKycVerified: true,
        country: "United Kingdom",
        languages: ["English", "French"],
      },
    });
    users.push(test2);

    // Create additional users
    for (let i = 0; i < 150; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const user = await prisma.user.create({
        data: {
          username: faker.internet.username({ firstName, lastName }),
          email: faker.internet.email({ firstName, lastName }),
          password: await argon2.hash(faker.internet.password({ length: 12 })),
          firstName,
          lastName,
          isVerified: faker.datatype.boolean({ probability: 0.9 }),
          avatar: faker.datatype.boolean({ probability: 0.8 })
            ? faker.image.avatar()
            : null,
          banner: faker.datatype.boolean({ probability: 0.6 })
            ? faker.image.url({ width: 1200, height: 300 })
            : null,
          headline: faker.datatype.boolean({ probability: 0.7 })
            ? faker.person.jobTitle()
            : null,
          bio: faker.datatype.boolean({ probability: 0.6 })
            ? faker.lorem.paragraph()
            : null,
          isKycVerified: faker.datatype.boolean({ probability: 0.4 }),
          country: faker.helpers.arrayElement(countries),
          languages: faker.helpers.arrayElements(languages, { min: 1, max: 3 }),
        },
      });
      users.push(user);
    }
    console.log(`✅ Seeded ${users.length} users.`);

    // 7. Seed UserPreferences
    console.log("⚙️ Seeding user preferences...");
    for (const user of users) {
      await prisma.userPreferences.create({
        data: {
          userId: user.id,
          timezone: faker.helpers.arrayElement([
            "UTC",
            "America/New_York",
            "America/Los_Angeles",
            "Europe/London",
            "Europe/Paris",
            "Asia/Tokyo",
            "Australia/Sydney",
            "America/Toronto",
          ]),
          language: faker.helpers.arrayElement([
            "en_US",
            "es_ES",
            "fr_FR",
            "de_DE",
            "it_IT",
            "pt_BR",
            "ja_JP",
            "zh_CN",
          ]),
          ordersEnabled: faker.datatype.boolean({ probability: 0.9 }),
          ordersEmail: faker.datatype.boolean({ probability: 0.7 }),
          ordersInApp: faker.datatype.boolean({ probability: 0.95 }),
          messagesEnabled: faker.datatype.boolean({ probability: 0.95 }),
          messagesEmail: faker.datatype.boolean({ probability: 0.6 }),
          messagesInApp: faker.datatype.boolean({ probability: 0.9 }),
          reviewsEnabled: faker.datatype.boolean({ probability: 0.85 }),
          reviewsEmail: faker.datatype.boolean({ probability: 0.4 }),
          reviewsInApp: faker.datatype.boolean({ probability: 0.8 }),
          quietHoursEnabled: faker.datatype.boolean({ probability: 0.3 }),
          quietHoursStartTime: faker.datatype.boolean({ probability: 0.3 })
            ? "22:00"
            : null,
          quietHoursEndTime: faker.datatype.boolean({ probability: 0.3 })
            ? "08:00"
            : null,
        },
      });
    }
    console.log(`✅ Seeded user preferences for all users.`);

    throw new Error("Seeding stopped for testing purposes");

    // 8. Seed Verification Tokens (for some unverified users)
    console.log("🔐 Seeding verification tokens...");
    const unverifiedUsers = users.filter((u) => !u.isVerified);
    let tokenCount = 0;
    for (const user of unverifiedUsers.slice(0, 20)) {
      await prisma.verificationToken.create({
        data: {
          userId: user.id,
          code: faker.string.alphanumeric(32),
          expiresAt: faker.date.future(),
        },
      });
      tokenCount++;
    }
    console.log(`✅ Seeded ${tokenCount} verification tokens.`);

    // 9. Seed Wallets
    // console.log("💰 Seeding wallets...");
    // const wallets = [];
    // for (const user of users) {
    //   const walletCount = faker.number.int({ min: 1, max: 3 });
    //   for (let i = 0; i < walletCount; i++) {
    //     const wallet = await prisma.wallet.create({
    //       data: {
    //         publicKey: faker.string.alphanumeric(44), // Solana public key length
    //         userId: user.id,
    //         isMain: i === 0,
    //         name: i === 0 ? "Main Wallet" : `Wallet ${i + 1}`,
    //       },
    //     });
    //     wallets.push(wallet);
    //   }
    // }
    // console.log(`✅ Seeded ${wallets.length} wallets.`);
    //
    // 10. Seed User Skills
    console.log("🎯 Seeding user skills...");
    let userSkillCount = 0;
    for (const user of users) {
      const skillCount = faker.number.int({ min: 3, max: 12 });
      const selectedSkills = faker.helpers.arrayElements(
        createdSkills,
        skillCount
      );

      for (const skill of selectedSkills) {
        await prisma.userSkill.create({
          data: {
            userId: user.id,
            skillId: skill.id,
            level: faker.number.int({ min: 1, max: 10 }),
          },
        });
        userSkillCount++;
      }
    }
    console.log(`✅ Seeded ${userSkillCount} user skills.`);

    // 11. Seed Social Links
    console.log("🔗 Seeding social links...");
    const socialLinkTypes: SocialLinkType[] = [
      "X",
      "GITHUB",
      "LINKEDIN",
      "INSTAGRAM",
      "FACEBOOK",
      "TIKTOK",
      "YOUTUBE",
      "DISCORD",
      "TELEGRAM",
      "WHATSAPP",
      "WEBSITE",
      "EMAIL",
    ];

    let socialLinkCount = 0;
    for (const user of users) {
      const linkCount = faker.number.int({ min: 1, max: 5 });
      const selectedTypes = faker.helpers.arrayElements(
        socialLinkTypes,
        linkCount
      );

      for (const type of selectedTypes) {
        let url: string;
        const username = faker.internet.username();

        switch (type) {
          case "X":
            url = `https://x.com/${username}`;
            break;
          case "GITHUB":
            url = `https://github.com/${username}`;
            break;
          case "LINKEDIN":
            url = `https://linkedin.com/in/${username}`;
            break;
          case "INSTAGRAM":
            url = `https://instagram.com/${username}`;
            break;
          case "FACEBOOK":
            url = `https://facebook.com/${username}`;
            break;
          case "TIKTOK":
            url = `https://tiktok.com/@${username}`;
            break;
          case "YOUTUBE":
            url = `https://youtube.com/@${username}`;
            break;
          case "DISCORD":
            url = `${username}#${faker.number.int({ min: 1000, max: 9999 })}`;
            break;
          case "TELEGRAM":
            url = `https://t.me/${username}`;
            break;
          case "WHATSAPP":
            url = `https://wa.me/${faker.phone.number().replace(/\D/g, "")}`;
            break;
          case "WEBSITE":
            url = faker.internet.url();
            break;
          case "EMAIL":
            url = `mailto:${faker.internet.email()}`;
            break;
        }

        await prisma.socialLink.create({
          data: {
            type,
            url,
            userId: user.id,
          },
        });
        socialLinkCount++;
      }
    }
    console.log(`✅ Seeded ${socialLinkCount} social links.`);

    // 12. Seed Media Files
    console.log("📸 Seeding media files...");
    const mediaFiles: MediaFile[] = [];
    for (let i = 0; i < 300; i++) {
      const mediaType = getRandomMediaType();
      const url = getRandomUrl(mediaType);

      const mediaFile = await prisma.mediaFile.create({
        data: {
          url,
          type: mediaType,
        },
      });
      mediaFiles.push(mediaFile);
    }
    console.log(`✅ Seeded ${mediaFiles.length} media files.`);

    // 13. Seed Portfolio Items
    console.log("📂 Seeding portfolio items...");
    let portfolioCount = 0;
    for (const user of users.slice(0, 100)) {
      const itemCount = faker.number.int({ min: 2, max: 10 });

      for (let i = 0; i < itemCount; i++) {
        await prisma.portfolioItem.create({
          data: {
            title: faker.commerce.productName(),
            description: faker.datatype.boolean({ probability: 0.8 })
              ? faker.commerce.productDescription()
              : null,
            url: faker.datatype.boolean({ probability: 0.6 })
              ? faker.internet.url()
              : null,
            userId: user.id,
            images: {
              create: Array.from(
                { length: faker.number.int({ min: 1, max: 4 }) },
                (_, idx) => ({
                  fileId: faker.helpers.arrayElement(
                    mediaFiles.filter((mf) => mf.type === "IMAGE")
                  ).id,
                  isPrimary: idx === 0,
                })
              ),
            },
          },
        });
        portfolioCount++;
      }
    }
    console.log(`✅ Seeded ${portfolioCount} portfolio items.`);

    // 14. Seed User Badge Progress
    console.log("🏅 Seeding user badge progress...");
    let badgeProgressCount = 0;
    for (const user of users) {
      const userBadgeCount = faker.number.int({ min: 2, max: 6 });
      const selectedBadges = faker.helpers.arrayElements(
        createdBadges,
        userBadgeCount
      );

      for (const badge of selectedBadges) {
        const milestones = await prisma.badgeMilestone.findMany({
          where: { badgeId: badge.id },
          orderBy: { threshold: "asc" },
        });

        const maxThreshold = Math.max(...milestones.map((m) => m.threshold));
        const currentProgress = faker.number.int({
          min: 0,
          max: Math.floor(maxThreshold * 1.2),
        });

        let highestTier: Tier = "NONE";
        for (const milestone of milestones.reverse()) {
          if (currentProgress >= milestone.threshold) {
            highestTier = milestone.tier;
            break;
          }
        }

        await prisma.userBadgeProgress.create({
          data: {
            userId: user.id,
            badgeId: badge.id,
            currentProgress,
            highestTier,
            isFeatured: faker.datatype.boolean({ probability: 0.2 }),
          },
        });
        badgeProgressCount++;
      }
    }
    console.log(`✅ Seeded ${badgeProgressCount} user badge progress records.`);

    // 15. Seed Gigs
    console.log("🛍️ Seeding gigs...");
    const categories = await prisma.category.findMany();
    const tagsList = await prisma.tag.findMany();
    const gigs = [];

    for (let i = 0; i < 300; i++) {
      const seller = faker.helpers.arrayElement(users);
      const category = faker.helpers.arrayElement(categories);
      const gigTags = faker.helpers.arrayElements(tagsList, { min: 3, max: 8 });

      const featureCount = faker.number.int({ min: 4, max: 10 });
      const gigFeatures = Array.from({ length: featureCount }, () => ({
        title:
          faker.commerce.productAdjective() +
          " " +
          faker.commerce.productMaterial(),
      }));

      const faqCount = faker.number.int({ min: 2, max: 6 });
      const gigFaqs = Array.from({ length: faqCount }, () => ({
        question: faker.helpers.fake(
          "How {{commerce.productAdjective}} is the {{commerce.product}}?"
        ),
        answer: faker.commerce.productDescription(),
      }));

      const packageCount = faker.helpers.weightedArrayElement([
        { value: 1, weight: 10 },
        { value: 2, weight: 20 },
        { value: 3, weight: 60 },
        { value: 4, weight: 8 },
        { value: 5, weight: 2 },
      ]);

      const packageNames = [
        "Basic",
        "Standard",
        "Premium",
        "Pro",
        "Enterprise",
      ];
      const packages = packageNames
        .slice(0, packageCount)
        .map((title, idx) => ({
          title,
          price: faker.number.float({
            min: 10 + idx * 50,
            max: 50 + idx * 200,
            fractionDigits: 2,
          }),
          revisions: idx + faker.number.int({ min: 1, max: 3 }),
          deliveryTime: Math.max(
            1,
            7 - idx + faker.number.int({ min: -2, max: 5 })
          ),
        }));

      const gig = await prisma.gig.create({
        data: {
          title: faker.helpers.fake(
            "I will {{commerce.product}} {{commerce.productAdjective}} {{commerce.productMaterial}}"
          ),
          description: faker.lorem.paragraphs(3),
          sellerId: seller.id,
          categoryId: category.id,
          tags: { connect: gigTags.map((tag) => ({ id: tag.id })) },
          features: { create: gigFeatures },
          faqs: { create: gigFaqs },
          packages: { create: packages },
          images: {
            create: Array.from(
              {
                length: faker.number.int({ min: 1, max: 5 }),
              },
              (_, idx) => ({
                fileId: faker.helpers.arrayElement(
                  mediaFiles.filter((mf) => mf.type === "IMAGE")
                ).id,
                isPrimary: idx === 0,
              })
            ),
          },
        },
        include: {
          features: true,
          packages: true,
        },
      });

      // Create package features
      for (const pkg of gig.packages) {
        for (const feature of gig.features) {
          const packageIndex = gig.packages.findIndex((p) => p.id === pkg.id);
          const inclusionProbability = 0.3 + packageIndex * 0.2;

          await prisma.packageFeature.create({
            data: {
              gigPackageId: pkg.id,
              featureId: feature.id,
              isIncluded: faker.datatype.boolean({
                probability: inclusionProbability,
              }),
            },
          });
        }
      }

      gigs.push(gig);
    }
    console.log(`✅ Seeded ${gigs.length} gigs.`);

    // 16. Seed Orders
    console.log("📦 Seeding orders...");
    const orders = [];
    for (let i = 0; i < 800; i++) {
      const buyer = faker.helpers.arrayElement(users);
      const gig = faker.helpers.arrayElement(gigs);
      const seller = users.find((u) => u.id === gig.sellerId)!;

      if (buyer.id === seller.id) continue; // Skip if buyer is seller

      const packages = await prisma.package.findMany({
        where: { gigId: gig.id },
      });
      const pkg = faker.helpers.arrayElement(packages);

      const status = faker.helpers.arrayElement<OrderStatus>([
        "PENDING_PAYMENT",
        "PAID",
        "DELIVERED",
        "COMPLETED",
        "DISPUTE",
        "REFUNDED",
        "EXPIRED",
        "CANCELLED",
      ]);

      const createdAt = faker.date.past({ years: 1 });
      const deadline = new Date(createdAt);
      deadline.setDate(deadline.getDate() + pkg.deliveryTime);

      const order = await prisma.order.create({
        data: {
          deadline,
          status,
          packageId: pkg.id,
          buyerId: buyer.id,
          sellerId: seller.id,
          gigId: gig.id,
          createdAt,
          chat: {
            create: {
              buyerId: buyer.id,
              sellerId: seller.id,
              messages: {
                create: {
                  type: "SYSTEM",
                  systemContent: {
                    create: {
                      type: "WELCOME",
                      content: `Order created for "${gig.title}" - ${pkg.title} package.`,
                    },
                  },
                  createdAt,
                },
              },
            },
          },
        },
        include: {
          chat: true,
          package: true,
        },
      });

      // Add transaction for completed orders
      //if (
      //  status === "COMPLETED" &&
      //  faker.datatype.boolean({ probability: 0.9 })
      //) {
      //  const buyerWallet = wallets.find(
      //    (w) => w.userId === buyer.id && w.isMain
      //  )!;
      //  const sellerWallet = wallets.find(
      //    (w) => w.userId === seller.id && w.isMain
      //  )!;
      //
      //  await prisma.transaction.create({
      //    data: {
      //      txId: faker.string.alphanumeric(88), // Solana transaction ID length
      //      amount: pkg.price,
      //      senderPublicKey: buyerWallet.publicKey,
      //      receiverPublicKey: sellerWallet.publicKey,
      //      orderId: order.id,
      //      createdAt: faker.date.between({ from: createdAt, to: deadline }),
      //    },
      //  });
      //}

      orders.push(order);
    }
    console.log(`✅ Seeded ${orders.length} orders.`);

    // 17. Seed Chat Messages
    //console.log("💬 Seeding chat messages...");
    //let messageCount = 0;
    //for (const order of orders) {
    //  const msgCount = faker.number.int({ min: 2, max: 20 });
    //  let currentTime = order.createdAt;
    //
    //  for (let i = 0; i < msgCount; i++) {
    //    const isFromBuyer = faker.datatype.boolean();
    //    const senderId = isFromBuyer ? order.buyerId : order.sellerId;
    //    const messageType = faker.helpers.weightedArrayElement([
    //      { value: "TEXT", weight: 80 },
    //      { value: "MEDIA", weight: 15 },
    //      { value: "SYSTEM", weight: 5 },
    //    ]);
    //
    //    currentTime = faker.date.between({
    //      from: currentTime,
    //      to: new Date(currentTime.getTime() + 3600000),
    //    });
    //
    //    let messageData = {
    //      type: messageType,
    //      chatId: order.chat!.id,
    //      status: faker.helpers.arrayElement<MessageStatus>([
    //        "SENT",
    //        "DELIVERED",
    //        "READ",
    //      ]),
    //      createdAt: currentTime,
    //    };
    //
    //    if (messageType === "TEXT") {
    //      messageData.textContent = {
    //        create: {
    //          text: faker.lorem.sentence(),
    //          userMessage: {
    //            create: {
    //              userId: senderId,
    //            },
    //          },
    //        },
    //      };
    //    } else if (messageType === "MEDIA") {
    //      const mediaType = getRandomMediaType();
    //      const mediaFile = faker.helpers.arrayElement(
    //        mediaFiles.filter((mf) => mf.type === mediaType)
    //      );
    //
    //      messageData.mediaContent = {
    //        create: {
    //          files: {
    //            connect: [{ id: mediaFile.id }],
    //          },
    //          userMessage: {
    //            create: {
    //              userId: senderId,
    //            },
    //          },
    //        },
    //      };
    //    } else if (messageType === "SYSTEM") {
    //      messageData.systemContent = {
    //        create: {
    //          type: "WELCOME",
    //          content: faker.helpers.arrayElement([
    //            "Order status updated to IN_PROGRESS",
    //            "Delivery time extended by 1 day",
    //            "Buyer requested revision",
    //            "Order marked as complete",
    //          ]),
    //        },
    //      };
    //    }
    //
    //    await prisma.message.create({ data: messageData });
    //    messageCount++;
    //  }
    //}
    //console.log(`✅ Seeded ${messageCount} chat messages.`);

    // 18. Seed Reviews
    console.log("⭐ Seeding reviews...");
    let reviewCount = 0;
    const completedOrders = orders.filter(
      (o) => o.status === "COMPLETED" && o.deadline < new Date()
    );

    for (const order of completedOrders) {
      if (faker.datatype.boolean({ probability: 0.85 })) {
        const rating = faker.helpers.weightedArrayElement([
          { value: 5, weight: 50 },
          { value: 4, weight: 30 },
          { value: 3, weight: 10 },
          { value: 2, weight: 5 },
          { value: 1, weight: 5 },
        ]);

        const review = await prisma.review.create({
          data: {
            rating,
            title: faker.lorem.sentence(),
            description: faker.lorem.paragraph(),
            orderId: order.id,
            authorId: order.buyerId,
            gigId: order.gigId,
            createdAt: faker.date.between({
              from: order.deadline,
              to: new Date(),
            }),
          },
        });

        // Add seller response for some reviews
        if (faker.datatype.boolean({ probability: 0.4 })) {
          await prisma.review.update({
            where: { id: review.id },
            data: {
              sellerResponse: faker.lorem.sentence(),
              sellerRespondedAt: faker.date.between({
                from: review.createdAt,
                to: new Date(),
              }),
            },
          });
        }

        reviewCount++;
      }
    }
    console.log(`✅ Seeded ${reviewCount} reviews.`);

    // 19. Seed Contact Messages
    //console.log("📧 Seeding contact messages...");
    //const contactMessageTypes: ContactMessageType[] = [
    //  "TESTIMONIAL",
    //  "COMPLAINT",
    //  "SUPPORT",
    //  "FEEDBACK",
    //  "GENERAL_INQUIRY",
    //];
    //
    //let contactMessageCount = 0;
    //
    //// Testimonials
    //for (let i = 0; i < 30; i++) {
    //  const author = faker.helpers.arrayElement(users);
    //  await prisma.contactMessage.create({
    //    data: {
    //      type: "TESTIMONIAL",
    //      authorId: author.id,
    //      testimonialContent: {
    //        create: {
    //          content: faker.lorem.paragraphs(2),
    //          rating: faker.number.int({ min: 4, max: 5 }),
    //        },
    //      },
    //    },
    //  });
    //  contactMessageCount++;
    //}
    //
    //// Complaints
    //for (let i = 0; i < 20; i++) {
    //  const author = faker.helpers.arrayElement(users);
    //  const order = faker.helpers.arrayElement(orders);
    //  await prisma.contactMessage.create({
    //    data: {
    //      type: "COMPLAINT",
    //      authorId: author.id,
    //      complaintContent: {
    //        create: {
    //          orderId: order.id,
    //          description: faker.lorem.paragraph(),
    //          status: faker.helpers.arrayElement<ComplaintStatus>([
    //            "PENDING",
    //            "IN_REVIEW",
    //            "RESOLVED",
    //            "CLOSED",
    //          ]),
    //        },
    //      },
    //    },
    //  });
    //  contactMessageCount++;
    //}
    //
    //// Support requests
    //for (let i = 0; i < 40; i++) {
    //  const author = faker.helpers.arrayElement(users);
    //  await prisma.contactMessage.create({
    //    data: {
    //      type: "SUPPORT",
    //      authorId: author.id,
    //      supportContent: {
    //        create: {
    //          subject: faker.lorem.sentence(),
    //          description: faker.lorem.paragraphs(2),
    //          priority: faker.helpers.arrayElement<SupportPriority>([
    //            "LOW",
    //            "NORMAL",
    //            "HIGH",
    //            "URGENT",
    //          ]),
    //          status: faker.helpers.arrayElement<SupportStatus>([
    //            "OPEN",
    //            "IN_PROGRESS",
    //            "RESOLVED",
    //            "CLOSED",
    //          ]),
    //        },
    //      },
    //    },
    //  });
    //  contactMessageCount++;
    //}
    //
    //// Feedback
    //for (let i = 0; i < 25; i++) {
    //  const author = faker.helpers.arrayElement(users);
    //  await prisma.contactMessage.create({
    //    data: {
    //      type: "FEEDBACK",
    //      authorId: author.id,
    //      feedbackContent: {
    //        create: {
    //          message: faker.lorem.paragraph(),
    //          category: faker.helpers.arrayElement<FeedbackCategory>([
    //            "GENERAL",
    //            "FEATURE_REQUEST",
    //            "BUG_REPORT",
    //            "UI_UX",
    //          ]),
    //        },
    //      },
    //    },
    //  });
    //  contactMessageCount++;
    //}
    //
    //// General inquiries (some from guests)
    //for (let i = 0; i < 30; i++) {
    //  const isGuest = faker.datatype.boolean({ probability: 0.3 });
    //  await prisma.contactMessage.create({
    //    data: {
    //      type: "GENERAL_INQUIRY",
    //      authorId: isGuest ? null : faker.helpers.arrayElement(users).id,
    //      guestEmail: isGuest ? faker.internet.email() : null,
    //      generalContent: {
    //        create: {
    //          subject: faker.lorem.sentence(),
    //          message: faker.lorem.paragraphs(2),
    //        },
    //      },
    //    },
    //  });
    //  contactMessageCount++;
    //}
    //
    //console.log(`✅ Seeded ${contactMessageCount} contact messages.`);
    //
    // 20. Seed Notifications
    console.log("🔔 Seeding notifications...");
    const notificationTypes: NotificationType[] = [
      "ORDER_UPDATE",
      "MESSAGE",
      "PAYMENT",
      "REVIEW",
    ];

    let notificationCount = 0;
    for (const user of users) {
      const notifCount = faker.number.int({ min: 5, max: 15 });

      for (let i = 0; i < notifCount; i++) {
        const type = faker.helpers.arrayElement(notificationTypes);
        let title: string;
        let description: string;

        switch (type) {
          case "ORDER_UPDATE":
            title = "Order Status Updated";
            description = faker.helpers.arrayElement([
              "Your order is now in progress",
              "Order completed successfully",
              "Buyer requested a revision",
            ]);
            break;
          case "MESSAGE":
            title = "New Message";
            description = `You have a new message from ${faker.person.firstName()}`;
            break;
          case "PAYMENT":
            title = "Payment Received";
            description = `Payment of ${faker.number.float({ min: 10, max: 500, fractionDigits: 2 })} SOL received`;
            break;
          case "REVIEW":
            title = "New Review";
            description = `You received a ${faker.number.int({ min: 1, max: 5 })}-star review`;
            break;
        }

        await prisma.notification.create({
          data: {
            recipientId: user.id,
            type,
            title,
            description,
            isRead: faker.datatype.boolean({ probability: 0.6 }),
            createdAt: faker.date.recent({ days: 30 }),
          },
        });
        notificationCount++;
      }
    }
    console.log(`✅ Seeded ${notificationCount} notifications.`);

    // 21. Update message read status
    //console.log("✅ Updating message read status...");
    //const messages = await prisma.message.findMany({
    //  where: { status: "READ" },
    //  take: 200,
    //});
    //
    //for (const message of messages) {
    //  const chat = await prisma.chat.findUnique({
    //    where: { id: message.chatId },
    //  });
    //
    //  if (chat) {
    //    const readers = faker.helpers.arrayElements(
    //      [chat.buyerId, chat.sellerId],
    //      faker.number.int({ min: 1, max: 2 })
    //    );
    //
    //    await prisma.message.update({
    //      where: { id: message.id },
    //      data: {
    //        readBy: {
    //          connect: readers.map((id) => ({ id })),
    //        },
    //      },
    //    });
    //  }
    //}
    //console.log(`✅ Updated message read status.`);

    // Final summary
    console.log("\n🎉 Database seeding completed successfully!");
    console.log("📊 Summary:");
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Gigs: ${gigs.length}`);
    console.log(`   - Orders: ${orders.length}`);
    console.log(`   - Reviews: ${reviewCount}`);
    //console.log(`   - Messages: ${messageCount}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Skills: ${createdSkills.length}`);
    console.log(`   - Badges: ${createdBadges.length}`);
    //console.log(`   - Contact Messages: ${contactMessageCount}`);
    console.log(`   - Notifications: ${notificationCount}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seed().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
