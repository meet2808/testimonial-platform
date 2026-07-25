import { Request, Response } from 'express';
import fs from 'fs';
import { testimonialService } from '../services/testimonial.service';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import config from '../config/app.config';



// ─── Helper: Build image URL ──────────────────────────────────────────────────
// Uploads file to Supabase Storage bucket and returns the Supabase CDN URL.
// Fallback: Local server image URL if SUPABASE_BUCKET_URL is not set.
const buildImageUrl = async (req: Request, file: Express.Multer.File): Promise<string> => {
  const filename = file.filename;

  // 1. If Supabase Bucket URL is configured in .env
  if (config.upload.supabaseBucketUrl) {
    const bucketBase = config.upload.supabaseBucketUrl.replace(/\/$/, '');
    const cdnUrl = `${bucketBase}/${filename}`;

    // Extract project URL and bucket name automatically for upload
    const parts = bucketBase.split('/storage/v1/object/public/');
    const projectUrl = config.upload.supabaseUrl || (parts[0] ? parts[0] : '');
    const bucketName = parts[1] ? parts[1].split('/')[0] : 'testimonials';
    const apiKey = config.upload.supabaseKey;

    if (projectUrl && apiKey) {
      try {
        console.log(`📤 Uploading image "${filename}" to Supabase Storage bucket: "${bucketName}"...`);
        const fileBuffer = fs.readFileSync(file.path);
        const endpoint = `${projectUrl.replace(/\/$/, '')}/storage/v1/object/${bucketName}/${filename}`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'apikey': apiKey,
            'Content-Type': file.mimetype,
            'x-upsert': 'true',
          },
          body: fileBuffer,
        });

        if (response.ok) {
          console.log('✅ Image binary uploaded successfully to Supabase Storage bucket!');
        } else {
          const errText = await response.text();
          console.warn(`⚠️ Supabase Storage HTTP ${response.status} notice:`, errText);
        }
      } catch (err: any) {
        console.error('❌ Supabase Storage upload exception:', err?.message ?? err);
      }
    } else {
      console.warn('ℹ️ SUPABASE_BUCKET_URL configured without API key. Serving via Supabase CDN URL.');
    }

    console.log('🌐 Saved Supabase Public CDN URL:', cdnUrl);
    return cdnUrl;
  }

  // 2. Fallback: Local Server URL
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
    // ── Honeypot Anti-Spam Check ──
    // If the hidden honeypot field is filled out, a bot submitted the form.
    // Silently return success so the bot thinks it succeeded, without saving anything to the DB.
    if (req.body.honeypot && typeof req.body.honeypot === 'string' && req.body.honeypot.trim() !== '') {
      sendSuccess(
        res,
        'Your testimonial has been submitted successfully! It will be visible after review.',
        undefined,
        201
      );
      return;
    }

    let profileImageUrl: string | undefined;

    if (req.file) {
      profileImageUrl = await buildImageUrl(req, req.file);
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
