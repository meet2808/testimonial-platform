import { Prisma, TestimonialStatus } from '@prisma/client';
import prisma from '../config/prisma';
import { TestimonialQueryInput } from '../schemas/testimonial.schema';

// ─── Testimonial Repository ───────────────────────────────────────────────────
// All database operations for the Testimonial model.

export const testimonialRepository = {
  /**
   * Create a new testimonial with PENDING status.
   */
  create: async (data: {
    customerName: string;
    email: string;
    company: string;
    message: string;
    rating: number;
    profileImageUrl?: string;
    consentGiven: boolean;
  }) => {
    return prisma.testimonial.create({ data });
  },

  /**
   * Get all approved testimonials for the public wall.
   * Returns a simple list without pagination (UI/UX handles display).
   */
  findAllApproved: async () => {
    return prisma.testimonial.findMany({
      where: { status: 'APPROVED' },
      orderBy: { submittedAt: 'desc' },
    });
  },

  /**
   * Get all testimonials for admin with filtering, searching, sorting, and pagination.
   */
  findAllForAdmin: async (query: TestimonialQueryInput) => {
    const { page, limit, status, search, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    // ── Build the where clause dynamically ──
    const where: Prisma.TestimonialWhereInput = {};

    if (status !== 'ALL') {
      where.status = status as TestimonialStatus;
    }

    if (search && search.trim() !== '') {
      where.OR = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }

    // ── Run count and data queries in parallel for efficiency ──
    const [total, testimonials] = await Promise.all([
      prisma.testimonial.count({ where }),
      prisma.testimonial.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
    ]);

    return { testimonials, total };
  },

  /**
   * Get a single testimonial by ID.
   */
  findById: async (id: string) => {
    return prisma.testimonial.findUnique({ where: { id } });
  },

  /**
   * Update a testimonial's status (approve or reject).
   */
  updateStatus: async (id: string, status: TestimonialStatus) => {
    return prisma.testimonial.update({
      where: { id },
      data: { status },
    });
  },

  /**
   * Permanently delete a testimonial.
   */
  delete: async (id: string) => {
    return prisma.testimonial.delete({ where: { id } });
  },

  /**
   * Get aggregate counts for the admin statistics dashboard.
   */
  getStats: async () => {
    const [total, pending, approved, rejected] = await Promise.all([
      prisma.testimonial.count(),
      prisma.testimonial.count({ where: { status: 'PENDING' } }),
      prisma.testimonial.count({ where: { status: 'APPROVED' } }),
      prisma.testimonial.count({ where: { status: 'REJECTED' } }),
    ]);

    return { total, pending, approved, rejected };
  },
};
