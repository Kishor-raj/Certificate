/**
 * CertificatePreview Component
 *
 * SVG-based live preview of the certificate.
 *
 * Fully supports live font-size adjustments:
 * - Recipient Name font size
 * - Affiliation font size
 * - Paper Title font size
 *
 * Scales cleanly and matches the PDF points coordinate space.
 */

import { useMemo } from 'react';
import { FIELDS, PAGE, DEFAULT_FONT_SIZES, formatCertificateId } from '../config/certificateConfig.js';
import { fitTextToWidth, fitMultilineText } from '../utils/textFit.js';

export default function CertificatePreview({ formData, fontSizes = DEFAULT_FONT_SIZES }) {
  const { certificateId, recipientName, affiliation, paperTitle } = formData;

  const textColor = useMemo(() => {
    const c = FIELDS.recipientName.color;
    return `rgb(${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)})`;
  }, []);

  // ── Certificate ID Fitting ───────────────────────────────────────────────
  const idConfig = FIELDS.certificateId;
  const preferredIdSize = fontSizes?.certificateId || idConfig.fontSize;
  const formattedId = formatCertificateId(certificateId);
  const idFit = useMemo(() => {
    if (!formattedId) return { fontSize: preferredIdSize, fits: true };
    return fitTextToWidth(
      formattedId,
      idConfig.maxWidth,
      preferredIdSize,
      idConfig.minFontSize,
      '"Times New Roman", Times, serif',
      true
    );
  }, [formattedId, idConfig, preferredIdSize]);

  // ── Recipient Name Fitting ───────────────────────────────────────────────
  const nameConfig = FIELDS.recipientName;
  const preferredNameSize = fontSizes?.recipientName || nameConfig.fontSize;
  const nameFit = useMemo(() => {
    if (!recipientName) return { fontSize: preferredNameSize, fits: true };
    return fitTextToWidth(
      recipientName,
      nameConfig.maxWidth,
      preferredNameSize,
      nameConfig.minFontSize,
      '"Times New Roman", Times, serif',
      true
    );
  }, [recipientName, nameConfig, preferredNameSize]);

  // ── Affiliation Fitting ──────────────────────────────────────────────────
  const affConfig = FIELDS.affiliation;
  const preferredAffSize = fontSizes?.affiliation || affConfig.fontSize;
  const affFit = useMemo(() => {
    if (!affiliation) return { lines: [], fontSize: preferredAffSize, fits: true };
    return fitMultilineText(
      affiliation,
      affConfig.maxWidth,
      affConfig.maxLines,
      preferredAffSize,
      affConfig.minFontSize,
      '"Times New Roman", Times, serif',
      true
    );
  }, [affiliation, affConfig, preferredAffSize]);

  // ── Paper Title Fitting ──────────────────────────────────────────────────
  const titleConfig = FIELDS.paperTitle;
  const preferredTitleSize = fontSizes?.paperTitle || titleConfig.fontSize;
  const titleFit = useMemo(() => {
    if (!paperTitle) return { lines: [], fontSize: preferredTitleSize, fits: true };
    return fitMultilineText(
      paperTitle,
      titleConfig.maxWidth,
      titleConfig.maxLines,
      preferredTitleSize,
      titleConfig.minFontSize,
      '"Times New Roman", Times, serif',
      true
    );
  }, [paperTitle, titleConfig, preferredTitleSize]);

  const isEmpty = !certificateId && !recipientName && !affiliation && !paperTitle;

  // SVG Y coordinates (SVG origin is top-left, PDF origin is bottom-left):
  // svg_y = PAGE.height - pdf_y
  const idSvgY = PAGE.height - idConfig.y;
  const nameSvgY = PAGE.height - nameConfig.y;
  const affSvgY = PAGE.height - affConfig.y;
  const titleSvgY = PAGE.height - titleConfig.y;

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl shadow-lg border border-gray-200 bg-white"
      aria-label="Live Certificate Preview"
      role="region"
    >
      <svg
        viewBox={`0 0 ${PAGE.width} ${PAGE.height}`}
        className="w-full h-auto block select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Certificate Template Background */}
        <image
          href="/templates/certificate-template.webp"
          xlinkHref="/templates/certificate-template.png"
          x="0"
          y="0"
          width={PAGE.width}
          height={PAGE.height}
          preserveAspectRatio="none"
        />

        {/* Dynamic Text: Certificate ID — Top-left corner above golden line */}
        {formattedId && (
          <text
            x={idConfig.x}
            y={idSvgY}
            textAnchor="start"
            dominantBaseline="alphabetic"
            fontFamily="'Times New Roman', Times, serif"
            fontWeight="bold"
            fontSize={idFit.fontSize}
            fill={textColor}
          >
            {formattedId}
          </text>
        )}

        {/* Dynamic Text: Recipient Name — Centered on underline, Times-Bold */}
        {recipientName && (
          <text
            x={nameConfig.x}
            y={nameSvgY}
            textAnchor="middle"
            dominantBaseline="alphabetic"
            fontFamily="'Times New Roman', Times, serif"
            fontWeight="bold"
            fontSize={nameFit.fontSize}
            fill={textColor}
          >
            {recipientName}
          </text>
        )}

        {/* Dynamic Text: Affiliation — Centered on 'of' underline, Times-Bold */}
        {affFit.lines.length > 0 && (
          <text
            x={affConfig.x}
            y={affSvgY}
            textAnchor="middle"
            dominantBaseline="alphabetic"
            fontFamily="'Times New Roman', Times, serif"
            fontWeight="bold"
            fontSize={affFit.fontSize}
            fill={textColor}
          >
            {affFit.lines.map((line, i) => (
              <tspan
                key={i}
                x={affConfig.x}
                y={affSvgY + i * (affConfig.lineHeight || 24)}
              >
                {line}
              </tspan>
            ))}
          </text>
        )}

        {/* Dynamic Text: Paper Title — Centered on title underline, Times-Bold */}
        {titleFit.lines.length > 0 && (
          <text
            x={titleConfig.x}
            y={titleSvgY}
            textAnchor="middle"
            dominantBaseline="alphabetic"
            fontFamily="'Times New Roman', Times, serif"
            fontWeight="bold"
            fontSize={titleFit.fontSize}
            fill={textColor}
          >
            {titleFit.lines.map((line, i) => (
              <tspan
                key={i}
                x={titleConfig.x}
                y={titleSvgY + i * (titleConfig.lineHeight || 30)}
              >
                {line}
              </tspan>
            ))}
          </text>
        )}
      </svg>

      {/* Floating empty-state helper badge */}
      {isEmpty && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
          <span className="bg-slate-900/75 text-white text-xs px-3.5 py-1.5 rounded-full backdrop-blur-sm shadow-md font-medium tracking-wide">
            Fill in the form to see your certificate
          </span>
        </div>
      )}
    </div>
  );
}
