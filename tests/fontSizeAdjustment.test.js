/**
 * Font Size Adjustment Tests
 *
 * Verifies that custom font size limits, defaults, and generator options work correctly.
 */
import { describe, it, expect } from 'vitest';
import {
  DEFAULT_FONT_SIZES,
  FONT_SIZE_LIMITS,
  FIELDS,
} from '../src/config/certificateConfig.js';
import { fitTextToWidth, fitMultilineText } from '../src/utils/textFit.js';

describe('Font Size Limits & Defaults Configuration', () => {
  it('defines valid defaults for all dynamic fields', () => {
    expect(DEFAULT_FONT_SIZES.recipientName).toBe(FIELDS.recipientName.fontSize);
    expect(DEFAULT_FONT_SIZES.affiliation).toBe(FIELDS.affiliation.fontSize);
    expect(DEFAULT_FONT_SIZES.paperTitle).toBe(FIELDS.paperTitle.fontSize);
  });

  it('defines bounded limits for all dynamic fields', () => {
    for (const field of ['recipientName', 'affiliation', 'paperTitle']) {
      const limits = FONT_SIZE_LIMITS[field];
      expect(limits.min).toBeLessThan(limits.default);
      expect(limits.max).toBeGreaterThan(limits.default);
      expect(limits.step).toBeGreaterThan(0);
    }
  });
});

describe('Text Fitting with Custom Font Sizes', () => {
  it('respects custom preferred font size when text fits', () => {
    const customSize = 28;
    const res = fitTextToWidth('John Doe', 480, customSize, 12, 'Times-Bold', true);
    expect(res.fontSize).toBe(customSize);
    expect(res.fits).toBe(true);
  });

  it('safely reduces from custom font size when text overflows', () => {
    const veryLongName = 'Dr. Alexander Bartholomew Montgomery-Cunningham III of Edinburgh';
    const customLargeSize = 32;
    const res = fitTextToWidth(veryLongName, 480, customLargeSize, 12, 'Times-Bold', true);
    expect(res.fontSize).toBeLessThanOrEqual(customLargeSize);
  });

  it('respects custom title font size in multi-line fitting', () => {
    const customTitleSize = 26;
    const res = fitMultilineText(
      'Short Title',
      550,
      2,
      customTitleSize,
      11,
      'Times-Bold',
      true
    );
    expect(res.fontSize).toBe(customTitleSize);
  });
});
