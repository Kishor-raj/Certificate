/**
 * Coordinate Mapper Utility
 *
 * Handles coordinate transformations between different coordinate systems:
 *
 * 1. PDF coordinate system (pdf-lib):
 *    - Origin (0,0) at BOTTOM-LEFT
 *    - Y increases UPWARD
 *    - Units: points (1/72 inch)
 *
 * 2. Screen / HTML coordinate system:
 *    - Origin (0,0) at TOP-LEFT
 *    - Y increases DOWNWARD
 *    - Units: pixels (at some DPI)
 *
 * 3. Preview coordinate system (canvas/CSS):
 *    - Origin (0,0) at TOP-LEFT
 *    - Scaled to fit the preview container
 *
 * Template page: 790.5 x 1119 pts
 */

import { PAGE_WIDTH_PT, PAGE_HEIGHT_PT } from '../config/templateConstants.js';

/**
 * Convert screen Y coordinate (top-left origin, downward) to PDF Y coordinate (bottom-left origin, upward).
 *
 * @param {number} screenY - Y coordinate measured from the top of the page (in pts).
 * @param {number} [pageHeight=PAGE_HEIGHT_PT] - Page height in points.
 * @returns {number} PDF Y coordinate from bottom of page.
 */
export function screenYToPdfY(screenY, pageHeight = PAGE_HEIGHT_PT) {
  return pageHeight - screenY;
}

/**
 * Convert PDF Y coordinate (bottom-left origin) to screen Y coordinate (top-left origin).
 *
 * @param {number} pdfY - Y coordinate from bottom of page (in pts).
 * @param {number} [pageHeight=PAGE_HEIGHT_PT] - Page height in points.
 * @returns {number} Screen Y coordinate from top of page.
 */
export function pdfYToScreenY(pdfY, pageHeight = PAGE_HEIGHT_PT) {
  return pageHeight - pdfY;
}

/**
 * Scale a PDF-space coordinate to preview-space (CSS pixels).
 *
 * @param {number} pdfCoord - Coordinate in PDF points.
 * @param {number} previewWidth - Preview container width in CSS pixels.
 * @param {number} [pageWidth=PAGE_WIDTH_PT] - PDF page width in points.
 * @returns {number} Scaled coordinate in CSS pixels.
 */
export function pdfToPreviewX(pdfCoord, previewWidth, pageWidth = PAGE_WIDTH_PT) {
  return (pdfCoord / pageWidth) * previewWidth;
}

/**
 * Scale a PDF-space Y coordinate to preview-space CSS pixels (top-left origin).
 *
 * @param {number} pdfY - Y coordinate in PDF space (bottom-left origin).
 * @param {number} previewHeight - Preview container height in CSS pixels.
 * @param {number} [pageHeight=PAGE_HEIGHT_PT] - PDF page height in points.
 * @returns {number} CSS top offset in pixels.
 */
export function pdfToPreviewY(pdfY, previewHeight, pageHeight = PAGE_HEIGHT_PT) {
  // Convert PDF y (from bottom) to screen y (from top)
  const screenY = pdfYToScreenY(pdfY, pageHeight);
  return (screenY / pageHeight) * previewHeight;
}

/**
 * Compute the preview scale factor based on container width.
 *
 * @param {number} containerWidth - Available container width in pixels.
 * @param {number} [pageWidth=PAGE_WIDTH_PT] - PDF page width in points.
 * @returns {number} Scale factor (previewPixels / pdfPoints).
 */
export function getPreviewScale(containerWidth, pageWidth = PAGE_WIDTH_PT) {
  return containerWidth / pageWidth;
}

/**
 * Get the preview height in pixels for a given container width, preserving aspect ratio.
 *
 * @param {number} containerWidth - Available container width in pixels.
 * @param {number} [pageWidth=PAGE_WIDTH_PT] - PDF page width in points.
 * @param {number} [pageHeight=PAGE_HEIGHT_PT] - PDF page height in points.
 * @returns {number} Preview height in pixels.
 */
export function getPreviewHeight(containerWidth, pageWidth = PAGE_WIDTH_PT, pageHeight = PAGE_HEIGHT_PT) {
  const scale = getPreviewScale(containerWidth, pageWidth);
  return pageHeight * scale;
}

/**
 * Map a field's PDF coordinate definition to preview CSS properties.
 *
 * @param {object} fieldConfig - Field config with x, y, maxWidth, fontSize, etc.
 * @param {number} containerWidth - Preview container width in pixels.
 * @returns {object} CSS position/size properties for the overlay element.
 */
export function fieldToPreviewStyle(fieldConfig, containerWidth) {
  const scale = getPreviewScale(containerWidth);
  const containerHeight = getPreviewHeight(containerWidth);

  return {
    left: pdfToPreviewX(fieldConfig.x, containerWidth) + 'px',
    // PDF y is the baseline; for CSS top we adjust by font size
    top: pdfToPreviewY(fieldConfig.y, containerHeight) + 'px',
    maxWidth: (fieldConfig.maxWidth * scale) + 'px',
    fontSize: (fieldConfig.fontSize * scale) + 'px',
    lineHeight: fieldConfig.lineHeight ? (fieldConfig.lineHeight * scale) + 'px' : 'normal',
  };
}
