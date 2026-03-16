import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const TEST_USER = {
  email: "test@example.com",
  password: "testpassword123",
  name: "Test User",
} as const;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },
});

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: TEST_USER.email },
  });

  if (existing) {
    console.log(`⏭️  Seed user already exists: ${TEST_USER.email}`);
    return;
  }

  await auth.api.signUpEmail({
    body: {
      email: TEST_USER.email,
      password: TEST_USER.password,
      name: TEST_USER.name,
    },
  });

  console.log(`✅ Seed user created: ${TEST_USER.email}`);
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
