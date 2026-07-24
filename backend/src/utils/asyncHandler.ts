import { Request, Response, NextFunction, RequestHandler } from 'express';

// ─── Async Handler Wrapper ────────────────────────────────────────────────────
// Wraps an async route handler so any thrown error (or rejected promise) is
// automatically forwarded to Express's next(error) — eliminating the need for
// try/catch blocks in every controller method.
//
// Usage:
//   router.get('/route', asyncHandler(async (req, res) => {
//     const data = await someAsyncOperation();  // errors caught automatically
//     res.json(data);
//   }));

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};
