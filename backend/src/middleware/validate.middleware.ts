import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { sendError } from '../utils/response';

// ─── Zod Validation Middleware Factory ────────────────────────────────────────
// Returns an Express middleware that validates req.body, req.query, or req.params
// against the provided Zod schema.
//
// Usage:
//   router.post('/submit', validate(createTestimonialSchema), handler);
//
// On failure: returns 400 with the first validation error message.
// On success: calls next() and attaches parsed/transformed data back to the request.

type RequestPart = 'body' | 'query' | 'params';

export const validate = (
  schema: AnyZodObject,
  part: RequestPart = 'body'
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req[part]);

      // Replace the request part with the parsed/coerced/transformed data
      req[part] = parsed;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.errors[0];
        sendError(
          res,
          firstError.message,
          `Validation failed at: ${firstError.path.join('.')}`,
          400
        );
        return;
      }
      next(error);
    }
  };
};
