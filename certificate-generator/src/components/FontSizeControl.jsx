/**
 * FontSizeControl Component
 *
 * Provides accessible, clean stepper buttons (− and +) to adjust font size,
 * with current point size display and an optional reset button.
 */

export default function FontSizeControl({
  field,
  fontSize,
  limits,
  onChange,
  disabled = false,
}) {
  const isDefault = fontSize === limits.default;

  return (
    <div
      className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-0.5 shadow-2xs text-xs"
      role="group"
      aria-label={`${field} font size controls`}
    >
      <button
        type="button"
        onClick={() => onChange(field, Math.max(limits.min, fontSize - limits.step))}
        disabled={disabled || fontSize <= limits.min}
        className="w-5 h-5 flex items-center justify-center rounded bg-white text-gray-700 font-bold border border-gray-100 hover:bg-gray-100 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        title={`Decrease font size (min ${limits.min}pt)`}
        aria-label={`Decrease ${field} font size`}
      >
        −
      </button>

      <span
        className="px-1.5 min-w-[2.8rem] text-center font-bold text-blue-900 select-none text-[11px]"
        aria-live="polite"
      >
        {fontSize} pt
      </span>

      <button
        type="button"
        onClick={() => onChange(field, Math.min(limits.max, fontSize + limits.step))}
        disabled={disabled || fontSize >= limits.max}
        className="w-5 h-5 flex items-center justify-center rounded bg-white text-gray-700 font-bold border border-gray-100 hover:bg-gray-100 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        title={`Increase font size (max ${limits.max}pt)`}
        aria-label={`Increase ${field} font size`}
      >
        +
      </button>

      {!isDefault && (
        <button
          type="button"
          onClick={() => onChange(field, limits.default)}
          disabled={disabled}
          className="ml-0.5 px-1.5 h-5 text-[10px] text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors font-medium"
          title="Reset to default font size"
        >
          Reset
        </button>
      )}
    </div>
  );
}
