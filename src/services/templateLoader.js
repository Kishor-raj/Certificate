/**
 * Template Loader Service
 *
 * Loads the certificate PDF template from the public directory and caches it.
 * The template bytes are cached after the first load to avoid repeated network requests.
 *
 * The template is treated as immutable — its bytes are never modified directly.
 * PDF generation creates a fresh working copy each time.
 */

import { TEMPLATE_URL } from '../config/templateConstants.js';

/** Cached template ArrayBuffer — set after first successful load. */
let _cachedTemplateBytes = null;

/** In-flight fetch promise to prevent duplicate concurrent requests. */
let _loadingPromise = null;

/**
 * Load the certificate template PDF.
 * Returns cached bytes if already loaded.
 *
 * @returns {Promise<Uint8Array>} The raw PDF bytes.
 * @throws {Error} If the template cannot be fetched.
 */
export async function loadTemplate() {
  // Return cached copy if available
  if (_cachedTemplateBytes) {
    return _cachedTemplateBytes;
  }

  // Deduplicate concurrent calls
  if (_loadingPromise) {
    return _loadingPromise;
  }

  _loadingPromise = (async () => {
    const response = await fetch(TEMPLATE_URL);
    if (!response.ok) {
      throw new Error(
        `Failed to load certificate template (HTTP ${response.status}). ` +
        `Make sure ${TEMPLATE_URL} is accessible.`
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    _cachedTemplateBytes = new Uint8Array(arrayBuffer);
    return _cachedTemplateBytes;
  })();

  try {
    const bytes = await _loadingPromise;
    return bytes;
  } finally {
    _loadingPromise = null;
  }
}

/**
 * Get a fresh copy of the cached template bytes for PDF generation.
 * This MUST be used for each new certificate to avoid mutating the cached source.
 *
 * @returns {Promise<Uint8Array>} A new Uint8Array copy of the template bytes.
 */
export async function getFreshTemplateCopy() {
  const original = await loadTemplate();
  // Create a fresh copy — never pass the cached bytes directly to pdf-lib for modification
  return new Uint8Array(original);
}

/**
 * Clear the template cache (useful for testing).
 */
export function clearTemplateCache() {
  _cachedTemplateBytes = null;
  _loadingPromise = null;
}

/**
 * Check if the template has been loaded and cached.
 * @returns {boolean}
 */
export function isTemplateCached() {
  return _cachedTemplateBytes !== null;
}
