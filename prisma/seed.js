import {
  PrismaClient,
  BadgeTier,
  PaymentMethod,
  OrderStatus,
} from "@prisma/client";
import { hash } from "argon2";

const prisma = new PrismaClient();

// Helper to generate a random date within a range
function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

// Helper to pick a random item from an array
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper to generate a random integer within a range (inclusive)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to generate a random float within a range with 2 decimal places
function randomPrice(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

// Define country list
const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "India",
  "Japan",
  "Brazil",
  "Mexico",
  "South Africa",
  "Nigeria",
  "Egypt",
  "Russia",
  "China",
  "Singapore",
  "New Zealand",
];

// Define badge data
const badges = [
  { label: "Top Seller", icon: "trophy", color: "#FFD700" },
  { label: "Rising Talent", icon: "star", color: "#87CEEB" },
  { label: "Fast Delivery", icon: "rocket", color: "#32CD32" },
  { label: "Quality Service", icon: "medal", color: "#9370DB" },
  { label: "Customer Favorite", icon: "heart", color: "#FF69B4" },
  { label: "Expert", icon: "certificate", color: "#FFA500" },
  { label: "Verified Professional", icon: "check-circle", color: "#4169E1" },
  { label: "Problem Solver", icon: "lightbulb", color: "#FFFF00" },
];

// Define skill data
const skills = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "GraphQL",
  "TypeScript",
  "UI/UX Design",
  "Logo Design",
  "Content Writing",
  "Copywriting",
  "SEO Optimization",
  "Digital Marketing",
  "Video Editing",
  "Animation",
  "Voice Over",
  "Translation",
  "Data Analysis",
  "Machine Learning",
  "WordPress Development",
  "Mobile App Development",
  "Illustration",
];

// Define gigTag data
const gigTags = [
  "Remote Work",
  "Fast Delivery",
  "Revisions Included",
  "Top Rated",
  "Beginner Friendly",
  "Professional",
  "Budget",
  "Premium",
  "Custom Work",
  "Experienced",
  "Certified",
  "Portfolio Building",
];

// Define category data with hierarchy
const categories = [
  {
    label: "Design & Creative",
    slug: "design-creative",
    children: [
      { label: "Graphic Design", slug: "graphic-design" },
      { label: "Logo Design", slug: "logo-design" },
      { label: "UI/UX Design", slug: "ui-ux-design" },
      { label: "Illustration", slug: "illustration" },
    ],
  },
  {
    label: "Digital Marketing",
    slug: "digital-marketing",
    children: [
      { label: "Social Media", slug: "social-media" },
      { label: "SEO", slug: "seo" },
      { label: "Content Marketing", slug: "content-marketing" },
    ],
  },
  {
    label: "Programming & Tech",
    slug: "programming-tech",
    children: [
      { label: "Web Development", slug: "web-development" },
      { label: "Mobile Development", slug: "mobile-development" },
      { label: "Game Development", slug: "game-development" },
      { label: "Database Design", slug: "database-design" },
    ],
  },
  {
    label: "Writing & Translation",
    slug: "writing-translation",
    children: [
      { label: "Content Writing", slug: "content-writing" },
      { label: "Translation", slug: "translation" },
      { label: "Proofreading", slug: "proofreading" },
    ],
  },
];

async function main() {
  console.log("Starting seed process...");

  // Clean up existing data
  await prisma.$transaction([
    prisma.message.deleteMany(),
    prisma.chat.deleteMany(),
    prisma.review.deleteMany(),
    prisma.order.deleteMany(),
    prisma.gigPackageFeature.deleteMany(),
    prisma.gigPackage.deleteMany(),
    prisma.gigImage.deleteMany(),
    prisma.gig.deleteMany(),
    prisma.biometrics.deleteMany(),
    prisma.userSkill.deleteMany(),
    prisma.userBadge.deleteMany(),
    prisma.registrationToken.deleteMany(),
    prisma.user.deleteMany(),
    prisma.badge.deleteMany(),
    prisma.skill.deleteMany(),
    prisma.gigTag.deleteMany(),
    prisma.category.deleteMany(),
  ]);

  console.log("Cleaned up existing data");

  // Create badges
  const createdBadges = await Promise.all(
    badges.map((badge) =>
      prisma.badge.create({
        data: badge,
      })
    )
  );
  console.log(`Created ${createdBadges.length} badges`);

  // Create skills
  const createdSkills = await Promise.all(
    skills.map((skill) =>
      prisma.skill.create({
        data: { label: skill },
      })
    )
  );
  console.log(`Created ${createdSkills.length} skills`);

  // Create gigTags
  const createdGigTags = await Promise.all(
    gigTags.map((tag) =>
      prisma.gigTag.create({
        data: { label: tag },
      })
    )
  );
  console.log(`Created ${createdGigTags.length} gig tags`);

  // Create categories with parent-child relationships
  const parentCategories = await Promise.all(
    categories.map(async (category, index) => {
      const parent = await prisma.category.create({
        data: {
          label: category.label,
          slug: category.slug,
          sortOrder: index,
        },
      });

      // Create child categories
      if (category.children && category.children.length > 0) {
        await Promise.all(
          category.children.map((child, childIndex) =>
            prisma.category.create({
              data: {
                label: child.label,
                slug: child.slug,
                sortOrder: childIndex,
                parentId: parent.id,
              },
            })
          )
        );
      }

      return parent;
    })
  );
  console.log(`Created ${parentCategories.length} parent categories`);

  // Fetch all categories after creation
  const allCategories = await prisma.category.findMany();
  const childCategories = allCategories.filter((cat) => cat.parentId !== null);
  console.log(`Total of ${allCategories.length} categories created`);

  // Create users
  const numUsers = 50;
  const users = [];

  const firstNames = [
    "John",
    "Jane",
    "Alex",
    "Sarah",
    "Michael",
    "Emma",
    "David",
    "Olivia",
    "Daniel",
    "Sophia",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Miller",
    "Davis",
    "Garcia",
    "Rodriguez",
    "Wilson",
  ];

  for (let i = 0; i < numUsers; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${randomInt(1, 999)}`;
    const email = `${username}@example.com`;
    const hashedPassword = await hash("password123");

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        username,
        country: randomItem(countries),
        verified: Math.random() > 0.1, // 90% of users are verified
        avatar:
          Math.random() > 0.3
            ? `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "men" : "women"}/${randomInt(1, 99)}.jpg`
            : null,
        walletCreated: Math.random() > 0.2, // 80% of users have wallets
      },
    });

    users.push(user);

    // Add biometrics for some users
    if (Math.random() > 0.7) {
      await prisma.biometrics.create({
        data: {
          value: `biometric-data-${randomInt(1000, 9999)}`,
          userId: user.id,
        },
      });
    }

    // Add skills to users
    const numSkills = randomInt(2, 8);
    const shuffledSkills = [...createdSkills].sort(() => 0.5 - Math.random());
    const selectedSkills = shuffledSkills.slice(0, numSkills);

    for (const skill of selectedSkills) {
      await prisma.userSkill.create({
        data: {
          skillId: skill.id,
          userId: user.id,
          level: randomInt(1, 5),
          endorsed: Math.random() > 0.7,
        },
      });
    }

    // Add badges to some users
    if (Math.random() > 0.4) {
      const numBadges = randomInt(1, 4);
      const shuffledBadges = [...createdBadges].sort(() => 0.5 - Math.random());
      const selectedBadges = shuffledBadges.slice(0, numBadges);

      for (const badge of selectedBadges) {
        const badgeTiers = [
          BadgeTier.BRONZE,
          BadgeTier.SILVER,
          BadgeTier.GOLD,
          BadgeTier.PLATINUM,
          BadgeTier.DIAMOND,
        ];

        await prisma.userBadge.create({
          data: {
            badgeId: badge.id,
            userId: user.id,
            tier: randomItem(badgeTiers),
            isFeatured: Math.random() > 0.7,
          },
        });
      }
    }

    // Create registration token for some unverified users
    if (!user.verified && Math.random() > 0.5) {
      await prisma.registrationToken.create({
        data: {
          code: `${randomInt(100000, 999999)}`,
          email: user.email,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          userId: user.id,
        },
      });
    }
  }
  console.log(`Created ${users.length} users with skills and badges`);

  // Create gigs
  const numGigs = 100;
  const gigs = [];

  const gigTitles = [
    "Professional Logo Design",
    "Custom Website Development",
    "SEO Optimization Service",
    "Content Writing and Editing",
    "Social Media Management",
    "Mobile App Development",
    "Video Editing and Production",
    "Graphic Design Services",
    "Translation Services",
    "Voice Over Recording",
    "Data Analysis and Visualization",
    "WordPress Website Creation",
    "UI/UX Design Solutions",
    "Digital Marketing Campaign",
    "E-commerce Development",
  ];

  const gigDescriptions = [
    "I will create a professional and unique design tailored to your brand's identity and values. My approach focuses on simplicity, memorability, and effectiveness in conveying your brand message.",
    "Get a custom-built website designed with modern technologies. I specialize in responsive design, ensuring your site looks great on all devices, with fast loading times and intuitive navigation.",
    "I will optimize your content for search engines using proven techniques. My services include keyword research, on-page optimization, technical SEO audits, and regular performance reports.",
    "High-quality content writing designed to engage your audience. Whether you need blog posts, articles, or website copy, I'll deliver compelling content that resonates with your readers.",
    "Complete social media management package including content creation, posting schedule, engagement strategies, and performance analytics to grow your online presence.",
    "Custom mobile application development for iOS and Android platforms. From concept to launch, I'll create a user-friendly app that meets your business objectives.",
    "Professional video editing services including color correction, sound mixing, special effects, and motion graphics to make your videos stand out.",
    "Creative graphic design solutions for all your marketing materials, including brochures, flyers, social media posts, and more.",
    "Accurate and culturally sensitive translation services in multiple languages. I ensure your message maintains its meaning and impact across language barriers.",
    "Professional voice over services for commercials, explainer videos, e-learning courses, and more, delivered with quick turnaround times.",
    "Comprehensive data analysis services including data cleaning, visualization, and actionable insights to help you make informed business decisions.",
    "Complete WordPress website development including custom themes, plugin integration, e-commerce functionality, and SEO optimization.",
    "User-centered design services focused on creating intuitive and enjoyable user experiences. I create wireframes, prototypes, and final designs.",
    "Strategic digital marketing campaigns across multiple channels to increase your brand visibility and drive conversions.",
    "Full-featured e-commerce solutions including product setup, payment integration, inventory management, and a seamless checkout process.",
  ];

  // Create sellers (a subset of users who offer gigs)
  const sellers = users.filter(() => Math.random() > 0.4);

  for (let i = 0; i < numGigs; i++) {
    const seller = randomItem(sellers);
    const category = randomItem(childCategories);

    const gig = await prisma.gig.create({
      data: {
        title: randomItem(gigTitles),
        description: randomItem(gigDescriptions),
        viewCount: randomInt(10, 5000),
        averageRating: parseFloat((3 + Math.random() * 2).toFixed(1)), // Rating between 3.0 and 5.0
        ratingCount: randomInt(0, 100),
        sellerId: seller.id,
        categoryId: category.id,
        tags: {
          connect: Array(randomInt(2, 5))
            .fill(0)
            .map(() => ({
              id: randomItem(createdGigTags).id,
            })),
        },
      },
    });

    gigs.push(gig);

    // Add images to gig
    const numImages = randomInt(1, 5);
    for (let j = 0; j < numImages; j++) {
      await prisma.gigImage.create({
        data: {
          url: `https://picsum.photos/seed/${gig.id}-${j}/800/600`,
          alt: `${gig.title} image ${j + 1}`,
          isPrimary: j === 0, // First image is primary
          sortOrder: j,
          gigId: gig.id,
        },
      });
    }

    // Create packages for each gig
    const packageTiers = ["Basic", "Standard", "Premium"];

    for (let k = 0; k < packageTiers.length; k++) {
      const price = randomPrice(15 + k * 20, 35 + k * 50); // Price increases with tier
      const deliveryTime = Math.max(1, 7 - k * 2); // Delivery time decreases with higher tiers
      const revisions = k + 1; // More revisions with higher tiers

      const gigPackage = await prisma.gigPackage.create({
        data: {
          title: `${packageTiers[k]} Package`,
          description: `${packageTiers[k]} tier service for ${gig.title}`,
          price,
          deliveryTime,
          revisions,
          isActive: true,
          gigId: gig.id,
        },
      });

      // Create features for each package
      const baseFeatures = [
        {
          title: "Source File",
          description: "Includes source files",
          included: true,
        },
        {
          title: "Responsive Design",
          description: "Works on all devices",
          included: k > 0,
        },
        {
          title: "Commercial Use",
          description: "Can be used commercially",
          included: true,
        },
        {
          title: "Express Delivery",
          description: "24-hour delivery",
          included: k === 2,
        },
        {
          title: "Premium Support",
          description: "Priority customer support",
          included: k > 1,
        },
      ];

      for (const feature of baseFeatures) {
        await prisma.gigPackageFeature.create({
          data: {
            title: feature.title,
            description: feature.description,
            included: feature.included,
            gigPackageId: gigPackage.id,
          },
        });
      }
    }
  }
  console.log(`Created ${gigs.length} gigs with packages and features`);

  // Create orders
  const numOrders = 150;
  const orders = [];
  const paymentMethods = [
    PaymentMethod.BANK_TRANSFER,
    PaymentMethod.CRYPTOCURRENCY,
    PaymentMethod.CREDIT_CARD,
    PaymentMethod.PAYPAL,
  ];

  // Get all packages
  const allPackages = await prisma.gigPackage.findMany({
    include: { gig: true },
  });

  for (let i = 0; i < numOrders; i++) {
    const buyer = randomItem(users);
    const gigPackage = randomItem(allPackages);
    const seller = await prisma.user.findUniqueOrThrow({
      where: { id: gigPackage.gig.sellerId },
    });

    // Ensure buyer is not the seller
    if (buyer.id === seller.id) {
      continue;
    }

    // Generate random status with weighted distribution
    let status;
    const statusRand = Math.random();
    if (statusRand < 0.05) status = OrderStatus.PENDING;
    else if (statusRand < 0.1) status = OrderStatus.PAID;
    else if (statusRand < 0.2) status = OrderStatus.IN_PROGRESS;
    else if (statusRand < 0.3) status = OrderStatus.DELIVERED;
    else if (statusRand < 0.4) status = OrderStatus.REVISION;
    else if (statusRand < 0.8) status = OrderStatus.COMPLETED;
    else if (statusRand < 0.9) status = OrderStatus.CANCELLED;
    else if (statusRand < 0.95) status = OrderStatus.REFUNDED;
    else status = OrderStatus.DISPUTED;

    const createdAt = randomDate(new Date("2023-01-01"), new Date());
    let completedAt = null;
    let dueDate = null;

    if (
      [
        OrderStatus.DELIVERED,
        OrderStatus.REVISION,
        OrderStatus.COMPLETED,
      ].includes(status)
    ) {
      completedAt = new Date(
        createdAt.getTime() + randomInt(1, 14) * 24 * 60 * 60 * 1000
      );
    }

    if ([OrderStatus.PAID, OrderStatus.IN_PROGRESS].includes(status)) {
      dueDate = new Date(
        createdAt.getTime() + gigPackage.deliveryTime * 24 * 60 * 60 * 1000
      );
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${randomInt(100000, 999999)}`,
        price: gigPackage.price,
        paymentMethod: randomItem(paymentMethods),
        status,
        transactionId:
          Math.random() > 0.2 ? `TXN-${randomInt(100000, 999999)}` : null,
        requirements:
          Math.random() > 0.3
            ? "These are the specific requirements for this order. Please follow them carefully."
            : null,
        packageId: gigPackage.id,
        sellerId: seller.id,
        buyerId: buyer.id,
        createdAt,
        completedAt,
        dueDate,
      },
    });

    orders.push(order);

    // Create reviews for completed orders
    if (status === OrderStatus.COMPLETED && Math.random() > 0.3) {
      const rating = randomInt(3, 5); // Most completed orders get good ratings

      await prisma.review.create({
        data: {
          title: `Review for ${gigPackage.gig.title}`,
          content: `Great experience working with this seller. ${Math.random() > 0.5 ? "The delivery was prompt and the quality exceeded my expectations." : "I would definitely recommend this service to others looking for similar work."}`,
          rating,
          isPublic: true,
          authorId: buyer.id,
          orderId: order.id,
        },
      });

      // Update gig rating
      await prisma.gig.update({
        where: { id: gigPackage.gig.id },
        data: {
          ratingCount: { increment: 1 },
          averageRating: parseFloat(
            (
              (gigPackage.gig.averageRating * gigPackage.gig.ratingCount +
                rating) /
              (gigPackage.gig.ratingCount + 1)
            ).toFixed(1)
          ),
        },
      });
    }
  }
  console.log(`Created ${orders.length} orders with reviews`);

  // Create chats between buyers and sellers
  const numChats = 80;
  const chats = [];

  for (let i = 0; i < numChats; i++) {
    const buyer = randomItem(users);
    let seller;

    // Find a seller that's not the buyer
    do {
      seller = randomItem(sellers);
    } while (seller.id === buyer.id);

    const chatExists = await prisma.chat.findFirst({
      where: {
        buyerId: buyer.id,
        sellerId: seller.id,
      },
    });

    if (chatExists) {
      continue;
    }

    const chat = await prisma.chat.create({
      data: {
        buyerId: buyer.id,
        sellerId: seller.id,
        lastActivity: randomDate(new Date("2023-06-01"), new Date()),
        isArchived: Math.random() > 0.8,
      },
    });

    chats.push(chat);

    // Add messages to chat
    const numMessages = randomInt(3, 15);
    const startDate = new Date(chat.lastActivity);
    startDate.setDate(startDate.getDate() - numMessages);

    for (let j = 0; j < numMessages; j++) {
      const sender = Math.random() > 0.5 ? buyer : seller;
      const messageDate = new Date(startDate);
      messageDate.setHours(messageDate.getHours() + j * randomInt(1, 8));

      await prisma.message.create({
        data: {
          content: `Message ${j + 1} in the conversation. ${Math.random() > 0.7 ? "Looking forward to working with you!" : "Let me know if you have any questions."}`,
          isRead: Math.random() > 0.3,
          isEdited: Math.random() > 0.9,
          senderId: sender.id,
          chatId: chat.id,
          createdAt: messageDate,
          updatedAt:
            Math.random() > 0.9
              ? new Date(messageDate.getTime() + 30 * 60 * 1000)
              : messageDate,
        },
      });
    }

    // Update lastActivity
    await prisma.chat.update({
      where: { id: chat.id },
      data: { lastActivity: randomDate(startDate, new Date()) },
    });
  }
  console.log(`Created ${chats.length} chats with messages`);

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
