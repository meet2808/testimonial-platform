import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import testimonialRoutes from './testimonial.routes';
import { sendSuccess } from '../utils/response';

const router = Router();

// ─── Health Check ─────────────────────────────────────────────────────────────
router.get('/health', (_req: Request, res: Response) => {
  sendSuccess(res, 'Testimonial Platform API is running.', {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? 'development',
  });
});

// ─── Mount Feature Routes ─────────────────────────────────────────────────────
router.use('/auth', authRoutes);
router.use('/testimonials', testimonialRoutes);

export default router;
