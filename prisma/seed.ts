import { OrderStatus, PrismaClient, type SocialLinkType } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

// Helper shit
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = <T>(arr: Array<T>): T =>
  arr[Math.floor(Math.random() * arr.length)];
const shuffleArray = <T>(arr: Array<T>): Array<T> =>
  arr.sort(() => Math.random() - 0.5);

// Fucking constants
const NUM_USERS = 50;
const NUM_SELLERS = 20;
const GIGS_PER_SELLER = 5;
const ORDERS_PER_GIG = 2;
const MESSAGES_PER_CHAT = 4;
const SOCIAL_LINK_TYPES: SocialLinkType[] = [
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

async function main() {
  console.log("Starting the fucking seeding process, bro...");

  // Wipe the fucking slate clean
  await prisma.user.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.badge.deleteMany({});
  console.log("Fucking cleared everything.");

  // 1. Categories - 5 top-level, 15 subcategories
  const topCategories = await Promise.all(
    ["Programming", "Design", "Writing", "Marketing", "Consulting"].map(
      (label) =>
        prisma.category.create({
          data: { label, slug: label.toLowerCase(), depth: 0 },
        })
    )
  );
  const subCategories = await Promise.all(
    topCategories.flatMap((parent) =>
      Array.from({ length: 3 }, (_, i) =>
        prisma.category.create({
          data: {
            label: `${parent.label} Sub ${i + 1}`,
            slug: `${parent.slug}-sub-${i + 1}`,
            depth: 1,
            parentId: parent.id,
          },
        })
      )
    )
  );
  console.log("Fucking categories done.");

  // 2. Tags - 20 of these fuckers
  const tags = await Promise.all(
    Array.from({ length: 20 }, (_, i) =>
      prisma.tag.create({
        data: { label: `Tag ${i + 1}`, slug: `tag-${i + 1}` },
      })
    )
  );
  console.log("Tags fucking created.");

  // 3. Skills - 20 skills, bro
  const skills = await Promise.all(
    Array.from({ length: 20 }, (_, i) =>
      prisma.skill.create({ data: { label: `Skill ${i + 1}` } })
    )
  );
  console.log("Skills in the fucking bag.");

  // 4. Badges - 5 badges, 15 milestones
  const badges = await Promise.all(
    [
      "Fast Responder",
      "Top Seller",
      "Creative Genius",
      "Customer Favorite",
      "Expert",
    ].map((title) =>
      prisma.badge.create({
        data: {
          title,
          description: `Description for ${title}`,
          condition: `Condition for ${title}`,
          milestones: {
            create: [
              { threshold: 10, tier: "BRONZE" },
              { threshold: 25, tier: "SILVER" },
              { threshold: 50, tier: "GOLD" },
            ],
          },
        },
      })
    )
  );
  console.log("Badges fucking sorted.");

  // 5. Users - 50 motherfuckers
  const users = await Promise.all(
    Array.from({ length: NUM_USERS }, async (_, i) =>
      prisma.user.create({
        data: {
          username: `user${i + 1}`,
          email:
            i === 0
              ? "test1@gmail.com"
              : i === 1
                ? "test2@gmail.com"
                : `user${i + 1}@example.com`,
          password: await argon2.hash(
            i === 0 ? "test" : i === 1 ? "test" : `password${i + 1}`
          ),
          isVerified: i === 0 ? true : i === 1 ? true : Math.random() < 0.8,
          firstName: `First${i + 1}`,
          lastName: `Last${i + 1}`,
          headline: Math.random() < 0.5 ? `Headline for user${i + 1}` : null,
          bio: Math.random() < 0.5 ? `Bio for user${i + 1}` : null,
          isKycVerified: Math.random() < 0.3,
          publicKey: Math.random() < 0.3 ? `pubkey${i + 1}` : null,
        },
      })
    )
  );
  console.log("Users fucking created.");

  // 6. Social Links - ~50 of these shits
  for (const user of users) {
    if (Math.random() < 0.5) {
      const numLinks = randomInt(1, 3);
      await Promise.all(
        Array.from({ length: numLinks }, () =>
          prisma.socialLink.create({
            data: {
              type: randomElement(SOCIAL_LINK_TYPES),
              url: `https://${randomElement(["example.com", "social.com", "link.com"])}/user${user.id}`,
              userId: user.id,
            },
          })
        )
      );
    }
  }
  console.log("Social links fucking done.");

  // 7. Portfolio Items - ~37 items, ~75 images
  for (const user of users) {
    if (Math.random() < 0.5) {
      const numItems = randomInt(1, 2);
      for (let j = 0; j < numItems; j++) {
        const portfolioItem = await prisma.portfolioItem.create({
          data: {
            title: `Portfolio Item ${j + 1} by ${user.username}`,
            description: `Description for portfolio item ${j + 1}`,
            url: `https://portfolio.com/user${user.id}/item${j + 1}`,
            userId: user.id,
          },
        });
        const numImages = randomInt(1, 3);
        await Promise.all(
          Array.from({ length: numImages }, (_, k) =>
            prisma.image.create({
              data: {
                url: `https://placehold.co/600x400?text=Portfolio+Image+${k + 1}`,
                isPrimary: k === 0,
                portfolioItemId: portfolioItem.id,
              },
            })
          )
        );
      }
    }
  }
  console.log("Portfolio items fucking nailed.");

  // 8. User Skills - ~150 skill assignments
  for (const user of users) {
    const numSkills = randomInt(1, 5);
    const userSkills = shuffleArray(skills).slice(0, numSkills);
    await Promise.all(
      userSkills.map((skill) =>
        prisma.userSkill.create({
          data: {
            userId: user.id,
            skillId: skill.id,
            level: randomInt(1, 5),
          },
        })
      )
    );
  }
  console.log("Skills assigned to fucking users.");

  // 9. Gigs - 100 gigs, bro
  const sellers = shuffleArray(users).slice(0, NUM_SELLERS);
  for (const seller of sellers) {
    for (let i = 0; i < GIGS_PER_SELLER; i++) {
      const numTags = randomInt(1, 3);
      const gigTags = shuffleArray(tags).slice(0, numTags);
      const numPackages = randomInt(1, 3);
      const numFeatures = randomInt(3, 5);
      const numFaqs = randomInt(0, 3);
      const gig = await prisma.gig.create({
        data: {
          title: `Gig ${i + 1} by ${seller.username}`,
          description: `Description for gig ${i + 1}`,
          sellerId: seller.id,
          categoryId: randomElement(subCategories).id,
          tags: { connect: gigTags.map((tag) => ({ id: tag.id })) },
          images: {
            create: [
              {
                url: "https://placehold.co/600x400?text=Gig+Image",
                isPrimary: true,
              },
            ],
          },
          packages: {
            create: Array.from({ length: numPackages }, (_, j) => ({
              title: `Package ${j + 1}`,
              price: randomInt(50, 500),
              revisions: randomInt(1, 5),
              deliveryTime: randomInt(1, 14),
            })),
          },
          features: {
            create: Array.from({ length: numFeatures }, (_, j) => ({
              label: `Feature ${j + 1}`,
            })),
          },
          faqs: {
            create: Array.from({ length: numFaqs }, (_, j) => ({
              question: `FAQ Question ${j + 1}`,
              answer: `FAQ Answer ${j + 1}`,
            })),
          },
        },
      });

      // Hook up features to packages
      const gigFeatures = await prisma.gigFeature.findMany({
        where: { gigId: gig.id },
      });
      const packages = await prisma.package.findMany({
        where: { gigId: gig.id },
      });
      for (const pkg of packages) {
        await prisma.package.update({
          where: { id: pkg.id },
          data: {
            features: {
              create: gigFeatures.map((feature) => ({
                featureId: feature.id,
                isIncluded: Math.random() < 0.8,
              })),
            },
          },
        });
      }
    }
  }
  console.log("Gigs are fucking live.");

  // 10. Orders, Chats, Messages - 200 orders, 200 chats, ~800 messages
  const gigs = await prisma.gig.findMany();
  for (const gig of gigs) {
    const seller = await prisma.user.findUniqueOrThrow({
      where: { id: gig.sellerId },
    });
    const potentialBuyers = users.filter((user) => user.id !== seller.id);
    for (let i = 0; i < ORDERS_PER_GIG; i++) {
      const buyer = randomElement(potentialBuyers);
      const packages = await prisma.package.findMany({
        where: { gigId: gig.id },
      });
      const pkg = randomElement(packages);
      const status = randomElement([
        "WAITING_FOR_PAYMENT",
        "PENDING",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ] as OrderStatus[]);
      const isCompleted = status === "COMPLETED";
      const deadline = isCompleted
        ? new Date(Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + randomInt(1, 30) * 24 * 60 * 60 * 1000);
      const order = await prisma.order.create({
        data: {
          deadline,
          status,
          packageId: pkg.id,
          buyerId: buyer.id,
          sellerId: seller.id,
          gigId: gig.id,
        },
      });

      // Review if completed - ~100 reviews
      if (isCompleted) {
        await prisma.review.create({
          data: {
            rating: randomInt(1, 5),
            title: `Review for order ${order.id}`,
            description: `This is a fucking review for order ${order.id}`,
            authorId: buyer.id,
            orderId: order.id,
            gigId: gig.id,
          },
        });
      }

      // Chat per order
      const chat = await prisma.chat.create({
        data: {
          buyerId: buyer.id,
          sellerId: seller.id,
          orderId: order.id,
        },
      });

      // Messages in chat
      // System message
      await prisma.message.create({
        data: {
          type: "SYSTEM",
          chatId: chat.id,
          systemContent: {
            create: {
              content: "Welcome to the fucking chat, bro!",
              type: "WELCOME",
            },
          },
        },
      });

      // Text messages
      const senders = [buyer, seller];
      for (let j = 0; j < MESSAGES_PER_CHAT - 1; j++) {
        const sender = senders[j % 2];
        await prisma.message.create({
          data: {
            type: "TEXT",
            chatId: chat.id,
            textContent: {
              create: {
                text: `Message ${j + 1} from ${sender.username}, fuck yeah`,
                userMessage: {
                  create: {
                    userId: sender.id,
                  },
                },
              },
            },
          },
        });
      }
    }
  }
  console.log("Orders, chats, and messages fucking done.");

  // 11. Notifications - ~75 of these shits
  for (const user of users) {
    const numNotifications = randomInt(1, 2);
    await Promise.all(
      Array.from({ length: numNotifications }, () =>
        prisma.notification.create({
          data: {
            type: randomElement([
              "ORDER_UPDATE",
              "MESSAGE",
              "PAYMENT",
              "SYSTEM",
              "REVIEW",
            ]),
            title: `Notification for ${user.username}`,
            description: `Fucking update for ${user.username}`,
            recipientId: user.id,
          },
        })
      )
    );
  }
  console.log("Notifications fucking sent.");

  // 12. Badge Progress - ~37 progress records
  for (const user of users) {
    if (Math.random() < 0.5) {
      const numBadges = randomInt(1, 2);
      const userBadges = shuffleArray(badges).slice(0, numBadges);
      await Promise.all(
        userBadges.map((badge) =>
          prisma.userBadgeProgress.create({
            data: {
              userId: user.id,
              badgeId: badge.id,
              currentProgress: randomInt(0, 50),
              highestTier: randomElement(["NONE", "BRONZE", "SILVER", "GOLD"]),
            },
          })
        )
      );
    }
  }
  console.log("Badge progress fucking assigned.");

  console.log("Seeding fucking completed, bro!");
}

main()
  .catch((e) => {
    console.error("Shit hit the fan:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
