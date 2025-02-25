import fs from "node:fs";
import path from "node:path";

import { PrismaClient } from "@repo/database";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
  // Log queries in development
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

async function seed() {
  // add path for seed files
  const seedFilesPath = path.join(__dirname);

  const seedFiles = fs
    .readdirSync(seedFilesPath)
    .filter((file: string) => file.endsWith(".seed.ts"));

  for (const seedFile of seedFiles) {
    const seedFilePath = path.join(seedFilesPath, seedFile);

    const seedModule = await import(seedFilePath);
    const seedFunction = seedModule.default || seedModule.seedFunction;

    if (typeof seedFunction === "function") {
      await seedFunction();
    } else {
      console.warn(`Warning: No valid seed function found in ${seedFile}`);
    }
  }

  console.log("Seeding completed successfully");
}

seed()
  .catch((error) => {
    console.error("Seeding error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
