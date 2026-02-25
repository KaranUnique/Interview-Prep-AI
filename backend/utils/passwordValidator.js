const zxcvbn = require('zxcvbn');

/**
 * Password Policy Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */

const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: /[A-Z]/,
  requireLowercase: /[a-z]/,
  requireNumbers: /[0-9]/,
  requireSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
};

/**
 * Validate password against policy requirements
 * @param {string} password - The password to validate
 * @returns {object} Validation result with success flag and detailed errors
 */
const validatePasswordPolicy = (password) => {
  const errors = [];

  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`);
  }

  if (!PASSWORD_REQUIREMENTS.requireUppercase.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!PASSWORD_REQUIREMENTS.requireLowercase.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!PASSWORD_REQUIREMENTS.requireNumbers.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!PASSWORD_REQUIREMENTS.requireSpecialChar.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*()_+-)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Check password strength using zxcvbn
 * @param {string} password - The password to check
 * @returns {object} Strength result with score and feedback
 */
const checkPasswordStrength = (password) => {
  const result = zxcvbn(password);

  return {
    score: result.score, // 0-4 (0: Very Weak, 1: Weak, 2: Fair, 3: Good, 4: Strong)
    feedback: result.feedback,
    crackTime: result.crack_times_display,
  };
};

/**
 * Comprehensive password validation
 * @param {string} password - The password to validate
 * @returns {object} Complete validation result
 */
const validatePassword = (password) => {
  // Check if password is provided
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      policyValidation: { isValid: false, errors: ['Password is required'] },
      strengthValidation: null,
    };
  }

  // Validate against policy requirements
  const policyValidation = validatePasswordPolicy(password);

  // Check password strength using zxcvbn
  const strengthValidation = checkPasswordStrength(password);

  // Password is only valid if it passes policy AND has strength score >= 2
  const isValid = policyValidation.isValid && strengthValidation.score >= 2;

  return {
    isValid,
    policyValidation,
    strengthValidation,
  };
};

module.exports = {
  validatePassword,
  validatePasswordPolicy,
  checkPasswordStrength,
  PASSWORD_REQUIREMENTS,
};
