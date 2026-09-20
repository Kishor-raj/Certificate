/**
 * Certificate Configuration
 *
 * All page dimensions and field coordinates are in PDF points (pts).
 * PDF coordinate origin (0,0) is at the BOTTOM-LEFT of the page.
 * Y increases upward.
 *
 * Template: ICET-AIDCDC-2026.pdf
 * Page size: 790.5 x 1119 pts (Portrait)
 * Source: Canva-generated PDF, verified via pdfinfo
 *
 * Dynamic field positions & styling are calibrated to exactly match
 * sample-needed-output.pdf:
 * - Font: Times-Bold (Times New Roman Bold serif) for an attractive, prestigious certificate look
 * - Color: Deep Royal Navy Blue rgb(15, 15, 150)
 * - Alignment: Centered text horizontally on each respective line
 * - Y Baselines: Adjusted so characters sit cleanly above the underlines
 */

export const TEMPLATE_PATH = '/templates/ICET-AIDCDC-2026.pdf';

export const PAGE = {
  width: 790.5,
  height: 1119,
};

/**
 * Standard font definitions.
 * All dynamic fields use Times-Bold matching sample-needed-output.pdf.
 */
export const FONTS = {
  TIMES_BOLD: 'Times-Bold',
  TIMES_ROMAN: 'Times-Roman',
  HELVETICA: 'Helvetica',
  HELVETICA_BOLD: 'Helvetica-Bold',
};

/**
 * Deep Royal Navy Blue matching sample-needed-output.pdf
 * RGB [15, 15, 150] -> in 0..1 scale { r: 15/255, g: 15/255, b: 150/255 }
 */
export const CERTIFICATE_TEXT_COLOR = {
  r: 15 / 255,
  g: 15 / 255,
  b: 150 / 255,
};

/**
 * Certificate field definitions with coordinates, font settings, and constraints.
 *
 * Exact calibration against sample-needed-output.pdf:
 *
 * 1. Certificate ID:
 *    - Text: e.g. "ID: ICET-2026-001"
 *    - Font: Times-Bold, 13pt
 *    - Color: Deep Royal Navy Blue
 *    - Alignment: Left aligned at top-left corner of golden line (X = 193)
 *    - Y Baseline: y = 1100 (sits cleanly above the golden line at y ≈ 1088 with clear margin)
 *
 * 2. Recipient Name:
 *    - Text: e.g. "Kishor Raj SA"
 *    - Font: Times-Bold, 22pt
 *    - Color: Deep Royal Navy Blue
 *    - Alignment: Centered on underline (center X ≈ 412)
 *    - Y Baseline: y = 638 (sits cleanly above underline at y ≈ 625)
 *
 * 3. Affiliation:
 *    - Text: e.g. "Government Arts and Science College Veerapandi"
 *    - Font: Times-Bold, 17pt
 *    - Color: Deep Royal Navy Blue
 *    - Alignment: Centered in available space of 'of' line (center X ≈ 418)
 *    - Y Baseline: y = 608 (sits cleanly above underline at y ≈ 595)
 *
 * 4. Paper / Presentation Title:
 *    - Text: e.g. "Deep Learning and Machine Learning"
 *    - Font: Times-Bold, 21pt
 *    - Color: Deep Royal Navy Blue
 *    - Alignment: Centered across page (center X = 395.25)
 *    - Y Baseline: y = 547 (sits cleanly above title underline at y ≈ 533)
 *    - Line Height: 30pt (matches the 30pt spacing between consecutive title underlines)
 */
export const FIELDS = {
  certificateId: {
    x: 193,
    y: 1100,
    maxWidth: 320,
    fontSize: 13,
    minFontSize: 9,
    fontFamily: FONTS.TIMES_BOLD,
    color: CERTIFICATE_TEXT_COLOR,
    align: 'left',
    maxLines: 1,
  },

  recipientName: {
    x: 412,
    y: 638,
    maxWidth: 480,
    fontSize: 22,
    minFontSize: 12,
    fontFamily: FONTS.TIMES_BOLD,
    color: CERTIFICATE_TEXT_COLOR,
    align: 'center',
    maxLines: 1,
  },

  affiliation: {
    x: 418,
    y: 608,
    maxWidth: 540,
    fontSize: 17,
    minFontSize: 10,
    fontFamily: FONTS.TIMES_BOLD,
    color: CERTIFICATE_TEXT_COLOR,
    align: 'center',
    maxLines: 2,
    lineHeight: 24,
  },

  paperTitle: {
    x: 395.25,
    y: 547,
    maxWidth: 550,
    fontSize: 21,
    minFontSize: 11,
    fontFamily: FONTS.TIMES_BOLD,
    color: CERTIFICATE_TEXT_COLOR,
    align: 'center',
    maxLines: 2,
    lineHeight: 30,
    bottomBoundary: 490,
  },
};

/**
 * Format the Certificate ID for display.
 * If user inputs "101" or "ICET-2026-001", formats as "ID: 101" / "ID: ICET-2026-001".
 * If user already included "ID:" or "id-", retains user's direct prefix without duplicating.
 *
 * @param {string} id
 * @returns {string}
 */
export function formatCertificateId(id) {
  if (!id) return '';
  const trimmed = id.trim();
  if (/^id[:\s\-\/]/i.test(trimmed) || /^id$/i.test(trimmed)) {
    return trimmed;
  }
  return `ID: ${trimmed}`;
}

/**
 * Default font sizes for dynamic fields.
 */
export const DEFAULT_FONT_SIZES = {
  certificateId: FIELDS.certificateId.fontSize,
  recipientName: FIELDS.recipientName.fontSize,
  affiliation: FIELDS.affiliation.fontSize,
  paperTitle: FIELDS.paperTitle.fontSize,
};

/**
 * Permitted font size limits for user adjustment.
 */
export const FONT_SIZE_LIMITS = {
  certificateId: {
    min: 9,
    max: 20,
    step: 1,
    default: FIELDS.certificateId.fontSize,
  },
  recipientName: {
    min: 14,
    max: 32,
    step: 1,
    default: FIELDS.recipientName.fontSize,
  },
  affiliation: {
    min: 11,
    max: 24,
    step: 1,
    default: FIELDS.affiliation.fontSize,
  },
  paperTitle: {
    min: 13,
    max: 28,
    step: 1,
    default: FIELDS.paperTitle.fontSize,
  },
};

/**
 * Validation constraints.
 */
export const VALIDATION = {
  certificateId: {
    required: true,
    maxLength: 50,
    label: 'Certificate ID',
  },
  recipientName: {
    required: true,
    maxLength: 100,
    label: 'Full Name',
  },
  affiliation: {
    required: true,
    maxLength: 150,
    label: 'Affiliation',
  },
  paperTitle: {
    required: true,
    maxLength: 250,
    label: 'Paper / Presentation Title',
  },
};

/**
 * Initial application form state.
 */
export const INITIAL_FORM_STATE = {
  certificateId: '',
  recipientName: '',
  affiliation: '',
  paperTitle: '',
};
