/**
 * CertificatePreview Component
 *
 * Live preview of the certificate using the PDF template as background
 * and CSS-positioned text overlays for dynamic fields.
 *
 * Matches sample-needed-output.pdf exactly:
 * - Font: "Times New Roman", Times, serif (bold)
 * - Color: rgb(15, 15, 150) (Deep Royal Navy Blue)
 * - Alignment: Centered text horizontally on each respective line
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import { TEMPLATE_URL } from '../config/templateConstants.js';
import { FIELDS, PAGE } from '../config/certificateConfig.js';
import { fitTextToWidth, fitMultilineText } from '../utils/textFit.js';

const ASPECT_RATIO = PAGE.height / PAGE.width; // ≈ 1.416

/** Scale a PDF-point coordinate to preview pixels. */
function scale(pdfCoord, previewSize, pdfSize) {
  return (pdfCoord / pdfSize) * previewSize;
}

export default function CertificatePreview({ formData }) {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setContainerWidth(w);
    });
    observer.observe(containerRef.current);
    setContainerWidth(containerRef.current.offsetWidth);
    return () => observer.disconnect();
  }, []);

  const containerHeight = containerWidth * ASPECT_RATIO;
  const scaleX = containerWidth / PAGE.width;
  const scaleY = containerHeight / PAGE.height;

  // PDF y (from bottom) → CSS top (from top of container)
  const pdfYToTop = useCallback(
    (pdfY) => containerHeight - pdfY * scaleY,
    [containerHeight, scaleY]
  );

  const { recipientName, affiliation, paperTitle } = formData;

  // ── Recipient name fitting ────────────────────────────────────────────────
  const nameConfig  = FIELDS.recipientName;
  const nameFontPx  = nameConfig.fontSize * scaleX;
  const nameMaxWPx  = nameConfig.maxWidth * scaleX;
  const nameFit = recipientName
    ? fitTextToWidth(recipientName, nameMaxWPx, nameFontPx, nameConfig.minFontSize * scaleX, '"Times New Roman", Times, serif', true)
    : { fontSize: nameFontPx, fits: true };

  // ── Affiliation fitting ──────────────────────────────────────────────────
  const affConfig   = FIELDS.affiliation;
  const affFontPx   = affConfig.fontSize * scaleX;
  const affMaxWPx   = affConfig.maxWidth * scaleX;
  const affLineHPx  = (affConfig.lineHeight || 24) * scaleX;
  const affFit = affiliation
    ? fitMultilineText(affiliation, affMaxWPx, affConfig.maxLines, affFontPx, affConfig.minFontSize * scaleX, '"Times New Roman", Times, serif', true)
    : { lines: [], fontSize: affFontPx, fits: true };

  // ── Paper title fitting ──────────────────────────────────────────────────
  const titleConfig  = FIELDS.paperTitle;
  const titleFontPx  = titleConfig.fontSize * scaleX;
  const titleMaxWPx  = titleConfig.maxWidth * scaleX;
  const titleLineHPx = (titleConfig.lineHeight || 30) * scaleX;
  const titleFit = paperTitle
    ? fitMultilineText(paperTitle, titleMaxWPx, titleConfig.maxLines, titleFontPx, titleConfig.minFontSize * scaleX, '"Times New Roman", Times, serif', true)
    : { lines: [], fontSize: titleFontPx, fits: true };

  const nameCenterPx  = scale(nameConfig.x, containerWidth, PAGE.width);
  const affCenterPx   = scale(affConfig.x, containerWidth, PAGE.width);
  const titleCenterPx = scale(titleConfig.x, containerWidth, PAGE.width);

  const textColorCss = `rgb(${Math.round(nameConfig.color.r * 255)}, ${Math.round(nameConfig.color.g * 255)}, ${Math.round(nameConfig.color.b * 255)})`;

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg shadow-xl border border-gray-200 bg-gray-100"
      style={{ paddingBottom: `${ASPECT_RATIO * 100}%` }}
      aria-label="Certificate preview"
      role="img"
    >
      <div ref={containerRef} className="absolute inset-0">
        {/* PDF background */}
        {containerWidth > 0 && (
          <iframe
            src={`${TEMPLATE_URL}#toolbar=0&navpanes=0&scrollbar=0`}
            title="Certificate template"
            className="absolute inset-0 w-full h-full border-0 pointer-events-none"
            aria-hidden="true"
          />
        )}

        {/* Dynamic text overlays */}
        {containerWidth > 0 && (
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">

            {/* Recipient name — centered, Times Bold */}
            {recipientName && (
              <div
                className="absolute overflow-hidden"
                style={{
                  left: nameCenterPx + 'px',
                  transform: 'translateX(-50%)',
                  top: pdfYToTop(nameConfig.y) - nameFit.fontSize + 'px',
                  fontSize: nameFit.fontSize + 'px',
                  fontFamily: '"Times New Roman", Times, serif',
                  fontWeight: 'bold',
                  color: textColorCss,
                  whiteSpace: 'nowrap',
                  lineHeight: '1.2',
                  maxWidth: nameMaxWPx + 'px',
                  textAlign: 'center',
                }}
              >
                {recipientName}
              </div>
            )}

            {/* Affiliation — centered, Times Bold */}
            {affFit.lines.length > 0 && (
              <div
                className="absolute overflow-hidden"
                style={{
                  left: affCenterPx + 'px',
                  transform: 'translateX(-50%)',
                  top: pdfYToTop(affConfig.y) - affFit.fontSize + 'px',
                  fontSize: affFit.fontSize + 'px',
                  maxWidth: affMaxWPx + 'px',
                  lineHeight: affLineHPx + 'px',
                  fontFamily: '"Times New Roman", Times, serif',
                  fontWeight: 'bold',
                  color: textColorCss,
                  textAlign: 'center',
                  whiteSpace: affFit.lines.length === 1 ? 'nowrap' : 'normal',
                }}
              >
                {affFit.lines.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}

            {/* Paper title — centered, Times Bold */}
            {titleFit.lines.length > 0 && (
              <div
                className="absolute overflow-hidden"
                style={{
                  left: titleCenterPx + 'px',
                  transform: 'translateX(-50%)',
                  top: pdfYToTop(titleConfig.y) - titleFit.fontSize + 'px',
                  width: titleMaxWPx + 'px',
                  fontSize: titleFit.fontSize + 'px',
                  lineHeight: titleLineHPx + 'px',
                  fontFamily: '"Times New Roman", Times, serif',
                  fontWeight: 'bold',
                  color: textColorCss,
                  textAlign: 'center',
                }}
              >
                {titleFit.lines.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {containerWidth > 0 && !recipientName && !affiliation && !paperTitle && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
            <span className="bg-white/80 text-gray-500 text-xs px-3 py-1 rounded-full backdrop-blur-sm">
              Fill in the form to see your certificate
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
