const { ERROR_STATUS_CODES, ERROR_MESSAGES } = require('./errorCodes');

/**
 * Custom API Error Class
 * Extends Error to include error code, status code, and details
 */
class ApiError extends Error {
  constructor(errorCode, message = null, statusCode = null, details = null) {
    super(message);
    this.errorCode = errorCode;
    this.message = message || ERROR_MESSAGES[errorCode] || 'An error occurred.';
    this.statusCode = statusCode || ERROR_STATUS_CODES[errorCode] || 500;
    this.details = details;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Success Response Format
 */
class ApiResponse {
  constructor(data, message = 'Success', statusCode = 200) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Error Response Format
 */
class ErrorResponse {
  constructor(errorCode, statusCode = null, message = null, details = null) {
    this.success = false;
    this.errorCode = errorCode;
    this.statusCode = statusCode || ERROR_STATUS_CODES[errorCode] || 500;
    this.message = message || ERROR_MESSAGES[errorCode] || 'An error occurred.';
    if (details) {
      this.details = details;
    }
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Utility function to send success response
 */
const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json(new ApiResponse(data, message, statusCode));
};

/**
 * Utility function to send error response
 */
const sendError = (res, errorCode, statusCode = null, message = null, details = null) => {
  const errorResponse = new ErrorResponse(errorCode, statusCode, message, details);
  return res.status(errorResponse.statusCode).json(errorResponse);
};

/**
 * Utility to throw API error
 */
const throwError = (errorCode, message = null, details = null) => {
  throw new ApiError(errorCode, message, null, details);
};

module.exports = {
  ApiError,
  ApiResponse,
  ErrorResponse,
  sendSuccess,
  sendError,
  throwError,
};
