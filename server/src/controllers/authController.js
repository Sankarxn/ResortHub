import { User } from '../models/User.js';
import { hashPassword, verifyPassword } from '../config/security.js';
import { signToken, getCookieOptions, COOKIE_NAME } from '../middleware/authMiddleware.js';

/**
 * POST /api/auth/register
 * Public registration
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your full name.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide an email address.' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check for duplicate email
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in.',
      });
    }

    // Hash password with Argon2id
    const passwordHash = await hashPassword(password);

    // Create user (strictly default role: 'user', never trust client role input)
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'user',
    });

    // Sign JWT and set HttpOnly cookie
    const token = signToken(newUser);
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * User sign in
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    // Verify password with Argon2id
    const isMatch = await verifyPassword(user.passwordHash, password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    // Sign token and issue HttpOnly cookie
    const token = signToken(user);
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Sign in successful.',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Get current verified user
 */
export const getCurrentUser = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id.toString(),
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  });
};

/**
 * POST /api/auth/logout
 * Sign out and clear HttpOnly cookie
 */
export const logoutUser = (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};
