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

    // 14. Seed Gigs - Each seller has 9 gigs (45 total)
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
        {
          title: "I Will Develop a Custom E-commerce Platform",
          description:
            "Complete e-commerce solution with React frontend, Node.js backend, payment processing, and inventory management.",
          category: "Web Development",
          tags: ["React", "Node.js", "TypeScript", "PostgreSQL"],
          features: [
            "Product Catalog",
            "Shopping Cart",
            "Payment Gateway",
            "Order Management",
            "Inventory Tracking",
            "Admin Panel",
          ],
          faqs: [
            {
              question: "Which payment gateways do you support?",
              answer: "Stripe, PayPal, and custom payment solutions.",
            },
            {
              question: "Can you integrate with existing systems?",
              answer:
                "Yes, I can integrate with most third-party APIs and systems.",
            },
          ],
        },
        {
          title: "I Will Build a Progressive Web App (PWA)",
          description:
            "Modern PWA with offline capabilities, push notifications, and native app-like experience using React and service workers.",
          category: "Web Development",
          tags: ["React", "PWA", "TypeScript", "Service Workers"],
          features: [
            "Offline Functionality",
            "Push Notifications",
            "App-like Experience",
            "Fast Performance",
            "Cross-platform",
            "Auto Updates",
          ],
          faqs: [
            {
              question: "Will it work on all devices?",
              answer: "Yes, PWAs work on desktop, mobile, and tablet devices.",
            },
            {
              question: "Can users install it like a native app?",
              answer: "Yes, users can install it from their browser.",
            },
          ],
        },
        {
          title: "I Will Create a React Dashboard with Data Visualization",
          description:
            "Professional dashboard with charts, graphs, and real-time data visualization using React, D3.js, and modern UI libraries.",
          category: "Web Development",
          tags: ["React", "D3.js", "TypeScript", "Dashboard"],
          features: [
            "Interactive Charts",
            "Real-time Updates",
            "Custom Components",
            "Responsive Layout",
            "Data Export",
            "Theme Support",
          ],
          faqs: [
            {
              question: "What chart types can you create?",
              answer:
                "Bar, line, pie, scatter, heatmaps, and custom visualizations.",
            },
            {
              question: "Can you integrate with APIs?",
              answer:
                "Yes, I can connect to REST APIs, GraphQL, or any data source.",
            },
          ],
        },
        {
          title: "I Will Build a Multi-tenant SaaS Application",
          description:
            "Scalable multi-tenant SaaS platform with user management, billing integration, and tenant isolation using React and Node.js.",
          category: "Web Development",
          tags: ["React", "Node.js", "SaaS", "Multi-tenant"],
          features: [
            "Tenant Isolation",
            "User Management",
            "Subscription Billing",
            "Role-based Access",
            "API Rate Limiting",
            "Usage Analytics",
          ],
          faqs: [
            {
              question: "How do you handle tenant data separation?",
              answer:
                "I implement row-level security and database schema isolation.",
            },
            {
              question: "What billing systems do you integrate?",
              answer: "Stripe, Paddle, or custom billing solutions.",
            },
          ],
        },
        {
          title: "I Will Develop a Real-time Chat Application",
          description:
            "Feature-rich chat application with real-time messaging, file sharing, and video calls using React, Socket.io, and WebRTC.",
          category: "Web Development",
          tags: ["React", "Socket.io", "WebRTC", "Real-time"],
          features: [
            "Real-time Messaging",
            "File Sharing",
            "Video/Audio Calls",
            "Group Chats",
            "Message History",
            "Push Notifications",
          ],
          faqs: [
            {
              question: "Does it support mobile devices?",
              answer: "Yes, fully responsive design that works on all devices.",
            },
            {
              question: "Can you add custom features?",
              answer: "Absolutely, I can customize based on your requirements.",
            },
          ],
        },
        {
          title: "I Will Create a Headless CMS with React Admin Panel",
          description:
            "Custom headless CMS with React-based admin panel, content management, and API endpoints for your applications.",
          category: "Web Development",
          tags: ["React", "Headless CMS", "API", "Content Management"],
          features: [
            "Content Management",
            "RESTful API",
            "Admin Dashboard",
            "Media Library",
            "User Roles",
            "Version Control",
          ],
          faqs: [
            {
              question: "What content types can it manage?",
              answer: "Articles, pages, media files, and custom content types.",
            },
            {
              question: "Is it SEO-friendly?",
              answer: "Yes, includes SEO fields and meta tag management.",
            },
          ],
        },
        {
          title: "I Will Build a React Native Mobile App",
          description:
            "Cross-platform mobile application using React Native with native performance and platform-specific optimizations.",
          category: "Web Development",
          tags: ["React Native", "Mobile", "iOS", "Android"],
          features: [
            "Cross-platform",
            "Native Performance",
            "Push Notifications",
            "Offline Support",
            "App Store Ready",
            "Custom UI Components",
          ],
          faqs: [
            {
              question: "Will it work on both iOS and Android?",
              answer:
                "Yes, single codebase for both platforms with native optimizations.",
            },
            {
              question: "Can you help with app store submission?",
              answer: "Yes, I can guide you through the submission process.",
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
        {
          title: "I Will Create a DeFi Protocol on Solana",
          description:
            "Build decentralized finance protocols with lending, staking, and yield farming capabilities on Solana blockchain.",
          category: "Blockchain & Crypto",
          tags: ["Solana", "DeFi", "Rust", "Smart Contracts", "Web3"],
          features: [
            "Lending Protocol",
            "Staking Mechanism",
            "Yield Farming",
            "Governance Token",
            "Security Auditing",
            "Frontend Integration",
          ],
          faqs: [
            {
              question: "What DeFi features can you implement?",
              answer: "Lending, borrowing, staking, AMM, governance, and more.",
            },
            {
              question: "Do you handle tokenomics design?",
              answer: "Yes, I can help design sustainable tokenomics models.",
            },
          ],
        },
        {
          title: "I Will Build a Solana Token Launch Platform",
          description:
            "Complete token launch platform with fair launch mechanics, liquidity pools, and anti-bot protection on Solana.",
          category: "Blockchain & Crypto",
          tags: ["Solana", "Token Launch", "Web3", "Smart Contracts"],
          features: [
            "Token Creation",
            "Fair Launch Mechanics",
            "Liquidity Pool Setup",
            "Anti-bot Protection",
            "Vesting Schedules",
            "Launch Dashboard",
          ],
          faqs: [
            {
              question: "What anti-bot measures do you implement?",
              answer:
                "Whitelist, transaction limits, and custom protection logic.",
            },
            {
              question: "Can you help with market making?",
              answer: "I can set up initial liquidity and provide guidance.",
            },
          ],
        },
        {
          title: "I Will Create a Solana Governance DAO Platform",
          description:
            "Build a complete DAO governance platform with proposal creation, voting mechanisms, and treasury management on Solana.",
          category: "Blockchain & Crypto",
          tags: ["Solana", "DAO", "Governance", "Web3"],
          features: [
            "Proposal System",
            "Voting Mechanisms",
            "Treasury Management",
            "Token Gating",
            "Multi-signature Support",
            "Analytics Dashboard",
          ],
          faqs: [
            {
              question: "What voting mechanisms do you support?",
              answer:
                "Token-weighted voting, quadratic voting, and custom mechanisms.",
            },
            {
              question: "Can you integrate with existing tokens?",
              answer: "Yes, I can work with any SPL token for governance.",
            },
          ],
        },
        {
          title: "I Will Build a Solana DEX and AMM Protocol",
          description:
            "Decentralized exchange with automated market maker functionality, liquidity pools, and yield farming on Solana.",
          category: "Blockchain & Crypto",
          tags: ["Solana", "DEX", "AMM", "DeFi"],
          features: [
            "Token Swapping",
            "Liquidity Pools",
            "Yield Farming",
            "Price Oracles",
            "Fee Distribution",
            "Trading Interface",
          ],
          faqs: [
            {
              question: "What trading pairs can be supported?",
              answer: "Any SPL token pairs with customizable fee structures.",
            },
            {
              question: "How do you handle slippage protection?",
              answer:
                "Built-in slippage protection with user-configurable limits.",
            },
          ],
        },
        {
          title: "I Will Develop a Solana Gaming NFT Platform",
          description:
            "Gaming-focused NFT platform with in-game asset trading, crafting mechanics, and play-to-earn tokenomics on Solana.",
          category: "Blockchain & Crypto",
          tags: ["Solana", "Gaming", "NFT", "Play-to-Earn"],
          features: [
            "Gaming NFTs",
            "Asset Trading",
            "Crafting System",
            "Play-to-Earn",
            "Leaderboards",
            "Tournament System",
          ],
          faqs: [
            {
              question: "Can you integrate with existing games?",
              answer:
                "Yes, I can create SDKs for Unity, Unreal, and web games.",
            },
            {
              question: "What gaming mechanics do you support?",
              answer:
                "Crafting, breeding, upgrading, and custom game mechanics.",
            },
          ],
        },
        {
          title: "I Will Create a Solana Prediction Market Platform",
          description:
            "Decentralized prediction market with binary outcomes, liquidity pools, and automated settlement on Solana blockchain.",
          category: "Blockchain & Crypto",
          tags: ["Solana", "Prediction Market", "DeFi", "Oracle"],
          features: [
            "Market Creation",
            "Binary Outcomes",
            "Liquidity Pools",
            "Oracle Integration",
            "Automated Settlement",
            "Market Analytics",
          ],
          faqs: [
            {
              question: "What oracles do you integrate with?",
              answer: "Chainlink, Pyth, and custom oracle solutions.",
            },
            {
              question: "How do you handle dispute resolution?",
              answer: "Multi-tiered dispute system with community governance.",
            },
          ],
        },
        {
          title: "I Will Build a Solana Social Token Platform",
          description:
            "Creator economy platform with social tokens, fan engagement features, and monetization tools on Solana.",
          category: "Blockchain & Crypto",
          tags: ["Solana", "Social Token", "Creator Economy", "Web3"],
          features: [
            "Social Token Creation",
            "Fan Engagement",
            "Content Monetization",
            "Subscription Models",
            "Community Features",
            "Analytics Dashboard",
          ],
          faqs: [
            {
              question: "What engagement features are included?",
              answer:
                "Token-gated content, polls, exclusive access, and rewards.",
            },
            {
              question: "Can creators cash out their tokens?",
              answer:
                "Yes, with built-in liquidity pools and exchange integration.",
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
        {
          title: "I Will Design Your Mobile App Interface",
          description:
            "Beautiful, intuitive mobile app design for iOS and Android. Focus on user experience and modern design trends.",
          category: "Design & UI/UX",
          tags: ["UI Design", "UX Design", "Mobile Design", "Figma"],
          features: [
            "iOS & Android Design",
            "User Flow Mapping",
            "Interactive Prototypes",
            "Design System",
            "Icon Design",
            "App Store Assets",
          ],
          faqs: [
            {
              question: "Do you design for both iOS and Android?",
              answer:
                "Yes, I create platform-specific designs following guidelines.",
            },
            {
              question: "Can you create animated prototypes?",
              answer: "Yes, I create interactive prototypes with animations.",
            },
          ],
        },
        {
          title: "I Will Create Your Landing Page Design",
          description:
            "High-converting landing page design optimized for conversions. Modern, clean design that drives results.",
          category: "Design & UI/UX",
          tags: ["UI Design", "Landing Page", "Conversion", "Figma"],
          features: [
            "Conversion Optimization",
            "A/B Test Variants",
            "Mobile Responsive",
            "CTA Optimization",
            "Visual Hierarchy",
            "Performance Focused",
          ],
          faqs: [
            {
              question: "Do you provide multiple versions for A/B testing?",
              answer: "Yes, I can create 2-3 variants for testing.",
            },
            {
              question: "Can you help with copywriting?",
              answer: "I focus on design but can recommend copywriters.",
            },
          ],
        },
        {
          title: "I Will Design Your E-commerce Store Interface",
          description:
            "Complete e-commerce design with product pages, checkout flow, and admin dashboard. Optimized for sales and user experience.",
          category: "Design & UI/UX",
          tags: ["UI Design", "UX Design", "E-commerce", "Figma"],
          features: [
            "Product Catalog Design",
            "Checkout Flow",
            "Shopping Cart UI",
            "Admin Dashboard",
            "Payment Integration",
            "Mobile Commerce",
          ],
          faqs: [
            {
              question: "Do you design the admin interface too?",
              answer:
                "Yes, complete admin dashboard for managing products and orders.",
            },
            {
              question: "Can you optimize for mobile shopping?",
              answer:
                "Absolutely, mobile-first approach for optimal conversions.",
            },
          ],
        },
        {
          title: "I Will Create Your SaaS Dashboard Design",
          description:
            "Professional SaaS dashboard with data visualization, user management, and analytics. Clean, modern interface design.",
          category: "Design & UI/UX",
          tags: ["UI Design", "Dashboard", "SaaS", "Data Visualization"],
          features: [
            "Dashboard Layout",
            "Data Visualization",
            "User Management UI",
            "Settings Panels",
            "Responsive Tables",
            "Interactive Charts",
          ],
          faqs: [
            {
              question: "What chart types can you design?",
              answer:
                "Line charts, bar charts, pie charts, and custom visualizations.",
            },
            {
              question: "Do you handle complex data layouts?",
              answer:
                "Yes, I specialize in making complex data easy to understand.",
            },
          ],
        },
        {
          title: "I Will Design Your Portfolio Website",
          description:
            "Stunning portfolio website design that showcases your work beautifully. Perfect for designers, developers, and creatives.",
          category: "Design & UI/UX",
          tags: ["UI Design", "Portfolio", "Web Design", "Creative"],
          features: [
            "Portfolio Showcase",
            "Project Gallery",
            "About Page Design",
            "Contact Forms",
            "Blog Layout",
            "Resume Section",
          ],
          faqs: [
            {
              question: "Can you create animated galleries?",
              answer: "Yes, I design smooth animations and hover effects.",
            },
            {
              question: "Do you include blog design?",
              answer: "Yes, complete blog layout with post templates.",
            },
          ],
        },
        {
          title: "I Will Create Your Startup Pitch Deck Design",
          description:
            "Professional pitch deck design for startups and investors. Compelling visual storytelling that gets results.",
          category: "Design & UI/UX",
          tags: ["Pitch Deck", "Presentation", "Startup", "Visual Design"],
          features: [
            "Slide Templates",
            "Data Visualization",
            "Icon Design",
            "Chart Creation",
            "Brand Consistency",
            "Print-Ready Files",
          ],
          faqs: [
            {
              question: "How many slides do you typically design?",
              answer:
                "15-20 slides covering all essential pitch deck sections.",
            },
            {
              question: "Can you animate the presentation?",
              answer:
                "Yes, I can create animated versions for digital presentations.",
            },
          ],
        },
        {
          title: "I Will Design Your Social Media Brand Kit",
          description:
            "Complete social media design package with templates, posts, stories, and brand assets for all major platforms.",
          category: "Design & UI/UX",
          tags: ["Social Media", "Brand Design", "Templates", "Marketing"],
          features: [
            "Post Templates",
            "Story Templates",
            "Profile Design",
            "Highlight Covers",
            "Brand Guidelines",
            "Multi-Platform",
          ],
          faqs: [
            {
              question: "Which platforms do you design for?",
              answer: "Instagram, Facebook, Twitter, LinkedIn, and TikTok.",
            },
            {
              question: "Do you provide editable templates?",
              answer:
                "Yes, fully editable templates in Figma and Canva formats.",
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
        {
          title: "I Will Create Your Product Release Notes",
          description:
            "Professional release notes and changelog documentation that keeps your users informed about new features and updates.",
          category: "Content Writing",
          tags: ["Technical Writing", "Documentation", "Product"],
          features: [
            "Feature Descriptions",
            "Bug Fix Documentation",
            "User Impact Analysis",
            "Version Management",
            "Change Classification",
            "User-friendly Language",
          ],
          faqs: [
            {
              question: "Do you work with development teams?",
              answer:
                "Yes, I collaborate with devs to understand technical changes.",
            },
            {
              question: "Can you maintain ongoing release notes?",
              answer: "Yes, I offer ongoing maintenance packages.",
            },
          ],
        },
        {
          title: "I Will Write Your Whitepaper or Technical Report",
          description:
            "Professional whitepaper writing for blockchain projects, tech startups, and research papers. Research-backed and authoritative.",
          category: "Content Writing",
          tags: ["Technical Writing", "Research", "Whitepaper"],
          features: [
            "Market Research",
            "Technical Analysis",
            "Competitive Analysis",
            "Visual Elements",
            "Executive Summary",
            "Citations & References",
          ],
          faqs: [
            {
              question: "How long are typical whitepapers?",
              answer: "Usually 15-30 pages depending on project complexity.",
            },
            {
              question: "Do you handle the design layout?",
              answer: "I focus on content but can recommend designers.",
            },
          ],
        },
        {
          title: "I Will Create Your Software User Manual",
          description:
            "Comprehensive user manual for your software product. Step-by-step guides with screenshots and troubleshooting sections.",
          category: "Content Writing",
          tags: ["Technical Writing", "User Manual", "Documentation"],
          features: [
            "Step-by-step Guides",
            "Screenshot Integration",
            "Troubleshooting Section",
            "FAQ Section",
            "Video Tutorials",
            "Multi-format Delivery",
          ],
          faqs: [
            {
              question: "Do you create video tutorials too?",
              answer:
                "I focus on written content but can collaborate with video creators.",
            },
            {
              question: "Can you update existing manuals?",
              answer: "Yes, I can revise and update existing documentation.",
            },
          ],
        },
        {
          title: "I Will Write Your Startup's Content Strategy",
          description:
            "Complete content strategy with editorial calendar, topic research, and content pillars for your startup's marketing efforts.",
          category: "Content Writing",
          tags: ["Content Marketing", "Strategy", "Startup"],
          features: [
            "Content Audit",
            "Editorial Calendar",
            "Topic Research",
            "Content Pillars",
            "Distribution Strategy",
            "Performance Metrics",
          ],
          faqs: [
            {
              question: "How far in advance do you plan content?",
              answer:
                "Typically 3-6 months with quarterly reviews and updates.",
            },
            {
              question: "Do you write the actual content too?",
              answer:
                "This covers strategy. Content creation is available separately.",
            },
          ],
        },
        {
          title: "I Will Create Your Email Newsletter Content",
          description:
            "Engaging email newsletter content that builds relationships with your audience. Industry insights and valuable information.",
          category: "Content Writing",
          tags: ["Email Marketing", "Newsletter", "Content Marketing"],
          features: [
            "Newsletter Templates",
            "Content Curation",
            "Subject Lines",
            "Call-to-Actions",
            "Personalization",
            "A/B Testing Copy",
          ],
          faqs: [
            {
              question: "How often do you recommend sending newsletters?",
              answer:
                "Weekly or bi-weekly depending on your audience and content volume.",
            },
            {
              question: "Do you help with email automation?",
              answer: "Yes, I can create welcome series and drip campaigns.",
            },
          ],
        },
        {
          title: "I Will Write Your Case Studies and Success Stories",
          description:
            "Compelling case studies that showcase your successes and build credibility with potential clients. Data-driven storytelling.",
          category: "Content Writing",
          tags: ["Case Studies", "Storytelling", "Marketing"],
          features: [
            "Client Interviews",
            "Data Analysis",
            "Success Metrics",
            "Before/After Scenarios",
            "Visual Storytelling",
            "ROI Calculations",
          ],
          faqs: [
            {
              question: "Do you interview clients directly?",
              answer: "Yes, I conduct interviews to gather authentic insights.",
            },
            {
              question: "How do you handle confidential information?",
              answer: "I work with NDAs and can anonymize sensitive details.",
            },
          ],
        },
        {
          title: "I Will Create Your Grant Proposal Content",
          description:
            "Professional grant proposal writing for non-profits, startups, and research projects. Persuasive content that wins funding.",
          category: "Content Writing",
          tags: ["Grant Writing", "Proposals", "Fundraising"],
          features: [
            "Needs Assessment",
            "Project Description",
            "Budget Justification",
            "Impact Statements",
            "Evaluation Plans",
            "Compliance Review",
          ],
          faqs: [
            {
              question: "What types of grants do you write for?",
              answer:
                "Research grants, non-profit funding, startup competitions, and more.",
            },
            {
              question: "Do you help with budget planning?",
              answer: "I can help structure and justify budgets in proposals.",
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
        {
          title: "I Will Set Up Your Social Media Marketing Campaign",
          description:
            "Complete social media marketing setup with content strategy, posting schedule, and engagement tactics across platforms.",
          category: "Digital Marketing",
          tags: ["Digital Marketing", "Social Media", "Content Marketing"],
          features: [
            "Platform Setup",
            "Content Strategy",
            "Posting Schedule",
            "Hashtag Research",
            "Engagement Strategy",
            "Analytics Setup",
          ],
          faqs: [
            {
              question: "Which platforms do you cover?",
              answer: "Instagram, Twitter, LinkedIn, Facebook, and TikTok.",
            },
            {
              question: "Do you create the content?",
              answer:
                "I create the strategy and templates. Content creation available separately.",
            },
          ],
        },
        {
          title: "I Will Create Your Email Marketing Campaign",
          description:
            "Professional email marketing campaigns with automation, segmentation, and conversion optimization for maximum ROI.",
          category: "Digital Marketing",
          tags: ["Digital Marketing", "Email Marketing", "Automation"],
          features: [
            "Email Automation",
            "List Segmentation",
            "Template Design",
            "A/B Testing",
            "Performance Tracking",
            "Conversion Optimization",
          ],
          faqs: [
            {
              question: "Which email platforms do you work with?",
              answer:
                "Mailchimp, ConvertKit, Klaviyo, and most major platforms.",
            },
            {
              question: "Do you write the email copy?",
              answer: "Yes, I provide complete email sequences and copy.",
            },
          ],
        },
        {
          title: "I Will Create Your Google Ads Campaign",
          description:
            "Professional Google Ads setup and optimization for maximum ROI. Search, display, and shopping campaigns included.",
          category: "Digital Marketing",
          tags: ["Google Ads", "PPC", "Digital Marketing"],
          features: [
            "Campaign Setup",
            "Keyword Research",
            "Ad Copy Creation",
            "Landing Page Optimization",
            "Bid Management",
            "Performance Tracking",
          ],
          faqs: [
            {
              question: "What's your typical ROI improvement?",
              answer:
                "Most clients see 200-400% improvement in ROI within 3 months.",
            },
            {
              question: "Do you manage ongoing campaigns?",
              answer:
                "Yes, I offer ongoing management and optimization services.",
            },
          ],
        },
        {
          title: "I Will Develop Your Influencer Marketing Strategy",
          description:
            "Complete influencer marketing strategy with influencer identification, outreach templates, and campaign management.",
          category: "Digital Marketing",
          tags: ["Influencer Marketing", "Social Media", "Strategy"],
          features: [
            "Influencer Research",
            "Outreach Templates",
            "Campaign Strategy",
            "Contract Templates",
            "Performance Metrics",
            "ROI Tracking",
          ],
          faqs: [
            {
              question: "How do you find the right influencers?",
              answer:
                "I use advanced tools and manual research to find authentic influencers in your niche.",
            },
            {
              question: "Do you handle negotiations?",
              answer:
                "I provide templates and guidance, but direct negotiations are handled by you.",
            },
          ],
        },
        {
          title: "I Will Create Your Content Marketing Funnel",
          description:
            "Strategic content marketing funnel with lead magnets, nurture sequences, and conversion optimization.",
          category: "Digital Marketing",
          tags: ["Content Marketing", "Lead Generation", "Conversion"],
          features: [
            "Lead Magnet Strategy",
            "Content Funnel Design",
            "Nurture Sequences",
            "Landing Pages",
            "Email Automation",
            "Conversion Tracking",
          ],
          faqs: [
            {
              question: "What types of lead magnets work best?",
              answer:
                "eBooks, checklists, templates, and webinars typically perform well.",
            },
            {
              question: "How long until I see results?",
              answer:
                "Initial leads within 2-4 weeks, with optimization ongoing.",
            },
          ],
        },
        {
          title: "I Will Build Your Marketing Analytics Dashboard",
          description:
            "Custom marketing analytics dashboard with KPI tracking, ROI measurement, and automated reporting.",
          category: "Digital Marketing",
          tags: ["Analytics", "Data Visualization", "Marketing"],
          features: [
            "Custom Dashboard",
            "KPI Tracking",
            "ROI Measurement",
            "Automated Reports",
            "Data Integration",
            "Performance Insights",
          ],
          faqs: [
            {
              question: "Which platforms can you integrate?",
              answer:
                "Google Analytics, Facebook Ads, Google Ads, email platforms, and more.",
            },
            {
              question: "How often are reports generated?",
              answer: "Daily, weekly, or monthly reports based on your needs.",
            },
          ],
        },
        {
          title: "I Will Optimize Your Conversion Rate",
          description:
            "Comprehensive conversion rate optimization with A/B testing, user experience analysis, and performance improvements.",
          category: "Digital Marketing",
          tags: ["Conversion Optimization", "A/B Testing", "UX"],
          features: [
            "Conversion Audit",
            "A/B Testing Setup",
            "User Experience Analysis",
            "Landing Page Optimization",
            "Checkout Optimization",
            "Performance Tracking",
          ],
          faqs: [
            {
              question: "What conversion improvements can I expect?",
              answer:
                "Most clients see 20-50% improvement in conversion rates.",
            },
            {
              question: "How long does testing take?",
              answer:
                "Significant results typically seen within 4-8 weeks of testing.",
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
                  price: faker.number.float({
                    min: 0.1,
                    max: 0.3,
                    fractionDigits: 2,
                  }),
                  revisions: 1,
                  deliveryTime: 3,
                },
                {
                  title: "Standard",
                  price: faker.number.float({
                    min: 0.3,
                    max: 0.5,
                    fractionDigits: 2,
                  }),
                  revisions: 3,
                  deliveryTime: 5,
                },
                {
                  title: "Premium",
                  price: faker.number.float({
                    min: 0.5,
                    max: 1,
                    fractionDigits: 2,
                  }),
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
      "LATE",
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
