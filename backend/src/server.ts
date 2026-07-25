import config from './config/app.config';
import app from './app';
import prisma from './config/prisma';
import { testimonialService } from './services/testimonial.service';

const PORT = config.server.port;

async function startServer(): Promise<void> {
  try {
    // ── Verify database connection before accepting requests ──
    await prisma.$connect();
    console.log('✅ Database connected successfully.');

    // ── Background cleanup check for rejected testimonials > 30 minutes old ──
    try {
      const result = await testimonialService.cleanupExpiredRejected();
      if (result.count > 0) {
        console.log(`🧹 Purged ${result.count} expired rejected testimonial(s) (older than 30 minutes).`);
      }
    } catch (err) {
      console.warn('⚠️ Rejected testimonials cleanup check failed:', err);
    }

    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 Testimonial Platform API');
      console.log(`   Environment: ${config.server.nodeEnv}`);
      console.log(`   Server:      http://localhost:${PORT}`);
      console.log(`   Health:      http://localhost:${PORT}/api/v1/health`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
process.on('SIGTERM', async () => {
  console.log('\n📴 SIGTERM received. Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n📴 SIGINT received. Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

void startServer();
