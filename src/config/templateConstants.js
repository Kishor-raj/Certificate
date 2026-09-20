/**
 * Template constants — immutable values derived from the locked template.
 *
 * These values must not be changed without re-measuring the actual PDF.
 * Template file: public/templates/ICET-AIDCDC-2026.pdf
 * Created by: Canva, by Priyadharshini Priyadharshini
 */

/** Stable filename for the production template asset. */
export const TEMPLATE_FILENAME = 'ICET-AIDCDC-2026.pdf';

/** Template URL relative to public root. */
export const TEMPLATE_URL = `/templates/${TEMPLATE_FILENAME}`;

/** Page dimensions in PDF points (1 pt = 1/72 inch). */
export const PAGE_WIDTH_PT = 790.5;
export const PAGE_HEIGHT_PT = 1119;

/** Number of pages in the template. Must always be 1. */
export const TEMPLATE_PAGE_COUNT = 1;

/** Page index (0-based) to use. */
export const TEMPLATE_PAGE_INDEX = 0;

/**
 * Fixed certificate text content that must not change.
 * Stored here for documentation and regression-test reference only.
 */
export const FIXED_CONTENT = {
  institution: 'GOVERNMENT ARTS AND SCIENCE COLLEGE',
  location: 'VEERAPANDI - 625 534, THENI DISTRICT, TAMIL NADU, INDIA',
  affiliation: '(Affiliated to Madurai Kamaraj University)',
  department: 'PG DEPARTMENT OF COMPUTER SCIENCE',
  conferenceName: 'INTERNATIONAL CONFERENCE ON EMERGING TRENDS IN ARTIFICIAL INTELLIGENCE, DATA SCIENCE, CYBER SECURITY AND DIGITAL COMPUTING',
  conferenceCode: '(ICET-AIDCDC 2026)',
  tagline: 'INNOVATE . INTEGRATE . INSPIRE',
  // CRITICAL: Must be exactly this value. The typo "23nd" was previously corrected.
  conferenceDate: '22nd & 23rd September 2026',
  certificateHeading: 'CERTIFICATE',
  certifyLine: 'This is to certify that',
  bodyText: 'has participated / presented a paper entitled',
  inConference: 'in the International Conference on Emerging Trends in',
  association: 'Asgard International Foundation for Research & Innovation',
  journalLine: 'International Journal of Intelligent Digital Computing Research (IJIDCR)',
  publisherLine: 'Published by Asgard International Research Publications',
};

/**
 * Output filename template for generated certificates.
 * <RecipientName> will be sanitized and substituted at generation time.
 */
export const OUTPUT_FILENAME_TEMPLATE = 'ICET-AIDCDC-2026-Certificate-{name}.pdf';
