import crypto from "node:crypto";

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

// Initialize Prisma client with explicit schema path
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
  // Log queries in development
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@root.com";
  const password = process.env.ADMIN_PASSWORD || "password"; // You should change this password after first login

  const { hash, salt } = await hashWithSalt(password);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: `pwd_${salt}.${hash}`,
      pseudo: "Admin",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      preferredLocale: "fr",
    },
  });

  console.log("Admin user created");
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
