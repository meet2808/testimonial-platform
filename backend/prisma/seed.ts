import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ─── Hardcoded Admin Credentials ─────────────────────────────────────────────
// These credentials are intentionally hardcoded (per project requirements).
// The password is hashed with bcrypt before storage — it is NEVER stored
// in plain text in the database.
//
// To change credentials: update these values, drop the admins table (or delete
// the record), and re-run this seed script with: npm run db:seed

const ADMIN_EMAIL = 'admin@testimonial.com';
const ADMIN_PASSWORD = 'Admin@123456';
const BCRYPT_SALT_ROUNDS = 12;

async function main(): Promise<void> {
  console.log('🌱 Starting database seed...');

  // ── Check if admin already exists (idempotent) ──
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (existingAdmin) {
    console.log(`✅ Admin account already exists: ${ADMIN_EMAIL}`);
    console.log('   Skipping seed. Run "prisma migrate reset" to start fresh.');
    return;
  }

  // ── Hash the password ──
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, BCRYPT_SALT_ROUNDS);

  // ── Create the admin record ──
  const admin = await prisma.admin.create({
    data: {
      email: ADMIN_EMAIL,
      password: hashedPassword,
    },
  });

  console.log(`✅ Admin account created successfully!`);
  console.log(`   ID: ${admin.id}`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Password (plain): ${ADMIN_PASSWORD}`);
  console.log(`   Password (stored): [bcrypt hash]`);
  console.log('');
  console.log('🔐 Use these credentials to log in to the admin dashboard.');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
