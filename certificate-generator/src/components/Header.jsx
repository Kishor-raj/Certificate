/**
 * Header Component
 *
 * Application header with branding and conference details.
 */
export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col items-center text-center gap-1">
          <p className="text-xs sm:text-sm font-medium tracking-widest text-blue-200 uppercase">
            Government Arts and Science College, Veerapandi
          </p>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
            ICET-AIDCDC 2026
          </h1>
          <p className="text-sm sm:text-base text-blue-200 font-medium">
            Certificate Generator
          </p>
          <p className="text-xs text-blue-300 mt-1">
            International Conference on Emerging Trends in Artificial Intelligence,
            Data Science, Cyber Security &amp; Digital Computing
          </p>
          <p className="text-xs text-blue-300 font-semibold tracking-wide mt-0.5">
            22nd &amp; 23rd September 2026
          </p>
        </div>
      </div>
    </header>
  );
}
