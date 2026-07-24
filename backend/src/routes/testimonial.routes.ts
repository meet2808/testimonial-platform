import { Router } from 'express';
import { testimonialController } from '../controllers/testimonial.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { upload } from '../middleware/upload.middleware';
import {
  createTestimonialSchema,
  testimonialQuerySchema,
} from '../schemas/testimonial.schema';

const router = Router();

// ─── Public Routes ────────────────────────────────────────────────────────────

// POST /api/v1/testimonials — submit a new testimonial (with optional image)
router.post(
  '/',
  upload.single('profileImage'),        // Handle file upload first
  validate(createTestimonialSchema),    // Then validate the text fields
  testimonialController.submit
);

// GET /api/v1/testimonials/public — approved testimonials for the public wall
router.get('/public', testimonialController.getPublic);

// GET /api/v1/testimonials/widget — approved testimonials for the embeddable widget
router.get('/widget', testimonialController.getWidget);

// ─── Admin Routes (All Protected) ────────────────────────────────────────────

// GET /api/v1/admin/testimonials — list all with filter/search/sort/pagination
router.get(
  '/admin',
  authenticate,
  validate(testimonialQuerySchema, 'query'),
  testimonialController.getAllAdmin
);

// GET /api/v1/admin/testimonials/stats — dashboard statistics
router.get('/admin/stats', authenticate, testimonialController.getStats);

// GET /api/v1/admin/testimonials/:id — single testimonial detail
router.get('/admin/:id', authenticate, testimonialController.getOne);

// PATCH /api/v1/admin/testimonials/:id/approve
router.patch('/admin/:id/approve', authenticate, testimonialController.approve);

// PATCH /api/v1/admin/testimonials/:id/reject
router.patch('/admin/:id/reject', authenticate, testimonialController.reject);

// DELETE /api/v1/admin/testimonials/:id
router.delete('/admin/:id', authenticate, testimonialController.remove);

export default router;
