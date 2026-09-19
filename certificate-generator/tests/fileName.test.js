/**
 * Filename Utility Tests
 */
import { describe, it, expect } from 'vitest';
import { sanitizeFilenameSegment, buildCertificateFilename } from '../src/utils/fileName.js';

describe('sanitizeFilenameSegment', () => {
  it('replaces spaces with hyphens', () => {
    expect(sanitizeFilenameSegment('Jane Smith')).toBe('Jane-Smith');
  });

  it('removes illegal filesystem characters', () => {
    expect(sanitizeFilenameSegment('Jane<>Smith')).toBe('JaneSmith');
    expect(sanitizeFilenameSegment('file/name')).toBe('filename');
    expect(sanitizeFilenameSegment('name*star')).toBe('namestar');
  });

  it('collapses multiple hyphens', () => {
    expect(sanitizeFilenameSegment('Jane   Smith')).toBe('Jane-Smith');
  });

  it('trims leading/trailing hyphens', () => {
    expect(sanitizeFilenameSegment(' Jane ')).toBe('Jane');
  });

  it('limits length to 60 characters', () => {
    const long = 'A'.repeat(80);
    expect(sanitizeFilenameSegment(long)).toHaveLength(60);
  });

  it('handles unicode names (preserves allowed unicode chars)', () => {
    const result = sanitizeFilenameSegment('Müller');
    expect(result).toBe('Müller');
  });

  it('handles empty string', () => {
    expect(sanitizeFilenameSegment('')).toBe('');
  });
});

describe('buildCertificateFilename', () => {
  it('builds the expected filename format', () => {
    const filename = buildCertificateFilename('Jane Smith');
    expect(filename).toBe('ICET-AIDCDC-2026-Certificate-Jane-Smith.pdf');
  });

  it('includes the .pdf extension', () => {
    expect(buildCertificateFilename('Test Name')).toMatch(/\.pdf$/);
  });

  it('uses Recipient as fallback for empty name', () => {
    expect(buildCertificateFilename('')).toBe('ICET-AIDCDC-2026-Certificate-Recipient.pdf');
  });

  it('does not double-add extension', () => {
    const filename = buildCertificateFilename('Test');
    expect(filename.split('.pdf').length - 1).toBe(1);
  });
});
