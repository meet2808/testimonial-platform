import { z } from 'zod';

// ─── Testimonial Submission Schema ────────────────────────────────────────────
// Used to validate the body of POST /api/v1/testimonials.
// Note: profileImage is handled separately by Multer middleware, so it is not
// included here. The file validation (type, size) happens in upload.middleware.

export const createTestimonialSchema = z.object({
  customerName: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),

  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please provide a valid email address')
    .max(255, 'Email must not exceed 255 characters'),

  company: z
    .string({ required_error: 'Company is required' })
    .trim()
    .min(1, 'Company is required')
    .max(100, 'Company must not exceed 100 characters'),

  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must not exceed 1000 characters'),

  rating: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .pipe(
      z
        .number({ required_error: 'Rating is required' })
        .int('Rating must be a whole number')
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating must not exceed 5')
    ),

  consentGiven: z
    .union([z.boolean(), z.string()])
    .transform((val) => {
      if (typeof val === 'string') return val === 'true';
      return val;
    })
    .pipe(z.boolean().refine((val) => val === true, 'You must give consent to submit a testimonial')),

  honeypot: z.string().optional(),
});

// ─── Admin Testimonial List Query Schema ──────────────────────────────────────
export const testimonialQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().min(1, 'Page must be at least 1')),

  limit: z
    .string()
    .optional()
    .transform((val) => {
      const n = val ? parseInt(val, 10) : 10;
      return n;
    })
    .pipe(z.number().refine((val) => [10, 25, 50].includes(val), 'Limit must be 10, 25, or 50')),

  status: z
    .enum(['ALL', 'PENDING', 'APPROVED', 'REJECTED'])
    .optional()
    .default('ALL'),

  search: z.string().trim().optional(),

  sortBy: z.enum(['submittedAt', 'rating']).optional().default('submittedAt'),

  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type TestimonialQueryInput = z.infer<typeof testimonialQuerySchema>;
