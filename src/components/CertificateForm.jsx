/**
 * CertificateForm Component
 *
 * The main certificate input form with four dynamic fields:
 * - Certificate ID (e.g. "ICET-2026-001")
 * - Full Name (e.g. "Kishor Raj SA")
 * - Affiliation (e.g. "Government Arts and Science College Veerapandi")
 * - Paper / Presentation Title (e.g. "Deep Learning and Machine Learning")
 *
 * Each field features interactive font-size adjustment controls.
 */
import TextInput from './TextInput.jsx';
import TextArea from './TextArea.jsx';
import FontSizeControl from './FontSizeControl.jsx';
import { VALIDATION, FONT_SIZE_LIMITS } from '../config/certificateConfig.js';

export default function CertificateForm({
  formData,
  errors,
  onChange,
  fontSizes,
  onFontSizeChange,
  disabled,
}) {
  return (
    <div className="space-y-5">
      {/* Certificate ID */}
      <TextInput
        id="certificate-id"
        label="Certificate ID"
        name="certificateId"
        value={formData.certificateId}
        onChange={(value) => onChange('certificateId', value)}
        error={errors.certificateId}
        disabled={disabled}
        placeholder="e.g. ICET-2026-001"
        maxLength={VALIDATION.certificateId.maxLength}
        required
        extraHeader={
          <FontSizeControl
            field="certificateId"
            fontSize={fontSizes.certificateId}
            limits={FONT_SIZE_LIMITS.certificateId}
            onChange={onFontSizeChange}
            disabled={disabled}
          />
        }
      />

      {/* Full Name */}
      <TextInput
        id="recipient-name"
        label="Full Name"
        name="recipientName"
        value={formData.recipientName}
        onChange={(value) => onChange('recipientName', value)}
        error={errors.recipientName}
        disabled={disabled}
        placeholder="e.g. Kishor Raj SA"
        maxLength={VALIDATION.recipientName.maxLength}
        required
        extraHeader={
          <FontSizeControl
            field="recipientName"
            fontSize={fontSizes.recipientName}
            limits={FONT_SIZE_LIMITS.recipientName}
            onChange={onFontSizeChange}
            disabled={disabled}
          />
        }
      />

      {/* Affiliation */}
      <TextInput
        id="affiliation"
        label="Affiliation"
        name="affiliation"
        value={formData.affiliation}
        onChange={(value) => onChange('affiliation', value)}
        error={errors.affiliation}
        disabled={disabled}
        placeholder="e.g. Government Arts and Science College Veerapandi"
        maxLength={VALIDATION.affiliation.maxLength}
        required
        extraHeader={
          <FontSizeControl
            field="affiliation"
            fontSize={fontSizes.affiliation}
            limits={FONT_SIZE_LIMITS.affiliation}
            onChange={onFontSizeChange}
            disabled={disabled}
          />
        }
      />

      {/* Paper / Presentation Title */}
      <TextArea
        id="paper-title"
        label="Paper / Presentation Title"
        name="paperTitle"
        value={formData.paperTitle}
        onChange={(value) => onChange('paperTitle', value)}
        error={errors.paperTitle}
        disabled={disabled}
        placeholder="e.g. Deep Learning and Machine Learning"
        maxLength={VALIDATION.paperTitle.maxLength}
        rows={3}
        required
        extraHeader={
          <FontSizeControl
            field="paperTitle"
            fontSize={fontSizes.paperTitle}
            limits={FONT_SIZE_LIMITS.paperTitle}
            onChange={onFontSizeChange}
            disabled={disabled}
          />
        }
      />
    </div>
  );
}
