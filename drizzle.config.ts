import type { Config } from "drizzle-kit";
import "dotenv/config";

console.log("DATABASE_URL =", process.env.DATABASE_URL); // ← これ追加

const config: Config = {
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
};

export default config;
