/**
 * PDF Generator Service
 *
 * Generates the final certificate PDF by:
 * 1. Loading a fresh copy of the template.
 * 2. Embedding dynamic text at exact coordinates matching sample-needed-output.pdf.
 * 3. Returning PDF bytes for download.
 *
 * Exact styling matching sample-needed-output.pdf:
 *   - Recipient Name: Times-Bold, centered on underline, Deep Royal Navy Blue
 *   - Affiliation:    Times-Bold, centered on 'of' line, Deep Royal Navy Blue
 *   - Paper Title:    Times-Bold, centered across page, Deep Royal Navy Blue
 *
 * Coordinate system: pdf-lib uses origin (0,0) at BOTTOM-LEFT, Y increases upward.
 */

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { getFreshTemplateCopy } from './templateLoader.js';
import { FIELDS, PAGE } from '../config/certificateConfig.js';
import { sanitizeForPdf } from '../utils/textSanitizer.js';
import { fitTextToWidth, fitMultilineText } from '../utils/textFit.js';
import { buildCertificateFilename } from '../utils/fileName.js';

/**
 * Draw a single line of text on the PDF page.
 *
 * @param {object} page - pdf-lib PDFPage.
 * @param {object} font - Embedded pdf-lib font.
 * @param {string} text
 * @param {number} x
 * @param {number} y
 * @param {number} fontSize
 * @param {{ r, g, b }} color - RGB 0–1 range.
 */
function drawText(page, font, text, x, y, fontSize, color) {
  if (!text) return;
  page.drawText(text, {
    x,
    y,
    size: fontSize,
    font,
    color: rgb(color.r, color.g, color.b),
  });
}

/**
 * Generate the certificate PDF for validated form data.
 *
 * @param {object} certData
 * @param {string} certData.recipientName - Full name (e.g. "Kishor Raj SA")
 * @param {string} certData.affiliation
 * @param {string} certData.paperTitle
 *
 * @returns {Promise<{ bytes: Uint8Array, filename: string }>}
 */
export async function generateCertificate(certData) {
  // 1. Fresh, unmodified copy of template
  const templateBytes = await getFreshTemplateCopy();

  // 2. Load PDF
  const pdfDoc = await PDFDocument.load(templateBytes);

  // 3. Verify structure
  if (pdfDoc.getPageCount() !== 1) {
    throw new Error('Template must have exactly 1 page.');
  }

  const page = pdfDoc.getPages()[0];
  const { width, height } = page.getSize();

  if (Math.abs(width - PAGE.width) > 1 || Math.abs(height - PAGE.height) > 1) {
    console.warn(
      `Page size mismatch: got ${width.toFixed(1)}×${height.toFixed(1)}, ` +
      `expected ${PAGE.width}×${PAGE.height}`
    );
  }

  // 4. Embed font: Times-Bold for all dynamic text matching sample-needed-output.pdf
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const measureWithFont = (t, s) => timesBold.widthOfTextAtSize(t, s);

  // 5. Sanitize inputs
  const recipientName = sanitizeForPdf(certData.recipientName);
  const affiliation   = sanitizeForPdf(certData.affiliation);
  const paperTitle    = sanitizeForPdf(certData.paperTitle);

  // ── 6. Recipient Name — centered, Times-Bold, Deep Navy Blue ─────────────
  const nameConfig = FIELDS.recipientName;

  const nameFit = fitTextToWidth(
    recipientName,
    nameConfig.maxWidth,
    nameConfig.fontSize,
    nameConfig.minFontSize,
    'Times-Bold',
    true,
    measureWithFont
  );

  const nameTextWidth = timesBold.widthOfTextAtSize(recipientName, nameFit.fontSize);
  // Horizontally centered around nameConfig.x
  const nameX = nameConfig.x - nameTextWidth / 2;

  drawText(
    page,
    timesBold,
    recipientName,
    nameX,
    nameConfig.y,
    nameFit.fontSize,
    nameConfig.color
  );

  // ── 7. Affiliation — centered, Times-Bold, Deep Navy Blue ────────────────
  const affConfig = FIELDS.affiliation;

  const affSingleFit = fitTextToWidth(
    affiliation,
    affConfig.maxWidth,
    affConfig.fontSize,
    affConfig.minFontSize,
    'Times-Bold',
    true,
    measureWithFont
  );

  if (affSingleFit.fits) {
    const affWidth = timesBold.widthOfTextAtSize(affiliation, affSingleFit.fontSize);
    const affX = affConfig.x - affWidth / 2;
    drawText(page, timesBold, affiliation, affX, affConfig.y, affSingleFit.fontSize, affConfig.color);
  } else {
    const affMulti = fitMultilineText(
      affiliation,
      affConfig.maxWidth,
      affConfig.maxLines,
      affConfig.fontSize,
      affConfig.minFontSize,
      'Times-Bold',
      true,
      measureWithFont
    );
    affMulti.lines.forEach((line, i) => {
      const lineWidth = timesBold.widthOfTextAtSize(line, affMulti.fontSize);
      const affX = affConfig.x - lineWidth / 2;
      const affY = affConfig.y - i * (affConfig.lineHeight || 24);
      drawText(page, timesBold, line, affX, affY, affMulti.fontSize, affConfig.color);
    });
  }

  // ── 8. Paper Title — centered, Times-Bold, Deep Navy Blue ────────────────
  const titleConfig = FIELDS.paperTitle;

  const titleFit = fitMultilineText(
    paperTitle,
    titleConfig.maxWidth,
    titleConfig.maxLines,
    titleConfig.fontSize,
    titleConfig.minFontSize,
    'Times-Bold',
    true,
    measureWithFont
  );

  titleFit.lines.forEach((line, i) => {
    const lineWidth = timesBold.widthOfTextAtSize(line, titleFit.fontSize);
    const centerX = titleConfig.x - lineWidth / 2;
    const lineY = titleConfig.y - i * (titleConfig.lineHeight || 30);

    if (lineY >= titleConfig.bottomBoundary) {
      drawText(page, timesBold, line, centerX, lineY, titleFit.fontSize, titleConfig.color);
    }
  });

  // 9. Save PDF
  const pdfBytes = await pdfDoc.save();

  // 10. Build filename from recipient name
  const filename = buildCertificateFilename(recipientName);

  return { bytes: pdfBytes, filename };
}

/**
 * Trigger browser download of the generated PDF.
 *
 * @param {Uint8Array} pdfBytes
 * @param {string} filename
 */
export function downloadPdf(pdfBytes, filename) {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
