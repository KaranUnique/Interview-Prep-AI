/**
 * Password strength validator for client-side real-time feedback
 */

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
};

/**
 * Check if password meets each requirement
 * @param {string} password - The password to check
 * @returns {object} Object with boolean flags for each requirement
 */
export const checkPasswordRequirements = (password) => {
  return {
    minLength: password.length >= PASSWORD_REQUIREMENTS.minLength,
    uppercase: PASSWORD_REQUIREMENTS.uppercase.test(password),
    lowercase: PASSWORD_REQUIREMENTS.lowercase.test(password),
    number: PASSWORD_REQUIREMENTS.number.test(password),
    specialChar: PASSWORD_REQUIREMENTS.specialChar.test(password),
  };
};

/**
 * Calculate password strength score (0-5)
 * @param {string} password - The password to evaluate
 * @returns {number} Strength score from 0-5
 */
export const calculatePasswordStrength = (password) => {
  if (!password) return 0;

  const requirements = checkPasswordRequirements(password);
  let score = 0;

  // 1 point for minimum length
  if (requirements.minLength) score++;

  // 1 point for uppercase
  if (requirements.uppercase) score++;

  // 1 point for lowercase
  if (requirements.lowercase) score++;

  // 1 point for numbers
  if (requirements.number) score++;

  // 1 point for special characters
  if (requirements.specialChar) score++;

  // Bonus points for length beyond minimum
  if (password.length >= 12) score += 0.5;
  if (password.length >= 16) score += 0.5;

  return Math.min(score, 5);
};

/**
 * Get password strength label and color
 * @param {number} strength - Strength score from 0-5
 * @returns {object} Object with label and color
 */
export const getStrengthLabel = (strength) => {
  if (strength === 0) return { label: 'No Password', color: 'gray', bgColor: 'bg-gray-200' };
  if (strength < 2) return { label: 'Very Weak', color: 'red', bgColor: 'bg-red-500' };
  if (strength < 3) return { label: 'Weak', color: 'orange', bgColor: 'bg-orange-500' };
  if (strength < 4) return { label: 'Fair', color: 'yellow', bgColor: 'bg-yellow-500' };
  if (strength < 4.5) return { label: 'Good', color: 'lime', bgColor: 'bg-lime-500' };
  return { label: 'Strong', color: 'green', bgColor: 'bg-green-500' };
};

/**
 * Validate password and return all details
 * @param {string} password - The password to validate
 * @returns {object} Complete validation object
 */
export const validatePasswordClient = (password) => {
  const requirements = checkPasswordRequirements(password);
  const strength = calculatePasswordStrength(password);
  const strengthLabel = getStrengthLabel(strength);

  const isValid = Object.values(requirements).every((req) => req === true);

  return {
    isValid,
    requirements,
    strength,
    strengthLabel,
  };
};

/**
 * Format password requirements for display
 * @returns {array} Array of requirement descriptions
 */
export const getPasswordRequirementsText = () => {
  return [
    'At least 8 characters long',
    'At least one uppercase letter (A-Z)',
    'At least one lowercase letter (a-z)',
    'At least one number (0-9)',
    'At least one special character (!@#$%^&*',
  ];
};
