import { faker } from "@faker-js/faker";
import {
  type Badge,
  type Category,
  type Gig,
  type GigTag,
  type Order,
  PrismaClient,
  type Skill,
  type User,
} from "@prisma/client";
import argon2 from "argon2";

let unique = 0;

const prisma = new PrismaClient();

async function generateUserData() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: await argon2.hash(faker.internet.password()),
    verified: faker.datatype.boolean(),
    twoFactorVerified: faker.datatype.boolean(),
    username: `${faker.internet.username()}-${unique++}`,
    avatar: faker.image.avatar(),
    country: faker.location.country(),
    walletCreated: faker.datatype.boolean(),
    walletCreatedTime: faker.datatype.boolean() ? faker.date.past() : null,
  };
}

async function seedBadges() {
  console.log("Seeding badges...");
  const badges = [];
  for (let i = 0; i < 10; i++) {
    const badge = await prisma.badge.create({
      data: {
        label: `${faker.lorem.word()}-${unique++}`,
        icon: faker.helpers.arrayElement([
          "Star",
          "Award",
          "Trophy",
          "Medal",
          "Shield",
          "Crown",
          "Rocket",
          "Gem",
          "Zap",
          "Flame",
        ]),
        color: faker.color.rgb(),
        conditionMetric: faker.lorem.word(),
        description: faker.lorem.sentence(),
        tiers: {
          create: [
            { tier: "BRONZE", threshold: 5 },
            { tier: "SILVER", threshold: 10 },
            { tier: "GOLD", threshold: 20 },
            { tier: "PLATINUM", threshold: 50 },
            { tier: "DIAMOND", threshold: 100 },
          ],
        },
      },
    });
    badges.push(badge);
  }
  console.log(`Seeded ${badges.length} badges.`);
  return badges;
}

async function seedSkills() {
  console.log("Seeding skills...");
  const skills = [];
  for (let i = 0; i < 20; i++) {
    const skill = await prisma.skill.create({
      data: {
        label: `${faker.lorem.word()}-${unique++}`,
      },
    });
    skills.push(skill);
  }
  console.log(`Seeded ${skills.length} skills.`);
  return skills;
}

async function seedGigTags() {
  console.log("Seeding gig tags...");
  const tags = [];
  for (let i = 0; i < 15; i++) {
    const tag = await prisma.gigTag.create({
      data: {
        label: faker.lorem.word(),
      },
    });
    tags.push(tag);
  }
  console.log(`Seeded ${tags.length} gig tags.`);
  return tags;
}

async function seedCategories() {
  console.log("Seeding categories...");
  const topLevelCategories = [];
  for (let i = 0; i < 5; i++) {
    const category = await prisma.category.create({
      data: {
        label: `${faker.commerce.department()}-${unique++}`,
        slug: faker.lorem.slug(),
      },
    });
    topLevelCategories.push(category);
  }

  const subCategories = [];
  for (let i = 0; i < 5; i++) {
    const parent = topLevelCategories[faker.number.int({ min: 0, max: 4 })];
    const subCategory = await prisma.category.create({
      data: {
        label: faker.commerce.productName(),
        slug: faker.lorem.slug(),
        parentId: parent.id,
      },
    });
    subCategories.push(subCategory);
  }

  console.log(
    `Seeded ${topLevelCategories.length + subCategories.length} categories.`
  );
  return [...topLevelCategories, ...subCategories];
}

async function seedUsers(skills: Skill[], badges: Badge[]) {
  console.log("Seeding users...");
  const users = [];

  // Create specific user
  const specificUserData = {
    ...(await generateUserData()),
    email: "test@gmail.com",
    password: await argon2.hash("test"),
    verified: true,
  };
  const specificUser = await prisma.user.create({
    data: specificUserData,
  });
  users.push(specificUser);

  // Create 99 random users
  for (let i = 0; i < 99; i++) {
    const userData = await generateUserData();
    const user = await prisma.user.create({
      data: userData,
    });
    users.push(user);
  }

  // Assign skills and badges to users
  for (const user of users) {
    const numSkills = faker.number.int({ min: 1, max: 5 });
    const userSkills = faker.helpers.shuffle(skills).slice(0, numSkills);
    for (const skill of userSkills) {
      await prisma.userSkill.create({
        data: {
          level: faker.number.int({ min: 1, max: 10 }),
          skillId: skill.id,
          userId: user.id,
        },
      });
    }

    const numBadges = faker.number.int({ min: 0, max: 3 });
    const userBadges = faker.helpers.shuffle(badges).slice(0, numBadges);
    for (const badge of userBadges) {
      const tiers = await prisma.userBadgeTier.findMany({
        where: { badgeId: badge.id },
      });
      const tier = faker.helpers.arrayElement(tiers);
      await prisma.userBadge.create({
        data: {
          userId: user.id,
          badgeId: badge.id,
          tier: tier.tier,
          isFeatured: faker.datatype.boolean(),
          progress: faker.number.int({ min: 0, max: tier.threshold }),
        },
      });
    }
  }

  console.log(`Seeded ${users.length} users.`);
  return users;
}

async function seedGigs(users: User[], categories: Category[], tags: GigTag[]) {
  console.log("Seeding gigs...");
  const gigs = [];
  for (let i = 0; i < 200; i++) {
    const seller = faker.helpers.arrayElement(users);
    const category = faker.helpers.arrayElement(categories);
    const gigTags = faker.helpers
      .shuffle(tags)
      .slice(0, faker.number.int({ min: 1, max: 5 }));
    const gig = await prisma.gig.create({
      data: {
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        viewCount: faker.number.int({ min: 0, max: 1000 }),
        averageRating: faker.number.float({
          min: 0,
          max: 5,
          fractionDigits: 1,
        }),
        ratingCount: faker.number.int({ min: 0, max: 100 }),
        sellerId: seller.id,
        categoryId: category.id,
        tags: {
          connect: gigTags.map((tag) => ({ id: tag.id })),
        },
        packages: {
          create: [
            {
              title: "Basic",
              description: faker.lorem.sentence(),
              price: parseFloat(faker.commerce.price({ min: 10, max: 100 })),
              deliveryTime: faker.number.int({ min: 1, max: 30 }),
              revisions: faker.number.int({ min: 0, max: 5 }),
              features: {
                create: [
                  { title: "Feature 1", included: true },
                  { title: "Feature 2", included: false },
                ],
              },
            },
            {
              title: "Standard",
              description: faker.lorem.sentence(),
              price: parseFloat(faker.commerce.price({ min: 50, max: 200 })),
              deliveryTime: faker.number.int({ min: 1, max: 30 }),
              revisions: faker.number.int({ min: 0, max: 5 }),
              features: {
                create: [
                  { title: "Feature 1", included: true },
                  { title: "Feature 2", included: true },
                ],
              },
            },
            {
              title: "Premium",
              description: faker.lorem.sentence(),
              price: parseFloat(faker.commerce.price({ min: 100, max: 500 })),
              deliveryTime: faker.number.int({ min: 1, max: 30 }),
              revisions: faker.number.int({ min: 0, max: 5 }),
              features: {
                create: [
                  { title: "Feature 1", included: true },
                  { title: "Feature 2", included: true },
                  { title: "Feature 3", included: true },
                ],
              },
            },
          ],
        },
        images: {
          create: [
            {
              url: faker.image.urlPicsumPhotos(),
              isPrimary: true,
              sortOrder: 0,
            },
            {
              url: faker.image.urlPicsumPhotos(),
              isPrimary: false,
              sortOrder: 1,
            },
          ],
        },
      },
    });
    gigs.push(gig);
  }
  console.log(`Seeded ${gigs.length} gigs.`);
  return gigs;
}

async function seedOrders(users: User[], gigs: Gig[]) {
  console.log("Seeding orders...");
  const orders = [];
  for (let i = 0; i < 500; i++) {
    const buyer = faker.helpers.arrayElement(users);
    const gig = faker.helpers.arrayElement(gigs);
    const seller = users.find((u) => u.id === gig.sellerId)!;
    const packages = await prisma.gigPackage.findMany({
      where: { gigId: gig.id },
    });
    const pck = faker.helpers.arrayElement(packages);
    const order = await prisma.order.create({
      data: {
        price: pck.price,
        paymentMethod: faker.helpers.arrayElement([
          "BANK_TRANSFER",
          "CRYPTOCURRENCY",
          "CREDIT_CARD",
          "PAYPAL",
        ]),
        status: faker.helpers.arrayElement([
          "PENDING",
          "PAID",
          "IN_PROGRESS",
          "DELIVERED",
          "REVISION",
          "COMPLETED",
          "CANCELLED",
          "REFUNDED",
          "DISPUTED",
        ]),
        transactionId: faker.string.uuid(),
        requirements: faker.lorem.paragraph(),
        buyerId: buyer.id,
        sellerId: seller.id,
        packageId: pck.id,
        dueDate: faker.date.future(),
      },
    });
    orders.push(order);
  }
  console.log(`Seeded ${orders.length} orders.`);
  return orders;
}

async function seedChats(users: User[]) {
  console.log("Seeding chats...");
  const chats = [];
  for (let i = 0; i < 50; i++) {
    const seller = faker.helpers.arrayElement(users);
    const buyer = faker.helpers.arrayElement(
      users.filter((u) => u.id !== seller.id)
    );
    const chat = await prisma.chat.create({
      data: {
        sellerId: seller.id,
        buyerId: buyer.id,
        lastActivity: faker.date.recent(),
        isArchived: faker.datatype.boolean(),
      },
    });
    chats.push(chat);

    const numMessages = faker.number.int({ min: 10, max: 20 });
    for (let j = 0; j < numMessages; j++) {
      const sender = faker.helpers.arrayElement([seller, buyer]);
      await prisma.message.create({
        data: {
          content: faker.lorem.sentence(),
          isRead: faker.datatype.boolean(),
          isEdited: faker.datatype.boolean(),
          senderId: sender.id,
          chatId: chat.id,
        },
      });
    }
  }
  console.log(`Seeded ${chats.length} chats with messages.`);
  return chats;
}

async function seedReviews(orders: Order[], users: User[]) {
  console.log("Seeding reviews...");
  const completedOrders = orders.filter((o) => o.status === "COMPLETED");
  let reviewCount = 0;
  for (const order of completedOrders) {
    if (faker.datatype.boolean()) {
      const buyer = users.find((u) => u.id === order.buyerId)!;
      await prisma.review.create({
        data: {
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
          rating: faker.number.int({ min: 1, max: 5 }),
          isPublic: faker.datatype.boolean(),
          orderId: order.id,
          authorId: buyer.id,
        },
      });
      reviewCount++;
    }
  }
  console.log(`Seeded ${reviewCount} reviews.`);
}

async function main() {
  console.log("Starting seeding process...");
  const badges = await seedBadges();
  const skills = await seedSkills();
  const tags = await seedGigTags();
  const categories = await seedCategories();
  const users = await seedUsers(skills, badges);
  const gigs = await seedGigs(users, categories, tags);
  const orders = await seedOrders(users, gigs);
  await seedChats(users);
  await seedReviews(orders, users);
  console.log("Seeding process completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
