import {
  PrismaClient,
  type OrderStatus,
  type MediaFile,
  type Prisma,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

// Fixed Solana addresses for our 5 main sellers
const SELLER_WALLETS = [
  "6JdxAmKk3nckzT9fbJTv95xBffNQKaMTSmvSW16DU8vC",
  "3zkHBBbH9qfhZ7wATHGTz1fnGhi8EULHCHqQnZyMzVbm",
  "Bk3UYJrYgUjbUxwYvMPHSUchGnddrnhBqT5cgYLT4f3D",
  "EvamG5XbWFZK1uFRVD9Hpmbv98KY3GX4UhbeDGUPGgNC",
  "AZ5HvD21sKGq64cp2WRbxdZYFszCMA8uyosAFLg4B7dC",
];

// Helper data
const imageUrls = [
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600", // Business meeting
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600", // Laptop work
  "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&h=600", // Code on screen
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600", // Professional headshot
  "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=600", // Web design
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600", // Crypto/blockchain
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600", // Team working
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600", // Analytics dashboard
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600", // Creative workspace
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600", // Collaboration
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600", // Data visualization
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600", // Mobile development
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600", // Tech innovation
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=600", // Office space
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600", // Planning session
];

const avatarUrls = [
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
];

// Notification metadata types
type NotificationMetadata =
  | {
      type: "ORDER_UPDATE";
      orderId: string;
      status?: string;
      message?: string;
    }
  | {
      type: "REVIEW";
      reviewId: string;
      gigId: string;
      rating: number;
      transactionId: string;
      message?: string;
    }
  | {
      type: "MESSAGE";
      senderId: string;
      senderName: string;
      senderAvatar?: string;
      orderId: string;
      message?: string;
    }
  | {
      type: "PAYMENT";
      paymentId: string;
      amount: string;
      transactionId: string;
      message?: string;
    };

// Helper functions
function generateSolanaTxId(): string {
  return faker.string.alphanumeric(88);
}

// Clear database function
async function clearDatabase() {
  console.log("🧹 Clearing existing data...");

  // Clear in dependency order
  await prisma.failedLoginAttempt.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.userPreferences.deleteMany({});
  await prisma.fAQ.deleteMany({});
  await prisma.wallet.deleteMany({});

  // Message related
  await prisma.mediaContent.deleteMany({});
  await prisma.textContent.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.userMessage.deleteMany({});
  await prisma.chat.deleteMany({});

  // Order and review related
  await prisma.notification.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.order.deleteMany({});

  // Package and gig related
  await prisma.packageFeature.deleteMany({});
  await prisma.package.deleteMany({});
  await prisma.gigFeature.deleteMany({});
  await prisma.gigFaq.deleteMany({});
  await prisma.gig.deleteMany({});

  // Media and portfolio
  await prisma.mediaFile.deleteMany({});
  await prisma.portfolioItem.deleteMany({});
  await prisma.socialLink.deleteMany({});

  // Skills and badges
  await prisma.userBadgeProgress.deleteMany({});
  await prisma.userSkill.deleteMany({});

  // User related
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.verificationToken.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("✅ Database cleared successfully.");
}

// Main seed function
async function seed() {
  try {
    console.log("🚀 Starting focused database seeding...");

    await clearDatabase();

    // 1. Seed FAQs
    console.log("📋 Seeding FAQs...");
    const faqs = [
      {
        question: "How do I connect my Solana wallet?",
        answer:
          "Click the 'Connect Wallet' button in the navigation bar and select your preferred wallet (Phantom, Solflare, etc.). Approve the connection request in your wallet.",
      },
      {
        question: "What are the platform fees?",
        answer:
          "We charge a 10% service fee on completed orders. Sellers receive 90% of the order value. There are no listing fees or monthly charges.",
      },
      {
        question: "How does escrow work?",
        answer:
          "When you place an order, your payment is held in a secure smart contract. Funds are released to the seller only after you approve the delivered work.",
      },
      {
        question: "What if I'm not satisfied with the work?",
        answer:
          "You can request revisions based on the package you purchased. If issues persist, you can open a dispute and our team will help resolve it fairly.",
      },
      {
        question: "How long does seller verification take?",
        answer:
          "Verification typically takes 24-48 hours. We review your identity documents and may request additional information if needed.",
      },
    ];

    for (const faq of faqs) {
      await prisma.fAQ.create({ data: faq });
    }
    console.log(`✅ Seeded ${faqs.length} FAQs`);

    // 6. Seed Users - 5 Sellers + 25 Buyers
    console.log("👤 Seeding users...");
    const hashedPassword = await hash("test", 10);
    const users = [];
    const sellers = [];
    const buyers = [];

    // Create 5 main sellers with specific profiles
    const sellerProfiles = [
      {
        username: "alex_webdev",
        email: "alex@example.com",
        firstName: "Alex",
        lastName: "Chen",
        headline: "Full Stack Developer | React & Node.js Expert",
        bio: "5+ years building scalable web applications. Specialized in React, Next.js, and Node.js. Fast delivery and clean code guaranteed.",
        avatar: avatarUrls[0],
        skills: await Promise.all(
          [
            "React",
            "Next.js",
            "TypeScript",
            "Node.js",
            "PostgreSQL",
            "Git",
          ].map((title) => prisma.skill.create({ data: { title } }))
        ).then((skills) => skills.map((skill) => skill.title)),
      },
      {
        username: "sarah_blockchain",
        email: "sarah@example.com",
        firstName: "Sarah",
        lastName: "Miller",
        headline: "Solana Developer | Smart Contract Specialist",
        bio: "Building on Solana since 2021. Expert in Rust, Anchor framework, and DeFi protocols. Let's build the future of finance together.",
        avatar: avatarUrls[1],
        skills: await Promise.all(
          ["Solana", "Rust", "Smart Contracts", "Web3", "Anchor", "DeFi"].map(
            (title) => prisma.skill.create({ data: { title } })
          )
        ).then((skills) => skills.map((skill) => skill.title)),
      },
      {
        username: "maria_designer",
        email: "maria@example.com",
        firstName: "Maria",
        lastName: "Garcia",
        headline: "UI/UX Designer | Figma Expert",
        bio: "Creating beautiful, user-centered designs for web and mobile. Specialized in SaaS products and e-commerce platforms.",
        avatar: avatarUrls[2],
        skills: await Promise.all(
          ["UI Design", "UX Design", "Figma", "Tailwind CSS", "HTML/CSS"].map(
            (title) => prisma.skill.create({ data: { title } })
          )
        ).then((skills) => skills.map((skill) => skill.title)),
      },
      {
        username: "john_content",
        email: "john@example.com",
        firstName: "John",
        lastName: "Davis",
        headline: "Technical Writer | SEO Content Specialist",
        bio: "Helping tech companies communicate clearly. Expert in technical documentation, blog posts, and SEO-optimized content.",
        avatar: avatarUrls[3],
        skills: await Promise.all(
          [
            "Technical Writing",
            "Content Marketing",
            "SEO",
            "Communication",
          ].map((title) => prisma.skill.create({ data: { title } }))
        ).then((skills) => skills.map((skill) => skill.title)),
      },
      {
        username: "emma_marketing",
        email: "emma@example.com",
        firstName: "Emma",
        lastName: "Wilson",
        headline: "Digital Marketing Expert | Growth Hacker",
        bio: "Data-driven marketer with proven results. Specialized in SEO, content strategy, and conversion optimization.",
        avatar: avatarUrls[4],
        skills: await Promise.all(
          [
            "SEO",
            "Content Marketing",
            "Digital Marketing",
            "Project Management",
          ].map((title) => prisma.skill.create({ data: { title } }))
        ).then((skills) => skills.map((skill) => skill.title)),
      },
    ];

    // Create sellers
    for (let i = 0; i < 5; i++) {
      const profile = sellerProfiles[i];
      const seller = await prisma.user.create({
        data: {
          ...profile,
          skills: undefined,
          password: hashedPassword,
          emailVerified: new Date(),
          banner: imageUrls[i],
          isKycVerified: true,
          isProfileVerified: true,
          country: "United States",
          languages: ["English"],
        },
      });
      sellers.push(seller);
      users.push(seller);
    }

    // Create buyers
    for (let i = 0; i < 25; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const buyer = await prisma.user.create({
        data: {
          username: `buyer_${firstName.toLowerCase()}_${i}`,
          email: `buyer${i}@example.com`,
          password: hashedPassword,
          firstName,
          lastName,
          emailVerified: new Date(),
          avatar: faker.helpers.arrayElement(avatarUrls),
          isKycVerified: false,
          isProfileVerified: false,
          country: faker.helpers.arrayElement([
            "United States",
            "Canada",
            "United Kingdom",
            "Germany",
            "France",
          ]),
          languages: ["English"],
        },
      });
      buyers.push(buyer);
      users.push(buyer);
    }
    console.log(
      `✅ Seeded ${sellers.length} sellers and ${buyers.length} buyers`
    );

    // 7. Seed User Preferences
    console.log("⚙️ Seeding user preferences...");
    for (const user of users) {
      await prisma.userPreferences.create({
        data: {
          userId: user.id,
          timezone: "UTC",
          language: "en_US",
          ordersEnabled: true,
          ordersEmail: true,
          ordersInApp: true,
          messagesEnabled: true,
          messagesEmail: true,
          messagesInApp: true,
          reviewsEnabled: true,
          reviewsEmail: false,
          reviewsInApp: true,
        },
      });
    }

    // 8. Seed Wallets
    console.log("💰 Seeding wallets...");

    // Sellers get the provided wallets
    for (let i = 0; i < sellers.length; i++) {
      await prisma.wallet.create({
        data: {
          publicKey: SELLER_WALLETS[i],
          userId: sellers[i].id,
          isMain: true,
          name: "Main Wallet",
        },
      });
    }

    // Buyers get generated wallets
    for (const buyer of buyers) {
      await prisma.wallet.create({
        data: {
          publicKey: faker.string.alphanumeric(44),
          userId: buyer.id,
          isMain: true,
          name: "Main Wallet",
        },
      });
    }

    // 9. Seed User Skills
    console.log("🎯 Seeding user skills...");

    const createdSkills = await prisma.skill.findMany({});

    // Add skills to sellers based on their profiles
    for (let i = 0; i < sellers.length; i++) {
      const sellerSkills = sellerProfiles[i].skills;
      for (const skillTitle of sellerSkills) {
        const skill = createdSkills.find((s) => s.title === skillTitle);
        if (skill) {
          await prisma.userSkill.create({
            data: {
              userId: sellers[i].id,
              skillId: skill.id,
              level: faker.number.int({ min: 3, max: 5 }), // Sellers have higher skill levels
            },
          });
        }
      }
    }

    // 10. Seed Social Links for sellers
    console.log("🔗 Seeding social links...");
    for (const seller of sellers) {
      const username = seller.username;

      await prisma.socialLink.createMany({
        data: [
          {
            type: "GITHUB",
            url: `https://github.com/${username}`,
            userId: seller.id,
          },
          {
            type: "LINKEDIN",
            url: `https://linkedin.com/in/${username}`,
            userId: seller.id,
          },
          { type: "X", url: `https://x.com/${username}`, userId: seller.id },
        ],
      });
    }

    // 11. Seed Media Files
    console.log("📸 Seeding media files...");
    const mediaFiles: MediaFile[] = [];
    for (const url of imageUrls) {
      const mediaFile = await prisma.mediaFile.create({
        data: {
          url,
          type: "IMAGE",
        },
      });
      mediaFiles.push(mediaFile);
    }

    // 12. Seed Portfolio Items for sellers
    console.log("📂 Seeding portfolio items...");
    for (const seller of sellers) {
      const itemCount = faker.number.int({ min: 3, max: 6 });

      for (let i = 0; i < itemCount; i++) {
        await prisma.portfolioItem.create({
          data: {
            title: faker.helpers.fake(
              "{{commerce.productAdjective}} {{commerce.product}} Project"
            ),
            description: faker.commerce.productDescription(),
            url: faker.datatype.boolean() ? faker.internet.url() : null,
            userId: seller.id,
            isFeatured: i === 0,
            order: i,
            files: {
              connect: [{ id: faker.helpers.arrayElement(mediaFiles).id }],
            },
          },
        });
      }
    }

    const createdBadges = await prisma.badge.findMany({});

    // 13. Seed User Badge Progress - Each seller gets one badge
    console.log("🏅 Seeding user badge progress...");
    for (let i = 0; i < sellers.length; i++) {
      const badge = createdBadges[i % createdBadges.length];
      const milestones = await prisma.badgeMilestone.findMany({
        where: { badgeId: badge.id },
        orderBy: { threshold: "asc" },
      });

      const highestMilestone = milestones[milestones.length - 1];

      await prisma.userBadgeProgress.create({
        data: {
          userId: sellers[i].id,
          badgeId: badge.id,
          currentProgress: highestMilestone.threshold,
          highestTier: highestMilestone.tier,
          isFeatured: true,
        },
      });
    }

    // 14. Seed Gigs - Each seller has 3-5 gigs
    console.log("🛍️ Seeding gigs...");
    const gigs = [];

    const gigTemplates = {
      alex_webdev: [
        {
          title: "I Will Build a Modern React Website for Your Business",
          description:
            "Get a professional, responsive website built with React and Next.js. Perfect for startups and small businesses looking for a modern web presence.",
          category: "Web Development",
          tags: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
          features: [
            "Responsive Design",
            "SEO Optimization",
            "Fast Loading",
            "Modern UI",
            "Contact Form",
            "Analytics Integration",
          ],
          faqs: [
            {
              question: "Do you provide hosting?",
              answer:
                "I can help you deploy to Vercel, Netlify, or your preferred platform.",
            },
            {
              question: "Can you integrate a CMS?",
              answer:
                "Yes, I can integrate Contentful, Strapi, or any headless CMS.",
            },
          ],
        },
        {
          title: "I Will Create a Full Stack Web Application",
          description:
            "Need a complete web application? I'll build your frontend and backend with React, Node.js, and PostgreSQL.",
          category: "Web Development",
          tags: ["React", "Node.js", "PostgreSQL", "TypeScript"],
          features: [
            "User Authentication",
            "Database Design",
            "API Development",
            "Admin Dashboard",
            "Payment Integration",
          ],
          faqs: [
            {
              question: "What's included in the backend?",
              answer:
                "RESTful API with Node.js, Express, and PostgreSQL database.",
            },
            {
              question: "Do you write tests?",
              answer: "Yes, I include unit tests and integration tests.",
            },
          ],
        },
      ],
      sarah_blockchain: [
        {
          title: "I Will Develop Your Solana Smart Contract",
          description:
            "Professional Solana smart contract development using Rust and Anchor framework. Security-first approach with thorough testing.",
          category: "Blockchain & Crypto",
          tags: ["Solana", "Rust", "Smart Contracts", "Anchor", "Web3"],
          features: [
            "Smart Contract Development",
            "Security Audit",
            "Test Coverage",
            "Documentation",
            "Deployment Support",
          ],
          faqs: [
            {
              question: "Do you provide an audit?",
              answer:
                "Basic security review is included. Full audit available as an add-on.",
            },
            {
              question: "Can you help with frontend integration?",
              answer: "Yes, I can provide integration examples and support.",
            },
          ],
        },
        {
          title: "I Will Build Your NFT Minting Platform on Solana",
          description:
            "Complete NFT minting solution on Solana. Includes smart contract, minting website, and Candy Machine setup.",
          category: "Blockchain & Crypto",
          tags: ["Solana", "NFT", "Web3", "Smart Contracts"],
          features: [
            "NFT Contract",
            "Minting Website",
            "Candy Machine",
            "Metadata Setup",
            "Wallet Integration",
          ],
          faqs: [
            {
              question: "What wallets do you support?",
              answer: "Phantom, Solflare, and all major Solana wallets.",
            },
            {
              question: "Can you help with the art generation?",
              answer:
                "I focus on the technical side but can recommend artists.",
            },
          ],
        },
      ],
      maria_designer: [
        {
          title: "I Will Design Your Web Application UI/UX",
          description:
            "Professional UI/UX design for your web application. User-centered design approach with modern aesthetics.",
          category: "Design & UI/UX",
          tags: ["UI Design", "UX Design", "Figma", "Web Design"],
          features: [
            "User Research",
            "Wireframes",
            "High-Fidelity Mockups",
            "Interactive Prototype",
            "Design System",
            "Responsive Design",
          ],
          faqs: [
            {
              question: "What tools do you use?",
              answer: "Primarily Figma for design and prototyping.",
            },
            {
              question: "Do you provide the design files?",
              answer:
                "Yes, you'll receive the complete Figma file with full editing rights.",
            },
          ],
        },
        {
          title: "I Will Create Your Brand Identity",
          description:
            "Complete brand identity package including logo, color palette, typography, and brand guidelines.",
          category: "Design & UI/UX",
          tags: ["UI Design", "Figma", "Brand Design"],
          features: [
            "Logo Design",
            "Color Palette",
            "Typography Guide",
            "Brand Guidelines",
            "Business Card Design",
          ],
          faqs: [
            {
              question: "How many logo concepts do you provide?",
              answer:
                "3 initial concepts with unlimited revisions on the chosen one.",
            },
            {
              question: "What file formats are included?",
              answer: "PNG, SVG, PDF, and source files.",
            },
          ],
        },
      ],
      john_content: [
        {
          title: "I Will Write Technical Documentation for Your Project",
          description:
            "Clear, comprehensive technical documentation for your software project. Developer-friendly and user-focused.",
          category: "Content Writing",
          tags: ["Technical Writing", "Documentation", "Content Marketing"],
          features: [
            "API Documentation",
            "User Guides",
            "README Files",
            "Code Comments",
            "Architecture Docs",
          ],
          faqs: [
            {
              question: "What formats do you deliver?",
              answer: "Markdown, HTML, or your preferred documentation format.",
            },
            {
              question: "Do you include diagrams?",
              answer:
                "Yes, I create flowcharts and architecture diagrams as needed.",
            },
          ],
        },
        {
          title: "I Will Write SEO-Optimized Blog Posts",
          description:
            "Engaging, well-researched blog posts optimized for search engines. Perfect for tech companies and startups.",
          category: "Content Writing",
          tags: ["Content Marketing", "SEO", "Technical Writing"],
          features: [
            "Keyword Research",
            "SEO Optimization",
            "Engaging Content",
            "Meta Descriptions",
            "Internal Linking",
          ],
          faqs: [
            {
              question: "How long are the articles?",
              answer:
                "Typically 1000-2000 words, but can be adjusted to your needs.",
            },
            {
              question: "Do you include images?",
              answer:
                "I can source royalty-free images or work with your provided images.",
            },
          ],
        },
      ],
      emma_marketing: [
        {
          title: "I Will Create Your Digital Marketing Strategy",
          description:
            "Comprehensive digital marketing strategy tailored to your business goals. Data-driven approach with actionable insights.",
          category: "Digital Marketing",
          tags: ["Digital Marketing", "SEO", "Content Marketing"],
          features: [
            "Market Analysis",
            "Competitor Research",
            "Channel Strategy",
            "Content Calendar",
            "KPI Framework",
          ],
          faqs: [
            {
              question: "What channels do you cover?",
              answer:
                "SEO, content marketing, social media, email, and paid advertising.",
            },
            {
              question: "Do you implement the strategy?",
              answer:
                "This gig covers strategy. Implementation available separately.",
            },
          ],
        },
        {
          title: "I Will Optimize Your Website for SEO",
          description:
            "Complete SEO audit and optimization to improve your search rankings. Technical and content optimization included.",
          category: "Digital Marketing",
          tags: ["SEO", "Digital Marketing", "Content Marketing"],
          features: [
            "SEO Audit",
            "Keyword Research",
            "On-Page Optimization",
            "Technical SEO",
            "Content Strategy",
          ],
          faqs: [
            {
              question: "How long does it take to see results?",
              answer:
                "SEO typically takes 3-6 months, but you'll see improvements starting month 1.",
            },
            {
              question: "Do you work with all platforms?",
              answer:
                "Yes, I work with WordPress, custom sites, and all major platforms.",
            },
          ],
        },
      ],
    };

    const createdCategories = await prisma.category.findMany({});

    const createdTags = await prisma.tag.findMany({});

    for (const seller of sellers) {
      const templates =
        gigTemplates[seller.username as keyof typeof gigTemplates] || [];

      for (const template of templates) {
        const category = createdCategories.find(
          (c) => c.title === template.category
        )!;
        const gigTags = createdTags.filter((tag) =>
          template.tags.includes(tag.title)
        );

        const gig = await prisma.gig.create({
          data: {
            title: template.title,
            description: template.description,
            sellerId: seller.id,
            categoryId: category.id,
            tags: { connect: gigTags.map((tag) => ({ id: tag.id })) },
            features: { create: template.features.map((title) => ({ title })) },
            faqs: { create: template.faqs },
            media: {
              connect: { id: faker.helpers.arrayElement(mediaFiles).id },
            },
            packages: {
              create: [
                {
                  title: "Basic",
                  price: 0.1,
                  revisions: 1,
                  deliveryTime: 3,
                },
                {
                  title: "Standard",
                  price: 0.3,
                  revisions: 3,
                  deliveryTime: 5,
                },
                {
                  title: "Premium",
                  price: 0.8,
                  revisions: 5,
                  deliveryTime: 7,
                },
              ],
            },
          },
          include: {
            features: true,
            packages: true,
          },
        });

        // Create package features
        for (const pkg of gig.packages) {
          const packageIndex = gig.packages.findIndex((p) => p.id === pkg.id);

          for (let i = 0; i < gig.features.length; i++) {
            const feature = gig.features[i];
            // Basic: first 2 features, Standard: first 4, Premium: all
            const isIncluded =
              packageIndex === 0 ? i < 2 : packageIndex === 1 ? i < 4 : true;

            await prisma.packageFeature.create({
              data: {
                gigPackageId: pkg.id,
                featureId: feature.id,
                isIncluded,
              },
            });
          }
        }

        gigs.push(gig);
      }
    }
    console.log(`✅ Seeded ${gigs.length} gigs`);

    // 15. Seed Orders - Many orders from buyers
    console.log("📦 Seeding orders...");
    const orders = [];
    const orderStatuses: OrderStatus[] = [
      "COMPLETED",
      "COMPLETED",
      "COMPLETED",
      "DELIVERED",
      "PAID",
    ];

    // Each buyer makes 2-5 orders
    for (const buyer of buyers) {
      const orderCount = faker.number.int({ min: 2, max: 5 });

      for (let i = 0; i < orderCount; i++) {
        const gig = faker.helpers.arrayElement(gigs);
        const seller = sellers.find((s) => s.id === gig.sellerId)!;
        const pkg = faker.helpers.arrayElement(gig.packages);
        const status = faker.helpers.arrayElement(orderStatuses);

        const createdAt = faker.date.past({ years: 0.5 });
        const deadline = new Date(createdAt);
        deadline.setDate(deadline.getDate() + pkg.deliveryTime);

        let completedAt = null;
        if (status === "COMPLETED") {
          completedAt = faker.date.between({ from: createdAt, to: deadline });
        }

        const order = await prisma.order.create({
          data: {
            deadline,
            status,
            paymentMethod: "SOLANA",
            packageId: pkg.id,
            buyerId: buyer.id,
            sellerId: seller.id,
            gigId: gig.id,
            createdAt,
            completedAt,
            chat: {
              create: {
                buyerId: buyer.id,
                sellerId: seller.id,
              },
            },
          },
          include: {
            chat: true,
            package: true,
          },
        });

        // Add transaction for non-pending orders
        if (status !== "PENDING_PAYMENT") {
          const buyerWallet = await prisma.wallet.findFirst({
            where: { userId: buyer.id, isMain: true },
          });
          const sellerWallet = await prisma.wallet.findFirst({
            where: { userId: seller.id, isMain: true },
          });

          if (buyerWallet && sellerWallet) {
            await prisma.transaction.create({
              data: {
                txId: generateSolanaTxId(),
                amount: pkg.price,
                senderPublicKey: buyerWallet.publicKey,
                receiverPublicKey: sellerWallet.publicKey,
                orderId: order.id,
                createdAt: faker.date.between({
                  from: createdAt,
                  to: new Date(),
                }),
              },
            });
          }
        }

        orders.push(order);
      }
    }
    console.log(`✅ Seeded ${orders.length} orders`);

    // 16. Seed Chat Messages
    console.log("💬 Seeding chat messages...");
    let messageCount = 0;

    const messageTemplates = [
      "Hi! I'm interested in your gig. Can you help me with my project?",
      "Sure! I'd be happy to help. Could you tell me more about what you need?",
      "Thanks for the quick response! I need [specific requirement]",
      "That sounds great. I can definitely help with that.",
      "When can you start working on this?",
      "I can start immediately after the order is placed.",
      "Perfect! Placing the order now.",
      "Thank you! I'll get started right away.",
      "Quick update: I've completed the first draft.",
      "Wow, that was fast! Let me review it.",
      "This looks amazing! Exactly what I was looking for.",
      "Glad you like it! Let me know if you need any revisions.",
      "Everything looks perfect. Great work!",
      "Thank you for the great review! It was a pleasure working with you.",
    ];

    for (const order of orders) {
      if (!order.chat) continue;

      const msgCount = faker.number.int({ min: 3, max: 10 });
      let currentTime = new Date(order.createdAt);

      for (let i = 0; i < msgCount; i++) {
        const isFromBuyer = i % 2 === 0;
        const senderId = isFromBuyer ? order.buyerId : order.sellerId;

        currentTime = faker.date.between({
          from: currentTime,
          to: new Date(currentTime.getTime() + 3600000), // 1 hour later
        });

        await prisma.message.create({
          data: {
            type: "TEXT",
            chatId: order.chat.id,
            status: "READ",
            createdAt: currentTime,
            textContent: {
              create: {
                userMessage: {
                  create: {
                    userId: senderId,
                  },
                },
                text: faker.helpers.arrayElement(messageTemplates),
              },
            },
            readBy: {
              connect: [{ id: order.buyerId }, { id: order.sellerId }],
            },
          },
        });

        messageCount++;
      }
    }
    console.log(`✅ Seeded ${messageCount} chat messages`);

    // 17. Seed Reviews - Most completed orders get reviews
    console.log("⭐ Seeding reviews...");
    let reviewCount = 0;
    const completedOrders = orders.filter(
      (o) =>
        o.status === "COMPLETED" && o.completedAt && o.completedAt < new Date()
    );

    const reviewTemplates = {
      5: [
        {
          title: "Excellent work!",
          description:
            "Delivered exactly what I needed. Fast communication and professional service. Highly recommended!",
        },
        {
          title: "Outstanding service",
          description:
            "Went above and beyond my expectations. Will definitely work with them again.",
        },
        {
          title: "Perfect!",
          description:
            "Amazing quality and super fast delivery. Couldn't ask for better service.",
        },
        {
          title: "Highly professional",
          description:
            "Great communication throughout the project. Delivered on time with excellent quality.",
        },
      ],
      4: [
        {
          title: "Very good",
          description:
            "Good work overall. Minor revisions needed but seller was responsive and fixed everything quickly.",
        },
        {
          title: "Great service",
          description:
            "Delivered as promised. Good communication and quality work.",
        },
      ],
      3: [
        {
          title: "Decent work",
          description:
            "Got the job done but took longer than expected. Final result was acceptable.",
        },
      ],
    };

    for (const order of completedOrders) {
      if (faker.datatype.boolean({ probability: 0.9 })) {
        // 90% of completed orders get reviews
        const rating = faker.helpers.weightedArrayElement([
          { value: 5, weight: 70 },
          { value: 4, weight: 25 },
          { value: 3, weight: 5 },
        ]);

        const templates =
          reviewTemplates[rating as keyof typeof reviewTemplates];
        const template = faker.helpers.arrayElement(templates);

        const review = await prisma.review.create({
          data: {
            rating,
            title: template.title,
            description: template.description,
            orderId: order.id,
            authorId: order.buyerId,
            gigId: order.gigId!,
            createdAt: faker.date.between({
              from: order.completedAt!,
              to: new Date(),
            }),
          },
        });

        // Seller responds to some reviews
        if (faker.datatype.boolean({ probability: 0.6 })) {
          const responses = [
            "Thank you so much for your kind words! It was a pleasure working with you.",
            "I really appreciate your feedback! Looking forward to working with you again.",
            "Thanks for the great review! Feel free to reach out for future projects.",
            "Thank you! Your project was interesting to work on. Best of luck with your business!",
          ];

          await prisma.review.update({
            where: { id: review.id },
            data: {
              sellerResponse: faker.helpers.arrayElement(responses),
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
    console.log(`✅ Seeded ${reviewCount} reviews`);

    // 18. Seed Notifications
    console.log("🔔 Seeding notifications...");
    let notificationCount = 0;

    // Order notifications for sellers
    for (const order of orders.slice(-50)) {
      // Last 50 orders
      if (order.status !== "PENDING_PAYMENT") {
        const metadata: NotificationMetadata = {
          type: "ORDER_UPDATE",
          orderId: order.id,
          status: order.status,
          message: `New order received from ${buyers.find((b) => b.id === order.buyerId)?.firstName}`,
        };

        await prisma.notification.create({
          data: {
            recipientId: order.sellerId,
            type: "ORDER_UPDATE",
            title: "New Order",
            isRead: faker.datatype.boolean({ probability: 0.7 }),
            metadata: metadata as Prisma.JsonObject,
            createdAt: order.createdAt,
          },
        });
        notificationCount++;
      }
    }

    // Review notifications
    const recentReviews = await prisma.review.findMany({
      include: { order: true },
      take: 30,
      orderBy: { createdAt: "desc" },
    });

    for (const review of recentReviews) {
      const metadata: NotificationMetadata = {
        type: "REVIEW",
        reviewId: review.id,
        gigId: review.gigId,
        rating: review.rating,
        transactionId: "review-" + review.id,
        message: `You received a ${review.rating}-star review`,
      };

      await prisma.notification.create({
        data: {
          recipientId: review.order.sellerId,
          type: "REVIEW",
          title: `New ${review.rating}-Star Review`,
          isRead: faker.datatype.boolean({ probability: 0.5 }),
          metadata: metadata as Prisma.JsonObject,
          createdAt: review.createdAt,
        },
      });
      notificationCount++;
    }

    console.log(`✅ Seeded ${notificationCount} notifications`);

    // Final Summary
    console.log("\n🎉 Database seeding completed successfully!");
    console.log("📊 Summary:");
    console.log(`   - Sellers: ${sellers.length}`);
    console.log(`   - Buyers: ${buyers.length}`);
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Tags: ${createdTags.length}`);
    console.log(`   - Skills: ${createdSkills.length}`);
    console.log(`   - Badges: ${createdBadges.length}`);
    console.log(`   - Gigs: ${gigs.length}`);
    console.log(`   - Orders: ${orders.length}`);
    console.log(`   - Reviews: ${reviewCount}`);
    console.log(`   - Messages: ${messageCount}`);
    console.log(`   - Notifications: ${notificationCount}`);
    console.log("\n🔑 All users have password: test");
    console.log("\n👨‍💼 Seller Accounts:");
    sellers.forEach((seller, index) => {
      console.log(
        `   ${index + 1}. ${seller.username} (${seller.email}) - Wallet: ${SELLER_WALLETS[index]}`
      );
    });
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
