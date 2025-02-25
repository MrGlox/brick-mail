import crypto from "node:crypto";

import { faker } from "@faker-js/faker";
import { PrismaClient } from "@repo/database";
import { UserRole, UserStatus } from "@repo/database";

// Fonction pour créer un hash avec un salt
export function hashWithSalt(password: string) {
  // Générer un salt aléatoire
  const salt = crypto.randomBytes(16).toString("hex");

  // Créer un hash de mot de passe avec le salt
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  // Retourner le hash et le salt
  return { salt, hash };
}

const prisma = new PrismaClient();

async function main() {
  // Create 100 random users
  let createdUsers = 0;

  for (let i = 0; i < 100; i++) {
    const userPassword = faker.internet.password();

    const { hash, salt } = await hashWithSalt(userPassword);

    const status = faker.helpers.arrayElement([
      UserStatus.ACTIVE,
      UserStatus.PENDING,
      UserStatus.INACTIVE,
      UserStatus.SUSPENDED,
      UserStatus.DELETED,
    ]);

    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: `pwd_${salt}.${hash}`,
        pseudo: faker.internet.email().split("@")[0],
        role: faker.helpers.arrayElement([
          UserRole.USER,
          UserRole.BUILDER,
          UserRole.OWNER,
        ]),
        status,
        preferredLocale: faker.helpers.arrayElement(["fr", "en"]),
        createdAt: faker.date.past(),
        ...(status === UserStatus.ACTIVE ||
        status === UserStatus.SUSPENDED ||
        status === UserStatus.INACTIVE
          ? {
              profile: {
                create: {
                  firstName: faker.person.firstName(),
                  lastName: faker.person.lastName(),
                  birthday: faker.date.birthdate(),
                  bio: faker.lorem.paragraph(),
                  website: faker.internet.url(),
                },
              },
            }
          : {}),
      },
    });
    createdUsers++;
  }

  console.log(`Created ${createdUsers} random users`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
