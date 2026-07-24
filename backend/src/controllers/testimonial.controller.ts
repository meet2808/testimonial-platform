import { Request, Response } from 'express';
import { testimonialService } from '../services/testimonial.service';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import config from '../config/app.config';


// ─── Helper: Build image URL ──────────────────────────────────────────────────
// Converts a local filename to a full URL that the frontend can use.
const buildImageUrl = (req: Request, filename: string): string => {
  const protocol = req.protocol;
  const rawHost = req.get('host');
  const host = Array.isArray(rawHost)
    ? rawHost[0]
    : rawHost ?? `localhost:${config.server.port}`;
  return `${protocol}://${host}/api/v1/uploads/${filename}`;
};

// ─── Testimonial Controller ───────────────────────────────────────────────────

export const testimonialController = {
  /**
   * POST /api/v1/testimonials
   * Public — submit a new testimonial.
   */
  submit: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    let profileImageUrl: string | undefined;

    if (req.file) {
      profileImageUrl = buildImageUrl(req, req.file.filename);
    }

    const testimonial = await testimonialService.submit(req.body, profileImageUrl);

    sendSuccess(
      res,
      'Your testimonial has been submitted successfully! It will be visible after review.',
      testimonial,
      201
    );
  }),

  /**
   * GET /api/v1/testimonials/public
   * Public — fetch all approved testimonials for the public wall.
   */
  getPublic: asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const testimonials = await testimonialService.getApproved();
    sendSuccess(res, 'Approved testimonials fetched successfully.', testimonials);
  }),

  /**
   * GET /api/v1/testimonials/widget
   * Public (open CORS) — same data as /public, dedicated for widget embed.
   */
  getWidget: asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const testimonials = await testimonialService.getApproved();
    sendSuccess(res, 'Widget testimonials fetched successfully.', testimonials);
  }),

  /**
   * GET /api/v1/admin/testimonials
   * Admin — fetch all testimonials with filter/search/sort/pagination.
   */
  getAllAdmin: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await testimonialService.getAllForAdmin(req.query as never);
    sendSuccess(res, 'Testimonials fetched successfully.', result);
  }),

  /**
   * GET /api/v1/admin/testimonials/:id
   * Admin — fetch a single testimonial's full detail.
   */
  getOne: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const testimonial = await testimonialService.getById(String(req.params.id));
    sendSuccess(res, 'Testimonial fetched successfully.', testimonial);
  }),

  /**
   * PATCH /api/v1/admin/testimonials/:id/approve
   * Admin — approve a testimonial.
   */
  approve: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const testimonial = await testimonialService.approve(String(req.params.id));
    sendSuccess(res, 'Testimonial approved successfully.', testimonial);
  }),

  /**
   * PATCH /api/v1/admin/testimonials/:id/reject
   * Admin — reject a testimonial.
   */
  reject: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const testimonial = await testimonialService.reject(String(req.params.id));
    sendSuccess(res, 'Testimonial rejected successfully.', testimonial);
  }),

  /**
   * DELETE /api/v1/admin/testimonials/:id
   * Admin — permanently delete a testimonial.
   */
  remove: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await testimonialService.delete(String(req.params.id));
    sendSuccess(res, 'Testimonial deleted successfully.');
  }),

  /**
   * GET /api/v1/admin/stats
   * Admin — get dashboard statistics.
   */
  getStats: asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const stats = await testimonialService.getStats();
    sendSuccess(res, 'Stats fetched successfully.', stats);
  }),
};
