import {
  PrismaClient,
  type Category,
  type Tier,
  type SocialLinkType,
  type MediaType,
  type NotificationType,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import argon2 from "argon2";

const prisma = new PrismaClient();
const imageUrls = Array.from(
  { length: 10 },
  (_, i) => `https://picsum.photos/200/300?random=${i}`
);
const videoUrls = [
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "https://www.w3schools.com/html/movie.mp4",
];
const audioUrls = [
  "https://www.w3schools.com/html/horse.mp3",
  "https://www.w3schools.com/html/horse.ogg",
];
const documentUrls = [
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  "https://example.com/sample.pdf",
];

function getRandomMediaType() {
  const rand = Math.random();
  if (rand < 0.7) return "IMAGE";
  if (rand < 0.8) return "VIDEO";
  if (rand < 0.9) return "AUDIO";
  return "DOCUMENT";
}

function getRandomUrl(type: "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT") {
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
      return "https://example.com/default";
  }
}
type CategoryWithChildren = Category & {
  children: CategoryWithChildren[];
};

async function seed() {
  try {
    console.log("Starting database seeding...");

    // Clear existing data in proper order to respect foreign key constraints
    console.log("Clearing existing data...");
    await prisma.contactMessage.deleteMany({});
    await prisma.testimonialContent.deleteMany({});
    await prisma.portfolioItem.deleteMany({});
    await prisma.socialLink.deleteMany({});
    await prisma.userMessage.deleteMany({});
    await prisma.mediaFile.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.image.deleteMany({});
    await prisma.packageFeature.deleteMany({});
    await prisma.gigFeature.deleteMany({});
    await prisma.package.deleteMany({});
    await prisma.gigFaq.deleteMany({});
    await prisma.gig.deleteMany({});
    await prisma.tag.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.userSkill.deleteMany({});
    await prisma.skill.deleteMany({});
    await prisma.userBadgeProgress.deleteMany({});
    await prisma.badgeMilestone.deleteMany({});
    await prisma.badge.deleteMany({});
    await prisma.chat.deleteMany({});
    await prisma.message.deleteMany({});
    await prisma.textContent.deleteMany({});
    await prisma.mediaContent.deleteMany({});
    await prisma.systemContent.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});
    console.log("Existing data cleared successfully.");

    // 1. Seed Badges and Badge Milestones
    console.log("Seeding badges and milestones...");
    const badges = [
      {
        title: "Top Seller",
        description: "Awarded to sellers with high sales volume.",
        condition: "Number of completed orders",
        milestones: [
          { threshold: 10, tier: "BRONZE" },
          { threshold: 50, tier: "SILVER" },
          { threshold: 100, tier: "GOLD" },
          { threshold: 500, tier: "PLATINUM" },
          { threshold: 1000, tier: "DIAMOND" },
        ],
      },
      {
        title: "Highly Rated",
        description: "For sellers with many 5-star reviews.",
        condition: "Number of 5-star reviews",
        milestones: [
          { threshold: 5, tier: "BRONZE" },
          { threshold: 25, tier: "SILVER" },
          { threshold: 50, tier: "GOLD" },
          { threshold: 100, tier: "PLATINUM" },
          { threshold: 200, tier: "DIAMOND" },
        ],
      },
      {
        title: "Quick Responder",
        description: "For sellers with fast response times.",
        condition: "Messages replied within 1 hour",
        milestones: [
          { threshold: 10, tier: "BRONZE" },
          { threshold: 30, tier: "SILVER" },
          { threshold: 60, tier: "GOLD" },
          { threshold: 120, tier: "PLATINUM" },
          { threshold: 250, tier: "DIAMOND" },
        ],
      },
      {
        title: "Long-time Member",
        description: "For veteran platform users.",
        condition: "Months since joining",
        milestones: [
          { threshold: 6, tier: "BRONZE" },
          { threshold: 12, tier: "SILVER" },
          { threshold: 24, tier: "GOLD" },
          { threshold: 36, tier: "PLATINUM" },
          { threshold: 60, tier: "DIAMOND" },
        ],
      },
      {
        title: "Verified Seller",
        description: "For sellers who completed KYC.",
        condition: "Verification steps completed",
        milestones: [
          { threshold: 1, tier: "BRONZE" },
          { threshold: 2, tier: "SILVER" },
          { threshold: 3, tier: "GOLD" },
        ],
      },
      {
        title: "Portfolio Master",
        description: "For sellers with rich portfolios.",
        condition: "Number of portfolio items",
        milestones: [
          { threshold: 5, tier: "BRONZE" },
          { threshold: 15, tier: "SILVER" },
          { threshold: 30, tier: "GOLD" },
          { threshold: 50, tier: "PLATINUM" },
          { threshold: 100, tier: "DIAMOND" },
        ],
      },
      {
        title: "Skill Master",
        description: "For sellers with many skills.",
        condition: "Number of skills",
        milestones: [
          { threshold: 5, tier: "BRONZE" },
          { threshold: 10, tier: "SILVER" },
          { threshold: 20, tier: "GOLD" },
          { threshold: 40, tier: "PLATINUM" },
          { threshold: 80, tier: "DIAMOND" },
        ],
      },
      {
        title: "Customer Favorite",
        description: "For sellers with repeat customers.",
        condition: "Number of repeat orders",
        milestones: [
          { threshold: 5, tier: "BRONZE" },
          { threshold: 20, tier: "SILVER" },
          { threshold: 50, tier: "GOLD" },
          { threshold: 100, tier: "PLATINUM" },
          { threshold: 200, tier: "DIAMOND" },
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
          milestones: {
            create: badge.milestones as Array<{
              threshold: number;
              tier: Tier;
            }>,
          },
        },
      });
      createdBadges.push(createdBadge);
    }
    console.log(`Seeded ${createdBadges.length} badges with milestones.`);

    // 2. Seed Categories
    console.log("Seeding categories...");
    const categoryStructure = [
      {
        title: "Programming & Tech",
        children: [
          {
            title: "Web Development",
            children: [
              {
                title: "Frontend Development",
                children: [
                  { title: "React Development" },
                  { title: "Vue.js Development" },
                ],
              },
              {
                title: "Backend Development",
                children: [
                  { title: "Node.js Development" },
                  { title: "Django Development" },
                ],
              },
              { title: "Full Stack Development" },
            ],
          },
          {
            title: "Mobile Development",
            children: [
              { title: "iOS Development" },
              { title: "Android Development" },
            ],
          },
          { title: "Data Science" },
          {
            title: "AI & Machine Learning",
            children: [
              { title: "Natural Language Processing" },
              { title: "Computer Vision" },
            ],
          },
        ],
      },
      {
        title: "Design & Creative",
        children: [
          {
            title: "Graphic Design",
            children: [
              { title: "Logo Design" },
              { title: "Branding" },
              {
                title: "Illustration",
                children: [
                  { title: "Digital Illustration" },
                  { title: "Traditional Illustration" },
                ],
              },
            ],
          },
          { title: "UI/UX Design" },
          { title: "Animation" },
        ],
      },
      {
        title: "Writing & Translation",
        children: [
          { title: "Content Writing" },
          {
            title: "Copywriting",
            children: [
              { title: "Ad Copywriting" },
              { title: "SEO Copywriting" },
            ],
          },
          { title: "Translation" },
        ],
      },
      {
        title: "Business",
        children: [
          { title: "Business Consulting" },
          {
            title: "Financial Consulting",
            children: [
              { title: "Tax Consulting" },
              { title: "Investment Advice" },
            ],
          },
          { title: "Legal Consulting" },
        ],
      },
      {
        title: "Marketing",
        children: [
          {
            title: "Digital Marketing",
            children: [
              {
                title: "SEO",
                children: [{ title: "On-Page SEO" }, { title: "Off-Page SEO" }],
              },
              {
                title: "Social Media Marketing",
                children: [
                  { title: "Instagram Marketing" },
                  { title: "Facebook Marketing" },
                  { title: "TikTok Marketing" },
                ],
              },
            ],
          },
          { title: "Email Marketing" },
        ],
      },
      {
        title: "Video & Animation",
        children: [{ title: "Video Editing" }, { title: "Motion Graphics" }],
      },
      {
        title: "Music & Audio",
        children: [{ title: "Music Production" }, { title: "Voice Over" }],
      },
      { title: "Consulting" },
    ];

    async function createCategory(
      category: CategoryWithChildren,
      parentId: string | null = null,
      depth = 0
    ) {
      const created = await prisma.category.create({
        data: {
          title: category.title,
          depth,
          parentId,
          color: faker.helpers.arrayElement([
            "purple",
            "green",
            "gray",
            "blue",
            "green",
            "yellow",
          ]),
          icon: faker.helpers.arrayElement([
            "Code",
            "MonitorSmartphone",
            "Smartphone",
            "PenTool",
            "Palette",
            "FileText",
            "FileCode",
            "FileImage",
            "FileVideo",
          ]),
        },
      });
      if (category.children) {
        for (const child of category.children) {
          await createCategory(child, created.id, depth + 1);
        }
      }
      return created;
    }

    let categoryCount = 0;
    for (const category of categoryStructure) {
      await createCategory(category as CategoryWithChildren);
      categoryCount++;
    }
    console.log(
      `Seeded ${categoryCount} top-level categories with subcategories.`
    );

    // 3. Seed Tags
    console.log("Seeding tags...");
    const tags = [
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "Django",
      "Flask",
      "Java",
      "Spring",
      "PHP",
      "Laravel",
      "WordPress",
      "HTML",
      "CSS",
      "Bootstrap",
      "Tailwind",
      "UI/UX",
      "Graphic Design",
      "Logo Design",
      "Illustration",
      "Animation",
      "Video Editing",
      "Content Writing",
      "Copywriting",
      "SEO",
      "Social Media",
      "Email Marketing",
      "Business Consulting",
      "Music Production",
      "Voice Over",
      "Data Analysis",
    ];

    await prisma.tag.createMany({
      data: tags.map((title) => ({ title })),
      skipDuplicates: true,
    });
    console.log(`Seeded ${tags.length} tags.`);

    // 4. Seed Skills
    console.log("Seeding skills...");
    const skillsList = [
      "JavaScript",
      "Python",
      "Java",
      "React",
      "Node.js",
      "HTML",
      "CSS",
      "TypeScript",
      "Angular",
      "Vue.js",
      "Express.js",
      "Django",
      "Flask",
      "Spring Boot",
      "PHP",
      "Laravel",
      "WordPress",
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Docker",
      "Kubernetes",
      "AWS",
      "Azure",
      "GCP",
      "Git",
      "GraphQL",
      "REST APIs",
      "Microservices",
      "Adobe Photoshop",
      "Adobe Illustrator",
      "Figma",
      "Sketch",
      "UI/UX Design",
      "Graphic Design",
      "Logo Design",
      "Branding",
      "Video Editing",
      "Motion Graphics",
      "Content Writing",
      "Copywriting",
      "SEO",
      "Social Media Marketing",
      "Email Marketing",
      "Google Ads",
      "Facebook Ads",
      "Analytics",
      "Project Management",
      "Business Analysis",
    ];

    const createdSkills = [];
    for (const skillTitle of skillsList) {
      const skill = await prisma.skill.create({
        data: { title: skillTitle },
      });
      createdSkills.push(skill);
    }
    console.log(`Seeded ${createdSkills.length} skills.`);

    // 5. Seed Users
    console.log("Seeding users...");
    const users = [
      await prisma.user.create({
        data: {
          username: faker.internet.username(),
          email: "test1@gmail.com",
          password: await argon2.hash("test"),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          isVerified: true,
          avatar: faker.image.avatar(),
          headline: faker.lorem.sentence(),
          bio: faker.lorem.paragraph(),
          isKycVerified: false,
        },
      }),
      await prisma.user.create({
        data: {
          username: faker.internet.username(),
          email: "test2@gmail.com",
          password: await argon2.hash("test"),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          isVerified: true,
          avatar: faker.image.avatar(),
          headline: faker.lorem.sentence(),
          bio: faker.lorem.paragraph(),
          isKycVerified: false,
        },
      }),
    ];

    for (let i = 0; i < 100; i++) {
      const user = await prisma.user.create({
        data: {
          username: faker.internet.username(),
          email: faker.internet.email(),
          password: await argon2.hash(faker.internet.password()),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          isVerified: faker.datatype.boolean({
            probability: 90,
          }),
          avatar: faker.datatype.boolean({
            probability: 75,
          })
            ? faker.image.avatarGitHub()
            : null,
          headline: faker.datatype.boolean({
            probability: 75,
          })
            ? faker.lorem.sentence()
            : null,
          bio: faker.datatype.boolean({
            probability: 50,
          })
            ? faker.lorem.paragraph()
            : null,
          isKycVerified: faker.datatype.boolean({
            probability: 50,
          }),
        },
      });
      users.push(user);
    }
    console.log(`Seeded ${users.length} users.`);

    // 6. Seed User Skills
    console.log("Seeding user skills...");
    let userSkillCountTotal = 0;
    for (const user of users) {
      const userSkillCount = faker.number.int({ min: 3, max: 8 });
      const selectedSkills = faker.helpers
        .shuffle(createdSkills)
        .slice(0, userSkillCount);

      for (const skill of selectedSkills) {
        await prisma.userSkill.create({
          data: {
            userId: user.id,
            skillId: skill.id,
            level: faker.number.int({ min: 1, max: 10 }),
          },
        });
        userSkillCountTotal++;
      }
    }
    console.log(`Seeded ${userSkillCountTotal} user skills.`);

    // 7. Seed Social Links
    console.log("Seeding social links...");
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

    let socialLinkCountTotal = 0;
    for (const user of users) {
      const linkCount = faker.number.int({ min: 1, max: 4 });
      const selectedTypes = faker.helpers
        .shuffle(socialLinkTypes)
        .slice(0, linkCount);

      for (const type of selectedTypes) {
        let url: string;
        switch (type) {
          case "X":
            url = `https://x.com/${faker.internet.username()}`;
            break;
          case "GITHUB":
            url = `https://github.com/${faker.internet.username()}`;
            break;
          case "LINKEDIN":
            url = `https://linkedin.com/in/${faker.internet.username()}`;
            break;
          case "INSTAGRAM":
            url = `https://instagram.com/${faker.internet.username()}`;
            break;
          case "FACEBOOK":
            url = `https://facebook.com/${faker.internet.username()}`;
            break;
          case "WEBSITE":
            url = faker.internet.url();
            break;
          case "EMAIL":
            url = `mailto:${faker.internet.email()}`;
            break;
          default:
            url = faker.internet.url();
        }

        await prisma.socialLink.create({
          data: {
            type,
            url,
            userId: user.id,
          },
        });
        socialLinkCountTotal++;
      }
    }
    console.log(`Seeded ${socialLinkCountTotal} social links.`);

    // 8. Seed Portfolio Items
    console.log("Seeding portfolio items...");
    let portfolioItemCountTotal = 0;
    for (const user of users.slice(0, 80)) {
      const portfolioItemCount = faker.number.int({ min: 2, max: 8 });

      for (let i = 0; i < portfolioItemCount; i++) {
        await prisma.portfolioItem.create({
          data: {
            title: faker.lorem.words(faker.number.int({ min: 2, max: 5 })),
            description: faker.datatype.boolean({ probability: 80 })
              ? faker.lorem.paragraph()
              : null,
            url: faker.datatype.boolean({ probability: 60 })
              ? faker.internet.url()
              : null,
            userId: user.id,
          },
        });
        portfolioItemCountTotal++;
      }
    }
    console.log(`Seeded ${portfolioItemCountTotal} portfolio items.`);

    // 9. Seed User Badge Progress
    console.log("Seeding user badge progress...");
    let badgeProgressCountTotal = 0;
    for (const user of users) {
      const badgeCount = faker.number.int({ min: 3, max: 6 });
      const selectedBadges = faker.helpers
        .shuffle(createdBadges)
        .slice(0, badgeCount);

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
            isFeatured: faker.datatype.boolean({ probability: 20 }),
          },
        });
        badgeProgressCountTotal++;
      }
    }
    console.log(
      `Seeded ${badgeProgressCountTotal} user badge progress records.`
    );

    // 10. Seed Media Files
    console.log("Seeding media files...");
    const mediaFiles = [];
    for (let i = 0; i < 200; i++) {
      const mediaType = getRandomMediaType() as MediaType;
      const url = getRandomUrl(
        mediaType as "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT"
      );

      const mediaFile = await prisma.mediaFile.create({
        data: {
          url,
          type: mediaType,
        },
      });
      mediaFiles.push(mediaFile);
    }
    console.log(`Seeded ${mediaFiles.length} media files.`);

    // 11. Seed Testimonials
    console.log("Seeding testimonials...");
    const testimonials = [
      {
        content:
          "Great service, highly recommended! The seller was attentive to my needs and delivered exactly what I was looking for. Communication was smooth and the final product exceeded my expectations.",
        rating: 5,
      },
      {
        content:
          "Fast delivery and excellent quality. The project was completed ahead of schedule and the attention to detail was impressive. I will definitely be coming back for more work in the future.",
        rating: 5,
      },
      {
        content:
          "Very professional and helpful seller. They answered all my questions promptly and provided valuable suggestions to improve my project. The overall experience was seamless and enjoyable.",
        rating: 4,
      },
      {
        content:
          "Exceeded my expectations! The work delivered was of outstanding quality and the seller went above and beyond to ensure my satisfaction. I am extremely pleased with the results.",
        rating: 5,
      },
      {
        content:
          "Good communication throughout. The seller kept me updated at every stage and was always available to address my concerns. The final outcome was exactly as described and delivered on time.",
        rating: 4,
      },
      {
        content:
          "Fantastic work, will hire again. The seller demonstrated great expertise and creativity, producing a result that perfectly matched my vision. Highly trustworthy and reliable service.",
        rating: 5,
      },
      {
        content:
          "Reliable and skilled professional. The seller handled my project with care and precision, delivering high-quality work within the agreed timeframe. I appreciate the dedication and effort.",
        rating: 4,
      },
      {
        content:
          "Amazing results in short time. The seller worked efficiently without compromising on quality and provided regular updates. I am very satisfied with the entire process and the final product.",
        rating: 5,
      },
      {
        content:
          "Friendly and efficient service. The seller was approachable and easy to work with, making the whole experience stress-free. The work delivered was top-notch and met all my requirements.",
        rating: 4,
      },
      {
        content:
          "Top-notch quality, very satisfied. The seller's expertise was evident in every aspect of the project, from planning to execution. I would highly recommend their services to anyone in need.",
        rating: 5,
      },
    ];

    let testimonialCount = 0;
    for (let i = 0; i < 10; i++) {
      const author = users[i % users.length];
      await prisma.contactMessage.create({
        data: {
          type: "TESTIMONIAL",
          authorId: author.id,
          testimonialContent: {
            create: {
              content: testimonials[i].content,
              rating: testimonials[i].rating,
            },
          },
        },
      });
      testimonialCount++;
    }
    console.log(`Seeded ${testimonialCount} testimonials.`);

    // 12. Seed Gigs
    console.log("Seeding gigs...");
    const categories = await prisma.category.findMany();
    const tagsList = await prisma.tag.findMany();
    const gigs = [];
    let packageFeatureCountTotal = 0;
    let imageCountTotal = 0;

    for (let i = 0; i < 200; i++) {
      const seller = users[Math.floor(Math.random() * users.length)];
      const category =
        categories[Math.floor(Math.random() * categories.length)];
      const gigTags = faker.helpers
        .shuffle(tagsList)
        .slice(0, faker.number.int({ min: 1, max: 8 }));

      const featureCount = faker.number.int({ min: 3, max: 8 });
      const gigFeatures = Array.from({ length: featureCount }, () => ({
        title: faker.lorem.words(faker.number.int({ min: 2, max: 4 })),
      }));

      const faqCount = faker.number.int({ min: 2, max: 6 });
      const gigFaqs = Array.from({ length: faqCount }, () => ({
        question: faker.lorem.sentence() + "?",
        answer: faker.lorem.paragraph(),
      }));

      const packageCount = faker.helpers.weightedArrayElement([
        { value: 1, weight: 1 },
        { value: 2, weight: 2 },
        { value: 3, weight: 5 },
        { value: 4, weight: 2 },
        { value: 5, weight: 1 },
      ]);

      const packageTitles = Array.from({ length: packageCount }, () =>
        faker.lorem.words(faker.number.int({ min: 1, max: 2 }))
      );

      const baseRevisions = faker.number.int({ min: 1, max: 2 });
      const baseDelivery = faker.number.int({ min: 2, max: 4 });
      const packages = packageTitles.map((title, idx) => {
        const revisions =
          baseRevisions + idx + faker.number.int({ min: 0, max: 1 });
        const deliveryTime =
          baseDelivery + idx * faker.number.int({ min: 1, max: 2 });
        return {
          title,
          price: faker.number.float({ min: 5, max: 500, fractionDigits: 2 }),
          revisions,
          deliveryTime,
        };
      });

      const gig = await prisma.gig.create({
        data: {
          title: faker.lorem.words(3),
          description: faker.lorem.paragraph(),
          sellerId: seller.id,
          categoryId: category.id,
          tags: { connect: gigTags.map((tag) => ({ id: tag.id })) },
          features: { create: gigFeatures },
          faqs: { create: gigFaqs },
          packages: { create: packages },
        },
        include: {
          features: true,
          packages: true,
        },
      });

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
          packageFeatureCountTotal++;
        }
      }

      const gigImageCount = faker.number.int({ min: 1, max: 4 });
      const imageFiles = mediaFiles
        .filter((mf) => mf.type === "IMAGE")
        .slice(0, gigImageCount);

      for (let j = 0; j < Math.min(gigImageCount, imageFiles.length); j++) {
        await prisma.image.create({
          data: {
            fileId: imageFiles[j].id,
            gigId: gig.id,
            isPrimary: j === 0,
          },
        });
        imageCountTotal++;
      }

      gigs.push(gig);
    }
    console.log(
      `Seeded ${gigs.length} gigs with ${packageFeatureCountTotal} package features and ${imageCountTotal} images.`
    );

    // 13. Add images to portfolio items
    console.log("Seeding portfolio item images...");
    const portfolioItems = await prisma.portfolioItem.findMany();
    let portfolioImageCountTotal = 0;
    for (const item of portfolioItems.slice(0, 100)) {
      const imageCount = faker.number.int({ min: 1, max: 3 });
      const availableImages = mediaFiles.filter((mf) => mf.type === "IMAGE");

      for (let i = 0; i < Math.min(imageCount, availableImages.length); i++) {
        const randomImage = faker.helpers.arrayElement(availableImages);
        await prisma.image.create({
          data: {
            fileId: randomImage.id,
            portfolioItemId: item.id,
            isPrimary: i === 0,
          },
        });
        portfolioImageCountTotal++;
      }
    }
    console.log(`Seeded ${portfolioImageCountTotal} portfolio item images.`);

    // 14. Seed Orders
    console.log("Seeding orders...");
    const orders = [];
    for (let i = 0; i < 500; i++) {
      const buyer = users[Math.floor(Math.random() * users.length)];
      const gig = gigs[Math.floor(Math.random() * gigs.length)];
      const seller = users.find((u) => u.id === gig.sellerId)!;
      const packages = await prisma.package.findMany({
        where: { gigId: gig.id },
      });
      const pkg = packages[Math.floor(Math.random() * packages.length)];
      const order = await prisma.order.create({
        data: {
          deadline: faker.date.future(),
          status: faker.helpers.arrayElement([
            "WAITING_FOR_PAYMENT",
            "IN_PROGRESS",
            "COMPLETED",
          ]),
          packageId: pkg.id,
          buyerId: buyer.id,
          sellerId: seller.id,
          gigId: gig.id,
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
                      content: `Order created for gig "${gig.title}" with package "${pkg.title}".`,
                    },
                  },
                },
              },
            },
          },
          createdAt: faker.date.past(),
        },
        select: {
          id: true,
          buyerId: true,
          sellerId: true,
          gigId: true,
          packageId: true,
          chat: {
            select: {
              id: true,
              messages: {
                select: {
                  id: true,
                  type: true,
                  textContent: {
                    select: { text: true },
                  },
                  mediaContent: {
                    select: { files: { select: { url: true, type: true } } },
                  },
                },
              },
            },
          },
          deadline: true,
          status: true,
          createdAt: true,
        },
      });
      orders.push(order);
    }
    console.log(`Seeded ${orders.length} orders.`);

    // 15. Seed Reviews
    console.log("Seeding reviews...");
    let reviewCount = 0;
    for (let i = 0; i < 400; i++) {
      const order = orders[Math.floor(Math.random() * orders.length)];
      const buyer = users.find((u) => u.id === order.buyerId)!;
      const rating = faker.number.int({ min: 1, max: 5 });
      try {
        await prisma.review.create({
          data: {
            title: faker.lorem.sentence(),
            description: faker.lorem.paragraph(),
            rating,
            orderId: order.id,
            authorId: buyer.id,
            createdAt: faker.date.past(),
          },
        });
        reviewCount++;
      } catch {}
    }
    console.log(`Seeded ${reviewCount} reviews.`);

    // 16. Seed Contact Messages
    console.log("Seeding contact messages...");
    let messageCountTotal = 0;
    for (let i = 0; i < orders.length; i++) {
      const messageCount = faker.number.int({ min: 1, max: 5 });
      const startDate = faker.date.past();
      let currentTime = startDate;
      for (let j = 0; j < messageCount; j++) {
        const isMedia = Math.random() < 0.2;
        if (isMedia) {
          const mediaType = getRandomMediaType();
          const url = getRandomUrl(mediaType);
          await prisma.message.create({
            data: {
              type: "MEDIA",
              chatId: orders[i].chat!.id,
              mediaContent: {
                create: {
                  userMessage: {
                    create: {
                      userId: orders[i].buyerId,
                    },
                  },
                  files: {
                    create: [{ url, type: mediaType }],
                  },
                },
              },
              createdAt: currentTime,
            },
          });
        } else {
          await prisma.message.create({
            data: {
              type: "TEXT",
              chatId: orders[i].chat!.id,
              textContent: {
                create: {
                  userMessage: { create: { userId: orders[i].buyerId } },
                  text: faker.lorem.sentence(),
                },
              },
              createdAt: currentTime,
            },
          });
        }
        const interval = faker.number.int({ min: 1, max: 30 }) * 60 * 1000;
        currentTime = new Date(currentTime.getTime() + interval);
        messageCountTotal++;
      }
    }
    console.log(`Seeded ${messageCountTotal} contact messages across chats.`);

    //seed notifications
    console.log("Seeding notifications...");
    const notificationTypes: NotificationType[] = [
      "ORDER_UPDATE",
      "MESSAGE",
      "PAYMENT",
      "SYSTEM",
      "REVIEW",
    ];

    let notificationCount = 0;
    for (const user of users) {
      const notificationCountForUser = faker.number.int({ min: 5, max: 10 });
      for (let i = 0; i < notificationCountForUser; i++) {
        const type = faker.helpers.arrayElement(notificationTypes);
        const content =
          type === "ORDER_UPDATE"
            ? `Your order has been updated.`
            : type === "MESSAGE"
              ? `You have a new message.`
              : type === "PAYMENT"
                ? `Payment received.`
                : type === "SYSTEM"
                  ? `System notification.`
                  : `New review received.`;

        await prisma.notification.create({
          data: {
            recipientId: user.id,
            type,
            title: faker.lorem.sentence(),
            description: content,
            isRead: faker.datatype.boolean({ probability: 50 }),
          },
        });
        notificationCount++;
      }
    }
    console.log(`Seeded ${notificationCount} notifications.`);

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    console.log("Disconnecting Prisma client...");
    await prisma.$disconnect();
    console.log("Prisma client disconnected.");
  }
}

seed();
