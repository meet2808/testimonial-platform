import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import config from './config/app.config';
import router from './routes/index';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(
  helmet({
    // Relax crossOriginResourcePolicy so images served from /uploads
    // can be loaded by the frontend and widget on a different origin.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Dynamic origin validator: allows configured CORS_ORIGIN, localhost, and Vercel domains.
const isOriginAllowed = (origin?: string): boolean => {
  if (!origin) return true; // Allow requests with no origin (curl, Postman, server-side)
  if (config.cors.origin && (origin === config.cors.origin || config.cors.origin === '*')) return true;
  if (origin.endsWith('.vercel.app')) return true; // Allow Vercel deployments
  if (origin.includes('localhost')) return true;
  return true; // Fallback: allow for public API flexibility
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,          // Required for HttpOnly cookie to be sent cross-origin
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Widget CORS Override ──────────────────────────────────────────────────────
// The widget endpoint must be accessible from any embedding website domain.
app.use(
  '/api/v1/testimonials/widget',
  cors({ origin: true, methods: ['GET', 'OPTIONS'] })
);

// ─── Request Parsing ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── HTTP Request Logging ─────────────────────────────────────────────────────
if (config.server.isDevelopment) {
  app.use(morgan('dev'));
}

// ─── Static Files — Uploaded Images ──────────────────────────────────────────
// Serves the uploads directory so profile images are accessible via URL.
// Example: GET /api/v1/uploads/some-uuid.jpg
const uploadsPath = path.resolve(config.upload.dir);
app.use('/api/v1/uploads', express.static(uploadsPath));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/v1', router);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'The requested route does not exist.',
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Must be LAST middleware registered — Express identifies error middleware
// by the presence of 4 arguments (err, req, res, next).
app.use(errorHandler);

export default app;
