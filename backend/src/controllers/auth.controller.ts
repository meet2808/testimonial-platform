/// <reference path="../types/express.d.ts" />
import { Request, Response, CookieOptions } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import config from '../config/app.config';

// ─── Cookie Configuration ─────────────────────────────────────────────────────
const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,        // JS cannot access this cookie (XSS protection)
  secure: config.server.isProduction,   // HTTPS only in production
  sameSite: config.server.isProduction ? 'none' : 'strict',          // CSRF protection
  maxAge: 24 * 60 * 60 * 1000,         // 24 hours in milliseconds
  path: '/',
};

// ─── Auth Controller ──────────────────────────────────────────────────────────
// Thin layer — delegates all logic to authService, handles HTTP concerns only.

export const authController = {
  /**
   * POST /api/v1/auth/login
   * Validates credentials, issues JWT in an HttpOnly cookie.
   */
  login: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const token = await authService.login(req.body);

    res.cookie('token', token, COOKIE_OPTIONS);

    sendSuccess(res, 'Login successful.', { token });
  }),

  /**
   * POST /api/v1/auth/logout
   * Clears the JWT cookie, ending the session.
   */
  logout: asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    res.clearCookie('token', { path: '/' });
    sendSuccess(res, 'Logged out successfully.');
  }),

  /**
   * GET /api/v1/auth/me
   * Returns the authenticated admin's profile.
   * Called on app load to restore session without re-login.
   */
  getMe: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // req.admin is guaranteed to exist here — set by authenticate middleware
    const admin = await authService.getMe(req.admin!.id);
    sendSuccess(res, 'Session valid.', admin);
  }),
};
