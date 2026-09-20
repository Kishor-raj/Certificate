/**
 * App — Root Component
 *
 * Orchestrates the certificate generation workflow:
 * 1. Manage form state (recipientName, affiliation, paperTitle).
 * 2. Manage font sizes state with live preview updates.
 * 3. Run validation.
 * 4. Trigger PDF generation with custom font sizes.
 * 5. Handle download.
 * 6. Support reset/regeneration.
 *
 * Layout: two-column (desktop) / single-column (mobile)
 */

import { useState, useCallback, useEffect } from 'react';
import Header from './components/Header.jsx';
import CertificateForm from './components/CertificateForm.jsx';
import CertificatePreview from './components/CertificatePreview.jsx';
import DownloadActions from './components/DownloadActions.jsx';
import { INITIAL_FORM_STATE, DEFAULT_FONT_SIZES } from './config/certificateConfig.js';
import { validateCertificateForm } from './utils/validation.js';
import { generateCertificate, downloadPdf } from './services/pdfGenerator.js';
import { loadTemplate } from './services/templateLoader.js';

const GEN_STATE = {
  IDLE: 'idle',
  GENERATING: 'generating',
  READY: 'ready',
  ERROR: 'error',
};

export default function App() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [fontSizes, setFontSizes] = useState(DEFAULT_FONT_SIZES);
  const [errors, setErrors] = useState({
    certificateId: null,
    recipientName: null,
    affiliation: null,
    paperTitle: null,
  });
  const [touched, setTouched] = useState({
    certificateId: false,
    recipientName: false,
    affiliation: false,
    paperTitle: false,
  });
  const [generationState, setGenerationState] = useState(GEN_STATE.IDLE);
  const [errorMessage, setErrorMessage] = useState('');
  const isGenerating = generationState === GEN_STATE.GENERATING;

  // Pre-load template on mount for faster first generation
  useEffect(() => {
    loadTemplate().catch((err) => {
      console.warn('Template pre-load failed:', err.message);
    });
  }, []);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      setTouched((t) => {
        if (!t[field]) return t;
        const { errors: newErrors } = validateCertificateForm(next);
        setErrors((prevErrors) => ({ ...prevErrors, [field]: newErrors[field] }));
        return t;
      });
      return next;
    });
  }, []);

  const handleFontSizeChange = useCallback((field, newSize) => {
    setFontSizes((prev) => ({
      ...prev,
      [field]: newSize,
    }));
  }, []);

  const handleBlur = useCallback(
    (field) => {
      setTouched((prev) => {
        if (prev[field]) return prev;
        const next = { ...prev, [field]: true };
        const { errors: newErrors } = validateCertificateForm(formData);
        setErrors((prevErrors) => ({ ...prevErrors, [field]: newErrors[field] }));
        return next;
      });
    },
    [formData]
  );

  const handleGenerate = useCallback(async () => {
    setTouched({ certificateId: true, recipientName: true, affiliation: true, paperTitle: true });
    const { isValid, errors: validationErrors, sanitized } = validateCertificateForm(formData);
    setErrors(validationErrors);

    if (!isValid) return;

    setGenerationState(GEN_STATE.GENERATING);
    setErrorMessage('');

    try {
      const { bytes, filename } = await generateCertificate(sanitized, fontSizes);
      downloadPdf(bytes, filename);
      setGenerationState(GEN_STATE.READY);
    } catch (err) {
      console.error('Certificate generation error:', err);
      setGenerationState(GEN_STATE.ERROR);
      setErrorMessage(
        err.message || 'An unexpected error occurred. Please check your input and try again.'
      );
    }
  }, [formData, fontSizes]);

  const handleReset = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setFontSizes(DEFAULT_FONT_SIZES);
    setErrors({ certificateId: null, recipientName: null, affiliation: null, paperTitle: null });
    setTouched({ certificateId: false, recipientName: false, affiliation: false, paperTitle: false });
    setGenerationState(GEN_STATE.IDLE);
    setErrorMessage('');
  }, []);

  const { isValid } = validateCertificateForm(formData);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* ── Left column: Form + Actions ── */}
          <div className="space-y-6">
            <section
              aria-labelledby="form-heading"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100 flex-wrap gap-2">
                <h2
                  id="form-heading"
                  className="text-lg font-bold text-gray-900"
                >
                  Certificate Details
                </h2>
                <span className="text-xs text-gray-400">
                  Adjust font sizes with − / +
                </span>
              </div>

              <div onBlur={(e) => {
                const name = e.target.name;
                if (name && name in touched) handleBlur(name);
              }}>
                <CertificateForm
                  formData={formData}
                  errors={errors}
                  onChange={handleChange}
                  fontSizes={fontSizes}
                  onFontSizeChange={handleFontSizeChange}
                  disabled={isGenerating}
                />
              </div>
            </section>

            <section
              aria-labelledby="actions-heading"
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h2 id="actions-heading" className="sr-only">Generate Certificate</h2>
              <DownloadActions
                isValid={isValid}
                isGenerating={isGenerating}
                generationState={generationState}
                errorMessage={errorMessage}
                onGenerate={handleGenerate}
                onReset={handleReset}
              />
            </section>
          </div>

          {/* ── Right column: Live Preview ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Certificate Preview
              </h2>
              <span className="text-xs text-gray-400">
                Preview updates as you type & adjust size
              </span>
            </div>

            <CertificatePreview formData={formData} fontSizes={fontSizes} />

            <p className="text-xs text-center text-gray-400">
              The live preview renders in real-time. The downloaded PDF matches preview geometry exactly.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
          <p className="text-xs text-gray-400">
            ICET-AIDCDC 2026 Certificate Generator &nbsp;·&nbsp;
            Government Arts and Science College, Veerapandi &nbsp;·&nbsp;
            PG Department of Computer Science
          </p>
        </div>
      </footer>
    </div>
  );
}
