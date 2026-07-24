import prisma from '../config/prisma';
import { Admin } from '../types/index';

// ─── Admin Repository ─────────────────────────────────────────────────────────
// Responsible for all database operations related to the Admin entity.
// Services call this layer — they never import Prisma directly.

export const adminRepository = {
  /**
   * Find an admin by their email address.
   * Returns the full record including the hashed password (needed for bcrypt compare).
   */
  findByEmail: async (email: string) => {
    return prisma.admin.findUnique({
      where: { email },
    });
  },

  /**
   * Find an admin by their ID.
   * Returns the record without the password (for session verification).
   */
  findById: async (id: string): Promise<Omit<Admin, 'password'> | null> => {
    return prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
  },
};
