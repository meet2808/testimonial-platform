import { PrismaClient } from '@prisma/client';

// ─── Prisma Singleton ─────────────────────────────────────────────────────────
// A single PrismaClient instance is shared across the entire application.
// Creating multiple instances causes connection pool exhaustion.

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

export default prisma;
