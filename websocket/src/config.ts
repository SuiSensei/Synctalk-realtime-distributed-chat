import dotenv from "dotenv";
dotenv.config();

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) {
    console.error(`❌ Missing required env var: ${key}`);
    process.exit(1);
  }
  return val;
}

export const config = {
  port: parseInt(process.env.PORT || "8000", 10),
  supabaseUrl: requireEnv("SUPABASE_URL"),
  supabaseServiceRoleKey: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  redisUrl: requireEnv("REDIS_URL"),
};
