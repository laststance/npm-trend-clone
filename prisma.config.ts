import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load .env file
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use direct (unpooled) connection for migrations
    // This is required because Prisma Migrate needs a direct connection
    url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL!,
  },
});
