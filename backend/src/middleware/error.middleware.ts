import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/response';
import config from '../config/app.config';

// ─── Global Error Handler Middleware ─────────────────────────────────────────
// Must be the LAST middleware registered in app.ts (after all routes).
// Express identifies error middleware by its 4-argument signature.
//
// Handles:
//   - AppError (our operational errors)
//   - Prisma errors (DB constraint violations, not found, etc.)
//   - Multer errors (file upload issues)
//   - Unknown/unhandled errors

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // ── Log the error in development ──
  if (config.server.isDevelopment) {
    console.error('[Error Handler]', err);
  }

  // ── Our own operational errors ──
  if (err instanceof AppError) {
    sendError(res, err.message, undefined, err.statusCode);
    return;
  }

  // ── Prisma errors ──
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      // Record not found
      sendError(res, 'The requested resource was not found.', undefined, 404);
      return;
    }
    if (err.code === 'P2002') {
      // Unique constraint violation
      sendError(res, 'A record with these details already exists.', undefined, 409);
      return;
    }
    sendError(res, 'A database error occurred.', err.code, 500);
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    sendError(res, 'Invalid data provided to the database.', undefined, 400);
    return;
  }

  // ── Multer file upload errors ──
  if (err.name === 'MulterError') {
    if (err.message.includes('File too large')) {
      sendError(
        res,
        `File size exceeds the ${config.upload.maxFileSizeMb}MB limit.`,
        undefined,
        400
      );
      return;
    }
    sendError(res, err.message, undefined, 400);
    return;
  }

  // ── File filter errors from Multer (thrown in fileFilter callback) ──
  if (err.message.includes('Invalid file type')) {
    sendError(res, err.message, undefined, 400);
    return;
  }

  // ── JWT errors ──
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid authentication token.', undefined, 401);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Your session has expired. Please log in again.', undefined, 401);
    return;
  }

  // ── Unknown / programmer errors — never expose internals ──
  sendError(
    res,
    config.server.isDevelopment
      ? err.message
      : 'An unexpected error occurred. Please try again later.',
    undefined,
    500
  );
};
