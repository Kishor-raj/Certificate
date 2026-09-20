/**
 * Validation Utility
 *
 * Validates the certificate form fields before PDF generation.
 * Returns structured error objects for display in the UI.
 *
 * Note: There is no separate prefix field.
 * The user types their full titled name (e.g. "Dr. S. Dinesh").
 */

import { VALIDATION } from '../config/certificateConfig.js';

/**
 * Trim and validate a single string field.
 *
 * @param {string} value - Raw field value.
 * @param {string} fieldKey - Key in VALIDATION config.
 * @returns {{ value: string, error: string|null }}
 */
function validateStringField(value, fieldKey) {
  const config = VALIDATION[fieldKey];
  const trimmed = (value || '').trim();

  if (config.required && !trimmed) {
    return { value: trimmed, error: `${config.label} is required.` };
  }

  if (trimmed.length > config.maxLength) {
    return {
      value: trimmed,
      error: `${config.label} must be ${config.maxLength} characters or fewer (currently ${trimmed.length}).`,
    };
  }

  return { value: trimmed, error: null };
}

/**
 * Validate all certificate form fields.
 *
 * @param {object} formData - Raw form state: { certificateId, recipientName, affiliation, paperTitle }.
 * @returns {{ isValid: boolean, errors: object, sanitized: object }}
 */
export function validateCertificateForm(formData) {
  const errors = {};
  const sanitized = {};

  // Validate certificateId
  const idResult = validateStringField(formData.certificateId, 'certificateId');
  errors.certificateId = idResult.error;
  sanitized.certificateId = idResult.value;

  // Validate recipientName (full titled name, e.g. "Dr. Jane Smith")
  const nameResult = validateStringField(formData.recipientName, 'recipientName');
  errors.recipientName = nameResult.error;
  sanitized.recipientName = nameResult.value;

  // Validate affiliation
  const affResult = validateStringField(formData.affiliation, 'affiliation');
  errors.affiliation = affResult.error;
  sanitized.affiliation = affResult.value;

  // Validate paperTitle
  const titleResult = validateStringField(formData.paperTitle, 'paperTitle');
  errors.paperTitle = titleResult.error;
  sanitized.paperTitle = titleResult.value;

  const isValid = Object.values(errors).every((e) => e === null);

  return { isValid, errors, sanitized };
}

/**
 * Quick check — returns true when all required fields have at least some non-empty input.
 *
 * @param {object} formData
 * @returns {boolean}
 */
export function isFormFilled(formData) {
  return (
    Boolean((formData.certificateId || '').trim()) &&
    Boolean((formData.recipientName || '').trim()) &&
    Boolean((formData.affiliation || '').trim()) &&
    Boolean((formData.paperTitle || '').trim())
  );
}

