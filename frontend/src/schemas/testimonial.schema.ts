import { z } from 'zod';

// ─── Testimonial Submission Schema ─────────────────────────────────────────────
export const createTestimonialSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),

  email: z
    .string()
    .trim()
    .email('Please provide a valid email address'),

  company: z
    .string()
    .trim()
    .min(1, 'Company is required')
    .max(100, 'Company must not exceed 100 characters'),

  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must not exceed 1000 characters'),

  rating: z
    .number({ required_error: 'Please select a rating' })
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must not exceed 5'),

  profileImage: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 20 * 1024 * 1024,
      'Image must not exceed 20MB'
    )
    .refine(
      (file) =>
        !file || ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
      'Only .jpg, .jpeg, and .png files are allowed'
    ),

  consentGiven: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms before submitting',
  }),
});

export type CreateTestimonialFormData = z.infer<typeof createTestimonialSchema>;
