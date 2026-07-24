import { TestimonialStatus } from '@prisma/client';
import { testimonialRepository } from '../repositories/testimonial.repository';
import { AppError } from '../utils/AppError';
import { CreateTestimonialInput, TestimonialQueryInput } from '../schemas/testimonial.schema';
import { PaginatedResponse, Testimonial } from '../types/index';

// ─── Testimonial Service ──────────────────────────────────────────────────────
// All business logic for testimonial operations.

export const testimonialService = {
  /**
   * Submit a new testimonial.
   * Status is always set to PENDING on creation — admin must approve.
   */
  submit: async (
    input: CreateTestimonialInput,
    profileImageUrl?: string
  ) => {
    return testimonialRepository.create({
      customerName: input.customerName,
      email: input.email,
      company: input.company,
      message: input.message,
      rating: input.rating,
      profileImageUrl,
      consentGiven: input.consentGiven,
    });
  },

  /**
   * Fetch all approved testimonials for the public wall and widget.
   */
  getApproved: async () => {
    return testimonialRepository.findAllApproved();
  },

  /**
   * Fetch all testimonials for admin with full filtering/sorting/pagination.
   */
  getAllForAdmin: async (
    query: TestimonialQueryInput
  ): Promise<PaginatedResponse<Testimonial>> => {
    const { testimonials, total } = await testimonialRepository.findAllForAdmin(query);
    const { page, limit } = query;
    const totalPages = Math.ceil(total / limit);

    return {
      data: testimonials as Testimonial[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  },

  /**
   * Get a single testimonial by ID. Throws 404 if not found.
   */
  getById: async (id: string) => {
    const testimonial = await testimonialRepository.findById(id);
    if (!testimonial) {
      throw new AppError('Testimonial not found.', 404);
    }
    return testimonial;
  },

  /**
   * Approve a testimonial. Throws 404 if not found.
   */
  approve: async (id: string) => {
    await testimonialService.getById(id); // validates existence first
    return testimonialRepository.updateStatus(id, TestimonialStatus.APPROVED);
  },

  /**
   * Reject a testimonial. Throws 404 if not found.
   */
  reject: async (id: string) => {
    await testimonialService.getById(id); // validates existence first
    return testimonialRepository.updateStatus(id, TestimonialStatus.REJECTED);
  },

  /**
   * Permanently delete a testimonial. Throws 404 if not found.
   */
  delete: async (id: string) => {
    await testimonialService.getById(id); // validates existence first
    return testimonialRepository.delete(id);
  },

  /**
   * Get aggregate stats for the admin dashboard.
   */
  getStats: async () => {
    return testimonialRepository.getStats();
  },
};
