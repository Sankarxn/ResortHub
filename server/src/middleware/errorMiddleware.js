/**
 * Centralized 404 Route Not Found handler
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found at path: ${req.originalUrl}`,
  });
};

/**
 * Global Error Handler
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Server Error:', err);

  // Mongoose CastError (e.g. invalid ObjectId format)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ID format for parameter: ${err.path}`,
    });
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `An account with this ${field} already exists.`,
    });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: messages,
    });
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred.',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
