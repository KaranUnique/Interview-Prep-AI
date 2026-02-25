const { ApiError, ErrorResponse } = require('../utils/apiResponse');
const { ERROR_CODES } = require('../utils/errorCodes');

/**
 * Global Error Handling Middleware
 * Catches all errors and formats them consistently
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  };

  console.error('Error:', errorLog);

  // If it's already an ApiError, use it directly
  if (err instanceof ApiError) {
    const errorResponse = new ErrorResponse(
      err.errorCode,
      err.statusCode,
      err.message,
      process.env.NODE_ENV === 'development' ? err.details : undefined
    );
    return res.status(err.statusCode).json(errorResponse);
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
    }));
    const errorResponse = new ErrorResponse(
      ERROR_CODES.VALIDATION_ERROR,
      400,
      'Validation failed',
      details
    );
    return res.status(400).json(errorResponse);
  }

  // Handle Mongoose CastError
  if (err.name === 'CastError') {
    const errorResponse = new ErrorResponse(
      ERROR_CODES.INVALID_INPUT_FORMAT,
      400,
      'Invalid ID format'
    );
    return res.status(400).json(errorResponse);
  }

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const errorResponse = new ErrorResponse(
      ERROR_CODES.DUPLICATE_RESOURCE,
      409,
      `${field} already exists`,
      { field }
    );
    return res.status(409).json(errorResponse);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    const errorResponse = new ErrorResponse(
      ERROR_CODES.TOKEN_INVALID,
      401,
      'Invalid authentication token'
    );
    return res.status(401).json(errorResponse);
  }

  if (err.name === 'TokenExpiredError') {
    const errorResponse = new ErrorResponse(
      ERROR_CODES.TOKEN_EXPIRED,
      401,
      'Your session has expired. Please log in again.'
    );
    return res.status(401).json(errorResponse);
  }

  // Handle multer errors (file upload)
  if (err.name === 'MulterError') {
    let errorCode = ERROR_CODES.FILE_UPLOAD_ERROR;
    let message = 'File upload failed';
    let statusCode = 400;

    if (err.code === 'LIMIT_FILE_SIZE') {
      errorCode = ERROR_CODES.FILE_TOO_LARGE;
      message = 'File is too large';
      statusCode = 413;
    } else if (err.code === 'LIMIT_PART_COUNT') {
      errorCode = ERROR_CODES.FILE_UPLOAD_ERROR;
      message = 'Too many file parts';
    }

    const errorResponse = new ErrorResponse(errorCode, statusCode, message);
    return res.status(statusCode).json(errorResponse);
  }

  // Default to internal server error
  const errorResponse = new ErrorResponse(
    ERROR_CODES.INTERNAL_SERVER_ERROR,
    500,
    'Internal server error',
    process.env.NODE_ENV === 'development' ? err.message : undefined
  );

  res.status(500).json(errorResponse);
};

/**
 * Async Error Wrapper
 * Wraps async route handlers to catch errors and pass to error handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  asyncHandler,
};
