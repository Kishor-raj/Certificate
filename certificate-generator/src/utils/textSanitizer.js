/**
 * Text Sanitizer Utility
 *
 * Sanitizes user-provided text before it is injected into PDF content.
 * Prevents injection of control characters and ensures safe rendering.
 */

/**
 * Remove or replace characters that are unsafe in PDF text streams.
 * pdf-lib handles most encoding internally, but we still strip
 * problematic control characters to be safe.
 *
 * @param {string} text - Raw user input.
 * @returns {string} Sanitized text safe for PDF embedding.
 */
export function sanitizeForPdf(text) {
  if (!text) return '';

  return text
    // Replace null bytes and other control chars (except newlines/tabs)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize multiple spaces to single space
    .replace(/ {2,}/g, ' ')
    // Trim
    .trim();
}

/**
 * Sanitize text for safe HTML rendering in the preview overlay.
 * Escapes characters that have meaning in HTML.
 *
 * @param {string} text - Raw user input.
 * @returns {string} HTML-safe string.
 */
export function sanitizeForHtml(text) {
  if (!text) return '';

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Normalize whitespace in user text — trim and collapse internal runs of
 * whitespace to a single space. Preserves intentional newlines in paper titles.
 *
 * @param {string} text
 * @returns {string}
 */
export function normalizeWhitespace(text) {
  if (!text) return '';
  return text
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .join('\n')
    .trim();
}
