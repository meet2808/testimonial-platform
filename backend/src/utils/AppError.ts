// ─── Custom Application Error ─────────────────────────────────────────────────
// Extends the native Error class to carry an HTTP status code and a flag that
// distinguishes operational errors (expected, user-facing) from programmer
// errors (unexpected crashes).
//
// Usage:
//   throw new AppError('Testimonial not found', 404);
//   throw new AppError('Invalid credentials', 401);

export class AppError extends Error {
  public readonly statusCode: number;

  // isOperational = true  → we caused this intentionally (e.g., 404, 400)
  // isOperational = false → unexpected crash (e.g., DB is down)
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);

    // Captures the stack trace, excluding the constructor call itself
    Error.captureStackTrace(this, this.constructor);
  }
}
