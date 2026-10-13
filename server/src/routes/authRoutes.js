import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Strict rate limiter for authentication endpoints to prevent brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per window
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication Routes
router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.get('/me', requireAuth, getCurrentUser);
router.post('/logout', logoutUser);

export default router;
