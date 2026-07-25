import dotenv from 'dotenv';
dotenv.config();

// ─── Helper ───────────────────────────────────────────────────────────────────
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[Config] Missing required environment variable: "${key}". ` +
        `Check your .env file against .env.example.`
    );
  }
  return value;
}

// ─── Config Object ────────────────────────────────────────────────────────────
// All environment variables are accessed through this object — never via
// process.env directly in application code. This ensures:
//   1. The app fails at startup (not at runtime) if a variable is missing.
//   2. There is one place to look when debugging config issues.
const config = {
  server: {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '5000', 10),
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },
  database: {
    url: requireEnv('DATABASE_URL'),
  },
  jwt: {
    secret: requireEnv('JWT_SECRET'),
    expiresIn: process.env.JWT_EXPIRES_IN ?? '24h',
  },
  cors: {
    origin: requireEnv('CORS_ORIGIN'),
  },
  upload: {
    dir: process.env.UPLOAD_DIR ?? 'uploads',
    maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB ?? '20', 10),
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png'] as string[],
    allowedExtensions: ['.jpg', '.jpeg', '.png'] as string[],
    supabaseBucketUrl: process.env.SUPABASE_BUCKET_URL ?? '',
    supabaseUrl: process.env.SUPABASE_URL ?? '',
    supabaseKey: process.env.SUPABASE_KEY ?? process.env.SUPABASE_ANON_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  },
} as const;

export default config;
