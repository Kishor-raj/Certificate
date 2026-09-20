/**
 * Coordinate Mapper Tests
 *
 * Verifies that PDF ↔ screen coordinate transformations are correct
 * for the ICET-AIDCDC-2026 template (790.5 × 1119 pts).
 */
import { describe, it, expect } from 'vitest';
import {
  screenYToPdfY,
  pdfYToScreenY,
  pdfToPreviewX,
  pdfToPreviewY,
  getPreviewScale,
  getPreviewHeight,
} from '../src/utils/coordinateMapper.js';
import { FIELDS } from '../src/config/certificateConfig.js';

const PAGE_W = 790.5;
const PAGE_H = 1119;

describe('screenYToPdfY', () => {
  it('converts top-of-page screen Y to bottom of page in PDF coords', () => {
    expect(screenYToPdfY(0, PAGE_H)).toBe(PAGE_H);
  });

  it('converts bottom-of-page screen Y to 0 in PDF coords', () => {
    expect(screenYToPdfY(PAGE_H, PAGE_H)).toBe(0);
  });

  it('converts midpoint correctly', () => {
    expect(screenYToPdfY(PAGE_H / 2, PAGE_H)).toBe(PAGE_H / 2);
  });
});

describe('pdfYToScreenY', () => {
  it('is the inverse of screenYToPdfY', () => {
    const pdfY = 622;
    const screenY = pdfYToScreenY(pdfY, PAGE_H);
    expect(screenYToPdfY(screenY, PAGE_H)).toBeCloseTo(pdfY, 10);
  });

  it('converts PDF y=0 (bottom) to screen y=PAGE_H (bottom)', () => {
    expect(pdfYToScreenY(0, PAGE_H)).toBe(PAGE_H);
  });

  it('converts PDF y=PAGE_H (top) to screen y=0 (top)', () => {
    expect(pdfYToScreenY(PAGE_H, PAGE_H)).toBe(0);
  });
});

describe('getPreviewScale', () => {
  it('returns 1 when container matches page width', () => {
    expect(getPreviewScale(PAGE_W, PAGE_W)).toBe(1);
  });

  it('returns 0.5 when container is half the page width', () => {
    expect(getPreviewScale(PAGE_W / 2, PAGE_W)).toBe(0.5);
  });

  it('returns correct scale for a typical screen width', () => {
    const containerWidth = 600;
    const expected = 600 / PAGE_W;
    expect(getPreviewScale(containerWidth, PAGE_W)).toBeCloseTo(expected, 10);
  });
});

describe('getPreviewHeight', () => {
  it('preserves aspect ratio', () => {
    const containerWidth = 500;
    const expectedHeight = (PAGE_H / PAGE_W) * containerWidth;
    expect(getPreviewHeight(containerWidth, PAGE_W, PAGE_H)).toBeCloseTo(expectedHeight, 5);
  });
});

describe('pdfToPreviewX', () => {
  it('maps PDF x=0 to preview x=0', () => {
    expect(pdfToPreviewX(0, 600, PAGE_W)).toBe(0);
  });

  it('maps PDF x=PAGE_W to preview x=containerWidth', () => {
    expect(pdfToPreviewX(PAGE_W, 600, PAGE_W)).toBe(600);
  });

  it('maps mid-page X correctly', () => {
    expect(pdfToPreviewX(PAGE_W / 2, 600, PAGE_W)).toBeCloseTo(300, 5);
  });

  it('maps recipient name x coordinate proportionally', () => {
    const pdfX = FIELDS.recipientName.x;
    const containerWidth = 600;
    const expected = (pdfX / PAGE_W) * 600;
    expect(pdfToPreviewX(pdfX, containerWidth, PAGE_W)).toBeCloseTo(expected, 5);
  });
});

describe('Known field coordinates (regression)', () => {
  it('recipient name field is in the correct Y zone', () => {
    const nameY = FIELDS.recipientName.y;
    expect(nameY).toBeGreaterThan(600);
    expect(nameY).toBeLessThan(680);
  });

  it('affiliation field is below recipient name', () => {
    expect(FIELDS.affiliation.y).toBeLessThan(FIELDS.recipientName.y);
  });

  it('paper title field is below affiliation', () => {
    expect(FIELDS.paperTitle.y).toBeLessThan(FIELDS.affiliation.y);
  });

  it('paper title bottom boundary does not overlap conference text', () => {
    const conferenceTextY = 470;
    expect(FIELDS.paperTitle.bottomBoundary).toBeGreaterThanOrEqual(conferenceTextY);
  });
});
