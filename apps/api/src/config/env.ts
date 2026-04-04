import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(8),
  JWT_REFRESH_SECRET: z.string().min(8),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  SUPABASE_BUCKET_NAME: z.string().default("documents"),
  REDIS_URL: z.string().url().default("redis://localhost:6379"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  process.exit(1);
}

export const env = _env.data;
