export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600">
      <div className="relative w-16 h-16">
        {/* Spinner base */}
        <svg
          className="animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-white opacity-20 blur-xl animate-pulse"></div>
      </div>
      <p className="mt-6 text-white text-lg font-semibold tracking-wide drop-shadow-md">
        Loading, please wait...
      </p>
    </div>
  )
}
