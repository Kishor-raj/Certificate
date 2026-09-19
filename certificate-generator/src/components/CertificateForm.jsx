/**
 * CertificateForm Component
 *
 * The main certificate input form with three dynamic fields matching sample-needed-output.pdf:
 * - Full Name (e.g. "Kishor Raj SA")
 * - Affiliation (e.g. "Government Arts and Science College Veerapandi")
 * - Paper / Presentation Title (e.g. "Deep Learning and Machine Learning")
 */
import TextInput from './TextInput.jsx';
import TextArea from './TextArea.jsx';
import { VALIDATION } from '../config/certificateConfig.js';

export default function CertificateForm({ formData, errors, onChange, disabled }) {
  return (
    <div className="space-y-5">
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
      />
    </div>
  );
}
