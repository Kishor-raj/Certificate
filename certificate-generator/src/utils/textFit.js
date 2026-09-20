/**
 * Text Fit Utility
 *
 * Measures text and determines the appropriate font size so that text
 * fits within a given width/height constraint.
 * Supports Canvas 2D measurement in the browser, custom measure function (e.g. from pdf-lib),
 * or analytical fallback in headless/Node/jsdom environments.
 */

/**
 * A hidden canvas element used for browser text measurement.
 * Created once and reused.
 */
let _canvas = null;
function getMeasureCanvas() {
  if (!_canvas && typeof document !== 'undefined') {
    try {
      _canvas = document.createElement('canvas');
    } catch {
      _canvas = null;
    }
  }
  return _canvas;
}

/**
 * Measure the width of a string at a given font size.
 *
 * @param {string} text - Text to measure.
 * @param {number} fontSize - Font size in points or pixels.
 * @param {string} [fontFamily='Helvetica, Arial, sans-serif'] - CSS font family.
 * @param {boolean} [bold=false] - Whether to use bold weight.
 * @param {Function} [customMeasureFn] - Optional custom measure function (text, fontSize) => number.
 * @returns {number} Measured text width.
 */
export function measureTextWidth(text, fontSize, fontFamily = 'Helvetica, Arial, sans-serif', bold = false, customMeasureFn = null) {
  if (!text) return 0;
  if (customMeasureFn) {
    return customMeasureFn(text, fontSize);
  }

  const canvas = getMeasureCanvas();
  if (canvas) {
    try {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const weight = bold ? 'bold' : 'normal';
        ctx.font = `${weight} ${fontSize}px ${fontFamily}`;
        return ctx.measureText(text).width;
      }
    } catch {
      // Ignore and fallback below
    }
  }

  // Fallback average character width factor (~0.55 of font size for proportional serif/sans)
  return text.length * fontSize * (bold ? 0.60 : 0.55);
}

/**
 * Find the largest font size at which `text` fits within `maxWidth`,
 * between `minFontSize` and `maxFontSize`.
 *
 * @param {string} text - Text to fit.
 * @param {number} maxWidth - Maximum allowed width.
 * @param {number} maxFontSize - Preferred (maximum) font size to try first.
 * @param {number} minFontSize - Minimum acceptable font size.
 * @param {string} [fontFamily] - CSS font family.
 * @param {boolean} [bold=false]
 * @param {Function} [customMeasureFn] - Optional (text, size) => width.
 * @returns {{ fontSize: number, fits: boolean }}
 */
export function fitTextToWidth(text, maxWidth, maxFontSize, minFontSize, fontFamily, bold = false, customMeasureFn = null) {
  if (!text) return { fontSize: maxFontSize, fits: true };

  let size = maxFontSize;
  while (size >= minFontSize) {
    const width = measureTextWidth(text, size, fontFamily, bold, customMeasureFn);
    if (width <= maxWidth) {
      return { fontSize: size, fits: true };
    }
    size -= 0.5;
  }

  return { fontSize: minFontSize, fits: false };
}

/**
 * Wrap text into lines that fit within `maxWidth` at a given font size.
 *
 * @param {string} text - Text to wrap. Newlines are treated as hard breaks.
 * @param {number} maxWidth - Maximum line width.
 * @param {number} fontSize - Font size to use for measurement.
 * @param {string} [fontFamily] - CSS font family.
 * @param {boolean} [bold=false]
 * @param {Function} [customMeasureFn]
 * @returns {string[]} Array of line strings.
 */
export function wrapText(text, maxWidth, fontSize, fontFamily, bold = false, customMeasureFn = null) {
  if (!text) return [];

  const hardLines = text.split('\n');
  const result = [];

  for (const hardLine of hardLines) {
    const words = hardLine.split(' ').filter(Boolean);
    if (words.length === 0) {
      result.push('');
      continue;
    }

    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = measureTextWidth(testLine, fontSize, fontFamily, bold, customMeasureFn);
      if (width <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          result.push(currentLine);
        }
        currentLine = word;
      }
    }
    if (currentLine) {
      result.push(currentLine);
    }
  }

  return result;
}

/**
 * Fit multi-line text into a bounded area.
 * Reduces font size until the text fits within maxLines.
 *
 * @param {string} text - Text to fit.
 * @param {number} maxWidth - Maximum line width.
 * @param {number} maxLines - Maximum number of lines allowed.
 * @param {number} maxFontSize - Preferred font size.
 * @param {number} minFontSize - Minimum font size.
 * @param {string} [fontFamily]
 * @param {boolean} [bold=false]
 * @param {Function} [customMeasureFn]
 * @returns {{ lines: string[], fontSize: number, fits: boolean }}
 */
export function fitMultilineText(text, maxWidth, maxLines, maxFontSize, minFontSize, fontFamily, bold = false, customMeasureFn = null) {
  if (!text) return { lines: [], fontSize: maxFontSize, fits: true };

  let size = maxFontSize;
  while (size >= minFontSize) {
    const lines = wrapText(text, maxWidth, size, fontFamily, bold, customMeasureFn);
    if (lines.length <= maxLines) {
      return { lines, fontSize: size, fits: true };
    }
    size -= 0.5;
  }

  const lines = wrapText(text, maxWidth, minFontSize, fontFamily, bold, customMeasureFn);
  return {
    lines: lines.slice(0, maxLines),
    fontSize: minFontSize,
    fits: lines.length <= maxLines,
  };
}
