import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { loginSchema } from '../schemas/auth.schema';

const router = Router();

// POST /api/v1/auth/login — no auth required
router.post('/login', validate(loginSchema), authController.login);

// POST /api/v1/auth/logout — no auth required (just clears the cookie)
router.post('/logout', authController.logout);

// GET /api/v1/auth/me — requires valid JWT cookie
router.get('/me', authenticate, authController.getMe);

export default router;
