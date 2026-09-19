/**
 * File Name Utility
 *
 * Generates safe, human-readable filenames for generated certificates.
 */

import { OUTPUT_FILENAME_TEMPLATE } from '../config/templateConstants.js';

/**
 * Sanitize a recipient name for use in a filesystem filename.
 * - Replace spaces with hyphens.
 * - Remove characters that are invalid on Windows/macOS/Linux.
 * - Collapse multiple hyphens.
 * - Trim leading/trailing hyphens.
 * - Limit total length.
 *
 * @param {string} name - Recipient name (already validated/trimmed).
 * @returns {string} Safe filename segment.
 */
export function sanitizeFilenameSegment(name) {
  return name
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove characters invalid in filenames across common OS
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    // Remove leading dots (hidden files on Unix)
    .replace(/^\.+/, '')
    // Collapse multiple hyphens
    .replace(/-{2,}/g, '-')
    // Trim hyphens at start/end
    .replace(/^-+|-+$/g, '')
    // Limit length to prevent overly long filenames
    .substring(0, 60);
}

/**
 * Build the final certificate PDF filename.
 *
 * @param {string} recipientName - Recipient name (will be sanitized).
 * @returns {string} Filename like "ICET-AIDCDC-2026-Certificate-John-Smith.pdf"
 */
export function buildCertificateFilename(recipientName) {
  const safeName = sanitizeFilenameSegment(recipientName || 'Recipient');
  return OUTPUT_FILENAME_TEMPLATE.replace('{name}', safeName);
}
