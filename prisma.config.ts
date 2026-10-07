import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Commands that connect to PostgreSQL require DATABASE_URL in .env.
    // An empty fallback lets schema validation and client generation run offline.
    url: process.env.DATABASE_URL ?? "",
  },
});
