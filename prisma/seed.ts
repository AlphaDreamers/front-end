import { Prisma, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import argon2 from "argon2";

const prisma = new PrismaClient();

let unique = 0;

async function main() {
  await prisma.review.deleteMany();
  await prisma.order.deleteMany();
  await prisma.packageFeature.deleteMany();
  await prisma.gigFeature.deleteMany();
  await prisma.package.deleteMany();
  await prisma.image.deleteMany();
  await prisma.gig.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.message.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.user.deleteMany();
  await prisma.skill.deleteMany();

  const password = await argon2.hash("test");

  const skills = await Promise.all(
    Array.from({ length: 100 }).map(() =>
      prisma.skill.create({
        data: {
          label: faker.helpers.arrayElement([
            "JavaScript",
            "Python",
            "Java",
            "C++",
            "Ruby",
            "PHP",
            "Swift",
            "Go",
            "Kotlin",
            "Rust",
            "TypeScript",
          ]),
        },
      })
    )
  );

  // Create Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "test@gmail.com",
        username: "testuser",
        password,
        isVerified: true,
        avatar: faker.image.avatar(),
        skills: {
          createMany: {
            data: faker.helpers.arrayElements(skills).map((skill) => ({
              skillId: skill.id,
              level: faker.number.int({ min: 1, max: 5 }),
            })),
          },
        },
      },
    }),
    ...Array.from({ length: 19 }).map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          username: faker.internet.userName(),
          password: faker.internet.password(),
          isVerified: faker.datatype.boolean(),
          avatar: faker.image.avatar(),

          skills: {
            createMany: {
              data: faker.helpers.arrayElements(skills).map((skill) => ({
                skillId: skill.id,
                level: faker.number.int({ min: 1, max: 5 }),
              })),
            },
          },
        },
      })
    ),
  ]);

  // Create Categories
  const categories = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.category.create({
        data: {
          label: faker.commerce.department(),
          slug: `${faker.helpers.slugify(
            faker.commerce.department().toLowerCase()
          )}-${unique++}`,
        },
      })
    )
  );

  // Create Tags
  const tags = await Promise.all(
    Array.from({ length: 20 }).map(() =>
      prisma.tag.create({
        data: {
          label: faker.word.adjective(),
          slug: `${faker.helpers.slugify(faker.word.adjective().toLowerCase())}-${unique++}`,
        },
      })
    )
  );

  // Create Gigs
  const gigs = [];
  for (let i = 0; i < 40; i++) {
    const seller = faker.helpers.arrayElement(users);
    const category = faker.helpers.arrayElement(categories);
    const gigTags = faker.helpers.shuffle(tags).slice(0, 3);

    const gig = await prisma.gig.create({
      data: {
        title: faker.company.catchPhrase(),
        description: faker.lorem.paragraph(),
        sellerId: seller.id,
        categoryId: category.id,
        tags: {
          connect: gigTags.map((t) => ({ id: t.id })),
        },
      },
    });

    // Add images
    await prisma.image.createMany({
      data: Array.from({ length: 3 }).map((_, idx) => ({
        url: faker.image.url(),
        isPrimary: idx === 0,
        gigId: gig.id,
      })),
    });

    // Add features
    const features = await Promise.all(
      Array.from({ length: 4 }).map(() =>
        prisma.gigFeature.create({
          data: {
            label: faker.commerce.productAdjective(),
            gigId: gig.id,
          },
        })
      )
    );

    // Add packages
    for (let j = 0; j < 3; j++) {
      const pack = await prisma.package.create({
        data: {
          title: `Package ${j + 1}`,
          price: Number(faker.commerce.price({ min: 10, max: 100 })),
          revisions: faker.number.int({ min: 1, max: 5 }),
          deliveryTime: faker.number.int({ min: 1, max: 10 }),
          gigId: gig.id,
        },
      });

      await Promise.all(
        features.map((feature) =>
          prisma.packageFeature.create({
            data: {
              featureId: feature.id,
              gigPackageId: pack.id,
              isIncluded: faker.datatype.boolean(),
            },
          })
        )
      );

      // Add Orders
      if (Math.random() < 0.6) {
        const msType =
          Math.random() > 0.7
            ? "TEXT"
            : Math.random() > 0.7
              ? "IMAGES"
              : "FILES";
        const content: Prisma.InputJsonObject =
          msType === "TEXT"
            ? { text: faker.lorem.sentence() }
            : msType === "IMAGES"
              ? {
                  images: Array.from({
                    length: faker.number.int({ min: 1, max: 3 }),
                  }).map(() => faker.image.url()),
                }
              : {
                  files: Array.from({
                    length: faker.number.int({ min: 1, max: 3 }),
                  }).map(() =>
                    faker.helpers.arrayElement([
                      // PDF
                      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                      // DOCX
                      "https://file-examples.com/storage/fe26bbf456999d79702c498/2017/02/file-sample_100kB.docx",
                      // MP4
                      "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
                      // ZIP
                      "https://file-examples.com/storage/fe26bbf456999d79702c498/2017/02/zip_2MB.zip",
                      // CSV
                      "https://people.sc.fsu.edu/~jburkardt/data/csv/airtravel.csv",
                    ])
                  ),
                };
        const msCnt = faker.number.int({ min: 5, max: 50 });
        const readCnt = faker.number.int({ min: 0, max: msCnt });
        const buyer = faker.helpers.arrayElement(users);
        const order = await prisma.order.create({
          data: {
            packageId: pack.id,
            chat: {
              create: {
                sellerId: seller.id,
                buyerId: buyer.id,
                messages: {
                  createMany: {
                    data: Array.from({
                      length: msCnt,
                    }).map((_, i) => ({
                      type: msType,
                      content: content,
                      senderId: faker.helpers.arrayElement([
                        seller.id,
                        buyer.id,
                      ]),
                      isRead: i < readCnt,
                    })),
                  },
                },
              },
            },
          },
        });

        // Add review
        if (Math.random() < 0.7) {
          await prisma.review.create({
            data: {
              rating: faker.number.int({ min: 1, max: 5 }),
              title: faker.lorem.words(3),
              description: faker.lorem.sentences(2),
              orderId: order.id,
              authorId: buyer.id,
              gigId: gig.id,
            },
          });
        }
      }
    }

    gigs.push(gig);
  }

  // Add Bookmarks
  for (const user of users) {
    const bookmarkedGigs = faker.helpers.shuffle(gigs).slice(0, 5);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        bookmarked: {
          connect: bookmarkedGigs.map((g) => ({ id: g.id })),
        },
      },
    });
  }

  console.log("🌱 Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
