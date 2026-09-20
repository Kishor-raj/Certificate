/**
 * TextArea Component
 *
 * Accessible multi-line textarea for the paper/presentation title,
 * supporting optional header controls (such as font size adjusters).
 */
import ValidationMessage from './ValidationMessage.jsx';

export default function TextArea({
  id,
  label,
  name,
  value,
  onChange,
  error,
  disabled,
  placeholder,
  maxLength,
  rows = 3,
  required = true,
  extraHeader,
}) {
  const errorId = `${id}-error`;
  const countId = `${id}-count`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-gray-700"
        >
          {label}{' '}
          {required && (
            <span className="text-red-500" aria-label="required">*</span>
          )}
        </label>

        <div className="flex items-center gap-2">
          {extraHeader}
          {maxLength && (
            <span id={countId} className="text-xs text-gray-400" aria-live="polite">
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      </div>

      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        required={required}
        aria-required={required ? 'true' : 'false'}
        aria-describedby={[error ? errorId : '', maxLength ? countId : ''].filter(Boolean).join(' ') || undefined}
        aria-invalid={error ? 'true' : 'false'}
        className={[
          'block w-full rounded-md border px-3 py-2 text-sm shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'bg-white text-gray-900 placeholder-gray-400',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          'resize-y',
          error ? 'border-red-500' : 'border-gray-300',
        ].join(' ')}
      />

      <ValidationMessage message={error} id={errorId} />
    </div>
  );
}
