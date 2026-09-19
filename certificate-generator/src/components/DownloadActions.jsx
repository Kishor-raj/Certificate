/**
 * DownloadActions Component
 *
 * Renders the Generate PDF / Download / Reset action buttons.
 * Handles loading states and success/error feedback.
 */
import LoadingState from './LoadingState.jsx';

export default function DownloadActions({
  isValid,
  isGenerating,
  generationState, // 'idle' | 'generating' | 'ready' | 'error'
  errorMessage,
  onGenerate,
  onReset,
}) {
  const canGenerate = isValid && !isGenerating;

  return (
    <div className="space-y-3">
      {/* Generation loading indicator */}
      {isGenerating && <LoadingState />}

      {/* Success message */}
      {generationState === 'ready' && !isGenerating && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800"
        >
          <svg className="w-5 h-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Certificate generated and downloaded successfully!</span>
        </div>
      )}

      {/* Error message */}
      {generationState === 'error' && errorMessage && !isGenerating && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800"
        >
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold">Unable to generate the certificate.</p>
            <p className="mt-0.5 text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Generate / Download PDF button */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate}
          aria-disabled={!canGenerate}
          className={[
            'flex-1 inline-flex items-center justify-center gap-2',
            'rounded-md px-5 py-2.5 text-sm font-semibold',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            'transition-colors duration-150',
            canGenerate
              ? 'bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900 cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
          ].join(' ')}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Generate & Download PDF
            </>
          )}
        </button>

        {/* Reset button */}
        <button
          type="button"
          onClick={onReset}
          disabled={isGenerating}
          className={[
            'flex-1 sm:flex-none inline-flex items-center justify-center gap-2',
            'rounded-md border border-gray-300 bg-white px-5 py-2.5',
            'text-sm font-semibold text-gray-700',
            'hover:bg-gray-50 active:bg-gray-100',
            'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2',
            'transition-colors duration-150',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          ].join(' ')}
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Reset
        </button>
      </div>
    </div>
  );
}
