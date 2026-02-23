/**
 * Standardized API Error Codes
 * Used for consistent error handling and frontend error resolution
 */

const ERROR_CODES = {
  // Validation Errors (4000-4099)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  PASSWORD_TOO_WEAK: 'PASSWORD_TOO_WEAK',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_INPUT_FORMAT: 'INVALID_INPUT_FORMAT',

  // Authentication Errors (4100-4199)
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NO_TOKEN_PROVIDED: 'NO_TOKEN_PROVIDED',

  // Resource Errors (4200-4299)
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  QUESTION_NOT_FOUND: 'QUESTION_NOT_FOUND',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',

  // Conflict Errors (4300-4399)
  DUPLICATE_RESOURCE: 'DUPLICATE_RESOURCE',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  EMAIL_ALREADY_REGISTERED: 'EMAIL_ALREADY_REGISTERED',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',

  // Forbidden Errors (4400-4499)
  FORBIDDEN: 'FORBIDDEN',
  ACCESS_DENIED: 'ACCESS_DENIED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',

  // Database Errors (5000-5099)
  DATABASE_ERROR: 'DATABASE_ERROR',
  DATABASE_CONNECTION_ERROR: 'DATABASE_CONNECTION_ERROR',
  QUERY_ERROR: 'QUERY_ERROR',

  // Server Errors (5100-5199)
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',

  // File Upload Errors (4500-4599)
  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',

  // Rate Limiting Errors (4600-4699)
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
};

/**
 * HTTP Status Code Mapping for Error Codes
 */
const ERROR_STATUS_CODES = {
  VALIDATION_ERROR: 400,
  INVALID_EMAIL: 400,
  INVALID_PASSWORD: 400,
  PASSWORD_TOO_WEAK: 400,
  MISSING_REQUIRED_FIELD: 400,
  INVALID_INPUT_FORMAT: 400,

  AUTHENTICATION_FAILED: 401,
  INVALID_CREDENTIALS: 401,
  TOKEN_EXPIRED: 401,
  TOKEN_INVALID: 401,
  NO_TOKEN_PROVIDED: 401,

  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  ACCESS_DENIED: 403,
  INSUFFICIENT_PERMISSIONS: 403,

  RESOURCE_NOT_FOUND: 404,
  USER_NOT_FOUND: 404,
  QUESTION_NOT_FOUND: 404,
  SESSION_NOT_FOUND: 404,

  DUPLICATE_RESOURCE: 409,
  USER_ALREADY_EXISTS: 409,
  EMAIL_ALREADY_REGISTERED: 409,
  DUPLICATE_ENTRY: 409,

  FILE_UPLOAD_ERROR: 400,
  INVALID_FILE_TYPE: 400,
  FILE_TOO_LARGE: 413,

  RATE_LIMIT_EXCEEDED: 429,
  TOO_MANY_REQUESTS: 429,

  DATABASE_ERROR: 500,
  DATABASE_CONNECTION_ERROR: 503,
  QUERY_ERROR: 500,

  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  EXTERNAL_SERVICE_ERROR: 502,
};

/**
 * User-Friendly Error Messages
 */
const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Validation failed. Please check your input.',
  INVALID_EMAIL: 'Please provide a valid email address.',
  INVALID_PASSWORD: 'Password does not meet security requirements.',
  PASSWORD_TOO_WEAK: 'Password is too weak. Please use a stronger password.',
  MISSING_REQUIRED_FIELD: 'Required field is missing.',
  INVALID_INPUT_FORMAT: 'Invalid input format provided.',

  AUTHENTICATION_FAILED: 'Authentication failed. Please try again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  TOKEN_INVALID: 'Invalid authentication token.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NO_TOKEN_PROVIDED: 'Authentication token is required.',

  FORBIDDEN: 'Access forbidden.',
  ACCESS_DENIED: 'You do not have permission to access this resource.',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions for this action.',

  RESOURCE_NOT_FOUND: 'The requested resource was not found.',
  USER_NOT_FOUND: 'User not found.',
  QUESTION_NOT_FOUND: 'Question not found.',
  SESSION_NOT_FOUND: 'Session not found.',

  DUPLICATE_RESOURCE: 'This resource already exists.',
  USER_ALREADY_EXISTS: 'User already exists.',
  EMAIL_ALREADY_REGISTERED: 'Email is already registered.',
  DUPLICATE_ENTRY: 'Duplicate entry detected.',

  FILE_UPLOAD_ERROR: 'File upload failed. Please try again.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a supported file.',
  FILE_TOO_LARGE: 'File is too large. Maximum size is 5MB.',

  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
  TOO_MANY_REQUESTS: 'Too many requests. Please wait before trying again.',

  DATABASE_ERROR: 'Database error occurred. Please try again later.',
  DATABASE_CONNECTION_ERROR: 'Unable to connect to database. Please try again.',
  QUERY_ERROR: 'Database query failed. Please try again.',

  INTERNAL_SERVER_ERROR: 'An internal server error occurred. Please try again later.',
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable. Please try again later.',
  EXTERNAL_SERVICE_ERROR: 'External service error. Please try again later.',
};

module.exports = {
  ERROR_CODES,
  ERROR_STATUS_CODES,
  ERROR_MESSAGES,
};
