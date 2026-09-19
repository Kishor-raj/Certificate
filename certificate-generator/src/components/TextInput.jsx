/**
 * TextInput Component
 *
 * Accessible single-line text input for recipient name and affiliation.
 */
import ValidationMessage from './ValidationMessage.jsx';

export default function TextInput({
  id,
  label,
  name,
  value,
  onChange,
  error,
  disabled,
  placeholder,
  maxLength,
  required = true,
  hint,
}) {
  const errorId = `${id}-error`;
  const hintId  = `${id}-hint`;
  const countId = `${id}-count`;

  const describedBy = [
    hint   ? hintId  : '',
    error  ? errorId : '',
    maxLength ? countId : '',
  ].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-gray-700"
        >
          {label}{' '}
          {required && (
            <span className="text-red-500" aria-label="required">*</span>
          )}
        </label>
        {maxLength && (
          <span id={countId} className="text-xs text-gray-400" aria-live="polite">
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      {hint && (
        <p id={hintId} className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1">
          💡 {hint}
        </p>
      )}

      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        aria-required={required ? 'true' : 'false'}
        aria-describedby={describedBy}
        aria-invalid={error ? 'true' : 'false'}
        className={[
          'block w-full rounded-md border px-3 py-2 text-sm shadow-sm',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'bg-white text-gray-900 placeholder-gray-400',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          error ? 'border-red-500' : 'border-gray-300',
        ].join(' ')}
      />

      <ValidationMessage message={error} id={errorId} />
    </div>
  );
}
