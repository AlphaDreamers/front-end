import { PaymentMethod, OrderStatus, PrismaClient } from "@prisma/client";
import { hash } from "argon2";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Clear existing data (optional - comment out if not needed)
  await cleanDatabase();

  // Create tags
  const tags = await createTags();
  console.log(`Created ${tags.length} tags`);

  // Create badges
  const badges = await createBadges();
  console.log(`Created ${badges.length} badges`);

  // Create skills
  const skills = await createSkills();
  console.log(`Created ${skills.length} skills`);

  // Create categories
  const categories = await createCategories();
  console.log(`Created ${categories.length} categories`);

  // Create users
  const users = await createUsers(50, badges);
  console.log(`Created ${users.length} users`);

  // Assign skills to users
  await assignSkillsToUsers(users, skills);
  console.log("Assigned skills to users");

  // Create gigs
  const gigs = await createGigs(users, categories, tags);
  console.log(`Created ${gigs.length} gigs`);

  // Create orders
  const orders = await createOrders(users, gigs);
  console.log(`Created ${orders.length} orders`);

  // Create reviews for completed orders
  await createReviews(orders);
  console.log("Created reviews for completed orders");

  // Create chats between buyers and sellers
  await createChats(users);
  console.log("Created chats between users");

  console.log("Database seeding completed successfully!");
}

async function cleanDatabase() {
  // Delete in correct order to respect foreign key constraints
  await prisma.message.deleteMany({});
  await prisma.chat.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.gigPackageFeature.deleteMany({});
  await prisma.gigPackage.deleteMany({});
  await prisma.gigImage.deleteMany({});
  await prisma.gig.deleteMany({});
  await prisma.userSkill.deleteMany({});
  await prisma.biometrics.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.gigTag.deleteMany({});
  await prisma.badge.deleteMany({});

  console.log("Cleaned existing database records");
}

/**
 * 
model Badge {
  id    String @id @default(uuid())
  label String @unique
  icon  String

  color      String
  userBadges UserBadge[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model UserBadge {
  id      String    @id @default(uuid())
  userId  String
  badgeId String
  tier    BadgeTier @default(BRONZE)

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  badge Badge @relation(fields: [badgeId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, badgeId])
}
 */

async function createBadges() {
  const badgesList = [
    { label: "Top Seller", icon: "star", color: "#FFD700" },
    { label: "Rising Star", icon: "rocket", color: "#00BFFF" },
    { label: "Expert", icon: "trophy", color: "#FF4500" },
    { label: "Verified Seller", icon: "check-circle", color: "#32CD32" },
    { label: "Newbie", icon: "newspaper", color: "#808080" },
  ];

  const badges = [];

  for (const badge of badgesList) {
    const createdBadge = await prisma.badge.create({
      data: {
        label: badge.label,
        icon: badge.icon,
        color: badge.color,
      },
    });
    badges.push(createdBadge);
  }

  return badges;
}

async function createTags() {
  const tagsList = [
    "Logo Design",
    "Web Development",
    "SEO",
    "Content Writing",
    "Social Media Marketing",
    "Video Editing",
    "Graphic Design",
    "Data Analysis",
    "Mobile App Development",
    "E-commerce",
    "Digital Marketing",
    "Photography",
    "Translation",
    "Voice Over",
    "Animation",
    "UI/UX Design",
    "Copywriting",
    "WordPress Development",
    "3D Modeling",
    "Music Production",
  ];

  const tags = [];

  for (const label of tagsList) {
    const tag = await prisma.gigTag.create({
      data: { label },
    });
    tags.push(tag);
  }

  return tags;
}

async function createSkills() {
  const skillsList = [
    "Graphic Design",
    "Web Development",
    "Content Writing",
    "Digital Marketing",
    "Video Editing",
    "Translation",
    "Voice Over",
    "Animation",
    "Social Media Management",
    "SEO Optimization",
    "Logo Design",
    "Illustration",
    "Mobile App Development",
    "Data Analysis",
    "UI/UX Design",
    "Copywriting",
    "WordPress Development",
    "Photography",
    "3D Modeling",
    "Music Production",
  ];

  const skills = [];

  for (const label of skillsList) {
    const skill = await prisma.skill.create({
      data: { label },
    });
    skills.push(skill);
  }

  return skills;
}

async function createCategories() {
  // Create main categories
  const mainCategories = [
    { label: "Graphic & Design", slug: "graphic-design" },
    { label: "Digital Marketing", slug: "digital-marketing" },
    { label: "Writing & Translation", slug: "writing-translation" },
    { label: "Video & Animation", slug: "video-animation" },
    { label: "Programming & Tech", slug: "programming-tech" },
    { label: "Music & Audio", slug: "music-audio" },
  ];

  const categories = [];

  // Create main categories
  for (const cat of mainCategories) {
    const mainCategory = await prisma.category.create({
      data: {
        label: cat.label,
        slug: cat.slug,
        isActive: true,
        sortOrder: categories.length,
      },
    });
    categories.push(mainCategory);

    // Create 3-5 subcategories for each main category
    const subCategoriesCount = faker.number.int({ min: 3, max: 5 });

    for (let i = 0; i < subCategoriesCount; i++) {
      const subLabel = `${cat.label} - ${faker.commerce.department()}`;
      const subSlug = subLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      const subCategory = await prisma.category.create({
        data: {
          label: subLabel,
          slug: subSlug,
          isActive: true,
          sortOrder: i,
          parentId: mainCategory.id,
        },
      });
      categories.push(subCategory);
    }
  }

  return categories;
}

async function createUsers(count, badges) {
  const users = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const hashedPassword = await hash("password123");

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        password: hashedPassword,
        username: faker.internet.username({
          firstName,
          lastName,
        }),
        verified: faker.datatype.boolean(0.8), // 80% of users are verified
        walletCreated: faker.datatype.boolean(0.7), // 70% have wallets
        walletCreatedTime: faker.datatype.boolean(0.7)
          ? faker.date.past({ years: 1 })
          : null,
        biometrics:
          i < 10
            ? {
                // Only create biometrics for first 10 users
                create: {
                  type: "FINGERPRINT",
                  value: faker.string.uuid(),
                  isVerified: true,
                },
              }
            : undefined,
        avatar:
          Math.random() > 0.75
            ? `https://picsum.photos/seed/${i}/200/200`
            : null,
        badges: {
          create: [
            {
              badgeId: faker.helpers.arrayElement(badges).id,
              tier: faker.helpers.weightedArrayElement([
                { value: "BRONZE", weight: 50 },
                { value: "SILVER", weight: 30 },
                { value: "GOLD", weight: 15 },
                { value: "PLATINUM", weight: 4 },
                { value: "DIAMOND", weight: 1 },
              ]),
              isFeatured: faker.datatype.boolean(0.1),
            },
          ],
        },
      },
    });

    users.push(user);
  }

  return users;
}

async function assignSkillsToUsers(users, skills) {
  for (const user of users) {
    // Assign 2-5 random skills to each user
    const skillCount = faker.number.int({ min: 2, max: 5 });
    const shuffledSkills = faker.helpers
      .shuffle([...skills])
      .slice(0, skillCount);

    for (const skill of shuffledSkills) {
      await prisma.userSkill.create({
        data: {
          userId: user.id,
          skillId: skill.id,
          level: faker.number.int({ min: 1, max: 5 }),
          endorsed: faker.datatype.boolean(0.3), // 30% chance of being endorsed
        },
      });
    }
  }
}

async function createGigs(users, categories, tags) {
  const gigs = [];
  const gigCount = Math.floor(users.length * 0.7); // About 70% of users create gigs

  const sellerUsers = faker.helpers.shuffle([...users]).slice(0, gigCount);

  for (const user of sellerUsers) {
    // Each seller creates 1-3 gigs
    const userGigCount = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < userGigCount; i++) {
      // Get 1-3 random categories for this gig (preferring subcategories)
      const subcategories = categories.filter((c) => c.parentId !== null);
      const selectedCategories = faker.helpers
        .shuffle([...subcategories])
        .slice(0, faker.number.int({ min: 1, max: 3 }));

      const gig = await prisma.gig.create({
        data: {
          title: faker.commerce.productName(),
          description: faker.lorem.paragraphs({ min: 2, max: 5 }),
          isActive: faker.datatype.boolean(0.9), // 90% of gigs are active
          viewCount: faker.number.int({ min: 0, max: 50000 }),
          sellerId: user.id,
          categories: {
            connect: selectedCategories.map((c) => ({ id: c.id })),
          },
          ratingCount: faker.number.int({ min: 1, max: 1000 }),
          averageRating: faker.number.float({
            min: 1,
            max: 5,
            precision: 0.1,
          }),
          tags: {
            connect: faker.helpers
              .shuffle([...tags])
              .slice(0, faker.number.int({ min: 1, max: 8 }))
              .map((t) => ({ id: t.id })),
          },
        },
      });

      // Create 2-5 images for the gig
      const imageCount = faker.number.int({ min: 2, max: 5 });
      for (let j = 0; j < imageCount; j++) {
        const width = 800;
        const height = 600;
        const isPrimary = j === 0; // First image is primary

        await prisma.gigImage.create({
          data: {
            url: `https://picsum.photos/${width}/${height}?random=${gig.id}-${j}`,
            alt: `${gig.title} image ${j + 1}`,
            isPrimary,
            sortOrder: j,
            gigId: gig.id,
          },
        });
      }

      // Create 3 packages for the gig (Basic, Standard, Premium)
      const packages = [
        {
          title: "Basic",
          description: faker.lorem.paragraph(),
          price: faker.number.float({ min: 15, max: 50, fractionDigits: 2 }),
          deliveryTime: faker.number.int({ min: 1, max: 3 }),
          revisions: faker.number.int({ min: 1, max: 2 }),
        },
        {
          title: "Standard",
          description: faker.lorem.paragraph(),
          price: faker.number.float({ min: 50, max: 100, fractionDigits: 2 }),
          deliveryTime: faker.number.int({ min: 2, max: 5 }),
          revisions: faker.number.int({ min: 2, max: 3 }),
        },
        {
          title: "Premium",
          description: faker.lorem.paragraph(),
          price: faker.number.float({ min: 100, max: 200, fractionDigits: 2 }),
          deliveryTime: faker.number.int({ min: 3, max: 7 }),
          revisions: faker.number.int({ min: 3, max: 5 }),
        },
      ];

      for (const pkg of packages) {
        const gigPackage = await prisma.gigPackage.create({
          data: {
            title: pkg.title,
            description: pkg.description,
            price: pkg.price,
            deliveryTime: pkg.deliveryTime,
            revisions: pkg.revisions,
            isActive: true,
            gigId: gig.id,
          },
        });

        // Create 3-5 features for this package
        const featureCount = faker.number.int({ min: 3, max: 5 });
        for (let k = 0; k < featureCount; k++) {
          await prisma.gigPackageFeature.create({
            data: {
              title: faker.commerce.productAdjective(),
              description: faker.datatype.boolean(0.5)
                ? faker.lorem.sentence()
                : null,
              included: pkg.title !== "Basic" || k < 2, // Basic package has fewer included features
              gigPackageId: gigPackage.id,
            },
          });
        }
      }

      gigs.push(gig);
    }
  }

  return gigs;
}

async function createOrders(users, gigs) {
  const orders = [];
  const orderCount = Math.floor(gigs.length * 1.5); // Create approximately 1.5 orders per gig

  // Get all packages
  const packages = await prisma.gigPackage.findMany({
    include: { gig: true },
  });

  for (let i = 0; i < orderCount; i++) {
    // Get a random package
    const randomPackage = faker.helpers.arrayElement(packages);

    // Get a random buyer (who is not the seller)
    const possibleBuyers = users.filter(
      (u) => u.id !== randomPackage.gig.sellerId
    );
    const buyer = faker.helpers.arrayElement(possibleBuyers);

    // Determine order status (weighted)
    const statusOptions = [
      { status: OrderStatus.PENDING, weight: 5 },
      { status: OrderStatus.PAID, weight: 10 },
      { status: OrderStatus.IN_PROGRESS, weight: 15 },
      { status: OrderStatus.DELIVERED, weight: 10 },
      { status: OrderStatus.REVISION, weight: 5 },
      { status: OrderStatus.COMPLETED, weight: 40 },
      { status: OrderStatus.CANCELLED, weight: 10 },
      { status: OrderStatus.REFUNDED, weight: 3 },
      { status: OrderStatus.DISPUTED, weight: 2 },
    ];

    const weightedStatus = weightedRandom(statusOptions);

    // Calculate appropriate dates
    const createdAt = faker.date.past({ years: 1 });
    let completedAt = null;
    let dueDate = null;

    if (
      weightedStatus === OrderStatus.COMPLETED ||
      weightedStatus === OrderStatus.CANCELLED ||
      weightedStatus === OrderStatus.REFUNDED
    ) {
      completedAt = faker.date.between({ from: createdAt, to: new Date() });
    }

    if (
      weightedStatus !== OrderStatus.CANCELLED &&
      weightedStatus !== OrderStatus.REFUNDED &&
      weightedStatus !== OrderStatus.PENDING
    ) {
      const deliveryDays = randomPackage.deliveryTime;
      dueDate = new Date(createdAt);
      dueDate.setDate(dueDate.getDate() + deliveryDays);
    }

    const order = await prisma.order.create({
      data: {
        price: randomPackage.price,
        paymentMethod: faker.helpers.arrayElement(Object.values(PaymentMethod)),
        status: weightedStatus,
        transactionId:
          weightedStatus !== OrderStatus.PENDING
            ? faker.string.alphanumeric(16)
            : null,
        requirements: faker.lorem.paragraphs({ min: 1, max: 3 }),
        packageId: randomPackage.id,
        sellerId: randomPackage.gig.sellerId,
        buyerId: buyer.id,
        createdAt,
        updatedAt: faker.date.between({ from: createdAt, to: new Date() }),
        completedAt,
        dueDate,
      },
    });

    orders.push(order);
  }

  return orders;
}

async function createReviews(orders) {
  // Create reviews for completed orders (about 80% of completed orders get reviews)
  const completedOrders = orders.filter(
    (o) => o.status === OrderStatus.COMPLETED
  );

  for (const order of completedOrders) {
    if (faker.datatype.boolean(0.8)) {
      await prisma.review.create({
        data: {
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraphs({ min: 1, max: 2 }),
          rating: faker.helpers.weightedArrayElement([
            { value: 5, weight: 50 },
            { value: 4, weight: 30 },
            { value: 3, weight: 15 },
            { value: 2, weight: 3 },
            { value: 1, weight: 2 },
          ]),
          isPublic: faker.datatype.boolean(0.95), // 95% of reviews are public
          orderId: order.id,
          authorId: order.buyerId,
        },
      });
    }
  }
}

async function createChats(users) {
  // Create chats between users (about 30% of possible buyer-seller combinations)
  const chatCount = Math.floor(users.length * 0.3);

  for (let i = 0; i < chatCount; i++) {
    // Pick two different random users
    const userIndices = faker.helpers.uniqueArray(
      () => faker.number.int({ min: 0, max: users.length - 1 }),
      2
    );

    const seller = users[userIndices[0]];
    const buyer = users[userIndices[1]];

    // Check if a chat already exists between these users
    const existingChat = await prisma.chat.findUnique({
      where: {
        sellerId_buyerId: {
          sellerId: seller.id,
          buyerId: buyer.id,
        },
      },
    });

    if (!existingChat) {
      const chat = await prisma.chat.create({
        data: {
          sellerId: seller.id,
          buyerId: buyer.id,
          lastActivity: faker.date.recent(),
          isArchived: faker.datatype.boolean(0.1), // 10% of chats are archived
        },
      });

      // Create 1-15 messages in this chat
      const messageCount = faker.number.int({ min: 1, max: 15 });
      const baseDate = faker.date.past({ years: 1 });

      for (let j = 0; j < messageCount; j++) {
        // Calculate a progressive timestamp for each message
        const messageDate = new Date(baseDate);
        messageDate.setHours(messageDate.getHours() + j * 2); // 2 hours between messages

        // Determine sender (alternating with some randomness)
        const senderId =
          j % 2 === 0
            ? faker.datatype.boolean(0.8)
              ? buyer.id
              : seller.id
            : faker.datatype.boolean(0.8)
            ? seller.id
            : buyer.id;

        await prisma.message.create({
          data: {
            content: faker.lorem.paragraph(),
            isRead: j < messageCount - 2 || faker.datatype.boolean(0.7),
            isEdited: faker.datatype.boolean(0.1),
            chatId: chat.id,
            senderId,
            createdAt: messageDate,
            updatedAt: faker.datatype.boolean(0.1)
              ? new Date(messageDate.getTime() + 1000 * 60 * 10) // 10 minutes later if edited
              : messageDate,
          },
        });
      }

      // Update lastActivity to match the last message
      await prisma.chat.update({
        where: { id: chat.id },
        data: {
          lastActivity: new Date(
            baseDate.getTime() + (messageCount - 1) * 2 * 60 * 60 * 1000
          ),
        },
      });
    }
  }
}

// Helper function for weighted random selection
function weightedRandom(options) {
  const totalWeight = options.reduce((acc, option) => acc + option.weight, 0);
  let random = faker.number.int({ min: 1, max: totalWeight });

  for (const option of options) {
    random -= option.weight;
    if (random <= 0) {
      return option.status;
    }
  }

  return options[0].status; // Fallback
}

// Run the seed function
main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
