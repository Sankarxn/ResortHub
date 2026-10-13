import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const COOKIE_NAME = 'resorthub_jwt';

/**
 * Signs a JWT with user id and role
 */
export const signToken = (user) => {
  const secret = process.env.JWT_SECRET || 'fallback_development_secret_only';
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    secret,
    { expiresIn: '7d' }
  );
};

/**
 * Standard cookie configuration
 */
export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  };
};

/**
 * Middleware: Verify JWT from HttpOnly cookie or Authorization Bearer header
 */
export const requireAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.[COOKIE_NAME];

    // Fallback to Bearer authorization header if present
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in to continue.',
      });
    }

    const secret = process.env.JWT_SECRET || 'fallback_development_secret_only';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User session not found or has been revoked.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please sign in again.',
    });
  }
};

/**
 * Middleware: Require administrator role
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Administrator privileges required to perform this action.',
    });
  }
  next();
};
