/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/app.config';
import { sendError } from '../utils/response';

// ─── JWT Payload Shape ────────────────────────────────────────────────────────
interface JwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

// ─── Auth Middleware ──────────────────────────────────────────────────────────
// Protects admin routes by verifying the JWT stored in the HttpOnly cookie.
// On success: attaches admin data to req.admin and calls next().
// On failure: returns 401 Unauthorized.

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.token as string | undefined;

  if (!token) {
    sendError(res, 'Access denied. Please log in.', 'No token provided', 401);
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    req.admin = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    sendError(res, 'Session expired or invalid. Please log in again.', 'Invalid token', 401);
  }
};
