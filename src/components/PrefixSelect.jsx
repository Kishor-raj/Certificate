/**
 * PrefixSelect Component
 *
 * Controlled dropdown for selecting the recipient prefix (Dr./Mr./Ms.).
 */
import ValidationMessage from './ValidationMessage.jsx';
import { PREFIX_OPTIONS } from '../config/certificateConfig.js';

export default function PrefixSelect({ value, onChange, error, disabled }) {
  const errorId = 'prefix-error';

  return (
    <div className="space-y-1">
      <label
        htmlFor="prefix-select"
        className="block text-sm font-semibold text-gray-700"
      >
        Prefix <span className="text-red-500" aria-label="required">*</span>
      </label>

      <select
        id="prefix-select"
        name="prefix"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required
        aria-required="true"
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? 'true' : 'false'}
        className={[
          'block w-full rounded-md border px-3 py-2 text-sm shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'bg-white text-gray-900',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          error ? 'border-red-500' : 'border-gray-300',
        ].join(' ')}
      >
        <option value="" disabled>
          Select prefix…
        </option>
        {PREFIX_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <ValidationMessage message={error} id={errorId} />
    </div>
  );
}
