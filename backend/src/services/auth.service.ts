import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/app.config';
import { adminRepository } from '../repositories/admin.repository';
import { AppError } from '../utils/AppError';
import { LoginInput } from '../schemas/auth.schema';

// ─── Auth Service ─────────────────────────────────────────────────────────────
// Contains all business logic related to authentication.

export const authService = {
  /**
   * Validates admin credentials and returns a signed JWT on success.
   * Throws AppError with 401 on any failure (deliberately vague message
   * to prevent email enumeration attacks).
   */
  login: async (input: LoginInput): Promise<string> => {
    const { email, password } = input;

    // ── Find admin by email ──
    const admin = await adminRepository.findByEmail(email);
    if (!admin) {
      throw new AppError('Invalid email or password.', 401);
    }

    // ── Compare provided password against stored hash ──
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password.', 401);
    }

    // ── Generate JWT ──
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
    );

    return token;
  },

  /**
   * Verifies an admin's ID and returns their public profile.
   * Used by GET /auth/me to restore session on page refresh.
   */
  getMe: async (adminId: string) => {
    const admin = await adminRepository.findById(adminId);
    if (!admin) {
      throw new AppError('Admin account not found.', 404);
    }
    return admin;
  },
};
