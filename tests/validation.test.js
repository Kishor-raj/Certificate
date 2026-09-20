/**
 * Validation Tests
 *
 * Tests for the certificate form validation utility.
 * Note: No prefix field — recipientName contains the full titled name.
 */
import { describe, it, expect } from 'vitest';
import { validateCertificateForm, isFormFilled } from '../src/utils/validation.js';
import { formatCertificateId } from '../src/config/certificateConfig.js';

// Helper to build a complete valid form
function validForm(overrides = {}) {
  return {
    certificateId: 'ICET-2026-001',
    recipientName: 'Dr. Jane Smith',
    affiliation: 'University of Technology',
    paperTitle: 'Deep Learning for Cybersecurity',
    ...overrides,
  };
}

describe('validateCertificateForm — valid data', () => {
  it('returns no errors for a complete valid form', () => {
    const { isValid, errors } = validateCertificateForm(validForm());
    expect(isValid).toBe(true);
    expect(errors.certificateId).toBeNull();
    expect(errors.recipientName).toBeNull();
    expect(errors.affiliation).toBeNull();
    expect(errors.paperTitle).toBeNull();
  });

  it('accepts names with different titles', () => {
    for (const name of ['Dr. Jane Smith', 'Mr. John Doe', 'Ms. Alice Kumar', 'Prof. Rajan']) {
      const { isValid } = validateCertificateForm(validForm({ recipientName: name }));
      expect(isValid).toBe(true);
    }
  });

  it('trims whitespace from fields', () => {
    const { sanitized } = validateCertificateForm(
      validForm({
        certificateId: '  ICET-2026-001  ',
        recipientName: '  Dr. Jane Smith  ',
        affiliation: '  MIT  ',
      })
    );
    expect(sanitized.certificateId).toBe('ICET-2026-001');
    expect(sanitized.recipientName).toBe('Dr. Jane Smith');
    expect(sanitized.affiliation).toBe('MIT');
  });
});

describe('validateCertificateForm — empty certificateId', () => {
  it('fails when certificateId is empty', () => {
    const { isValid, errors } = validateCertificateForm(validForm({ certificateId: '' }));
    expect(isValid).toBe(false);
    expect(errors.certificateId).toBeTruthy();
  });

  it('fails when certificateId is whitespace only', () => {
    const { isValid, errors } = validateCertificateForm(validForm({ certificateId: '    ' }));
    expect(isValid).toBe(false);
    expect(errors.certificateId).toBeTruthy();
  });
});

describe('validateCertificateForm — empty name', () => {
  it('fails when recipientName is empty', () => {
    const { isValid, errors } = validateCertificateForm(validForm({ recipientName: '' }));
    expect(isValid).toBe(false);
    expect(errors.recipientName).toBeTruthy();
  });

  it('fails when recipientName is whitespace only', () => {
    const { isValid, errors } = validateCertificateForm(validForm({ recipientName: '    ' }));
    expect(isValid).toBe(false);
    expect(errors.recipientName).toBeTruthy();
  });
});

describe('validateCertificateForm — empty affiliation', () => {
  it('fails when affiliation is empty', () => {
    const { isValid, errors } = validateCertificateForm(validForm({ affiliation: '' }));
    expect(isValid).toBe(false);
    expect(errors.affiliation).toBeTruthy();
  });
});

describe('validateCertificateForm — empty paper title', () => {
  it('fails when paperTitle is empty', () => {
    const { isValid, errors } = validateCertificateForm(validForm({ paperTitle: '' }));
    expect(isValid).toBe(false);
    expect(errors.paperTitle).toBeTruthy();
  });
});

describe('validateCertificateForm — max length', () => {
  it('fails when certificateId exceeds 50 characters', () => {
    const { isValid, errors } = validateCertificateForm(validForm({ certificateId: 'X'.repeat(51) }));
    expect(isValid).toBe(false);
    expect(errors.certificateId).toBeTruthy();
  });

  it('passes when certificateId is exactly 50 characters', () => {
    const { isValid } = validateCertificateForm(validForm({ certificateId: 'X'.repeat(50) }));
    expect(isValid).toBe(true);
  });

  it('fails when recipientName exceeds 100 characters', () => {
    const { isValid, errors } = validateCertificateForm(validForm({ recipientName: 'A'.repeat(101) }));
    expect(isValid).toBe(false);
    expect(errors.recipientName).toBeTruthy();
  });

  it('passes when recipientName is exactly 100 characters', () => {
    const { isValid } = validateCertificateForm(validForm({ recipientName: 'A'.repeat(100) }));
    expect(isValid).toBe(true);
  });

  it('fails when affiliation exceeds 150 characters', () => {
    const { isValid, errors } = validateCertificateForm(validForm({ affiliation: 'B'.repeat(151) }));
    expect(isValid).toBe(false);
  });

  it('fails when paperTitle exceeds 250 characters', () => {
    const { isValid, errors } = validateCertificateForm(validForm({ paperTitle: 'C'.repeat(251) }));
    expect(isValid).toBe(false);
  });
});

describe('validateCertificateForm — unicode and special characters', () => {
  it('accepts unicode names', () => {
    const { isValid } = validateCertificateForm(
      validForm({ recipientName: 'Dr. Müller-Thürgau Çelik' })
    );
    expect(isValid).toBe(true);
  });

  it('accepts apostrophes in names', () => {
    const { isValid } = validateCertificateForm(
      validForm({ recipientName: "Mr. O'Connor" })
    );
    expect(isValid).toBe(true);
  });

  it('accepts hyphenated names', () => {
    const { isValid } = validateCertificateForm(
      validForm({ recipientName: 'Ms. Smith-Jones' })
    );
    expect(isValid).toBe(true);
  });
});

describe('formatCertificateId', () => {
  it('adds ID: prefix when missing', () => {
    expect(formatCertificateId('101')).toBe('ID: 101');
    expect(formatCertificateId('ICET-2026-001')).toBe('ID: ICET-2026-001');
  });

  it('preserves existing ID prefix without duplication', () => {
    expect(formatCertificateId('ID: 101')).toBe('ID: 101');
    expect(formatCertificateId('ID: ICET-2026-001')).toBe('ID: ICET-2026-001');
    expect(formatCertificateId('id-101')).toBe('id-101');
  });

  it('returns empty string for empty input', () => {
    expect(formatCertificateId('')).toBe('');
    expect(formatCertificateId(null)).toBe('');
  });
});

describe('isFormFilled', () => {
  it('returns true when all fields have content', () => {
    expect(isFormFilled(validForm())).toBe(true);
  });

  it('returns false when certificateId is empty', () => {
    expect(isFormFilled(validForm({ certificateId: '' }))).toBe(false);
  });

  it('returns false when recipientName is empty', () => {
    expect(isFormFilled(validForm({ recipientName: '' }))).toBe(false);
  });

  it('returns false when affiliation is empty', () => {
    expect(isFormFilled(validForm({ affiliation: '' }))).toBe(false);
  });

  it('returns false when paperTitle is empty', () => {
    expect(isFormFilled(validForm({ paperTitle: '' }))).toBe(false);
  });
});
