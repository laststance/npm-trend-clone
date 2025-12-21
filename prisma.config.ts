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
    // Use DATABASE_URL for db push (works with pooled connections)
    // Use DATABASE_URL_UNPOOLED for migrate commands (requires direct connection)
    // On Vercel, db push is preferred as pooled connections are more reliable
    url: process.env.DATABASE_URL!,
  },
});
