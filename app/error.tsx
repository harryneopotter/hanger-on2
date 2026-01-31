'use client';

import { useEffect } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [darkMode] = useDarkMode();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'dark bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      <div className={`max-w-md w-full text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-8`}>
        {/* Error Icon */}
        <div className="mb-6">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
            darkMode ? 'bg-red-900/30' : 'bg-red-100'
          }`}>
            <svg
              className={`w-10 h-10 ${darkMode ? 'text-red-400' : 'text-red-600'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Something went wrong!
        </h1>

        <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          We're sorry, but something unexpected happened. Don't worry, your data is safe.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className={`mb-6 p-4 rounded-lg text-left ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <p className={`text-xs font-mono ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
              <strong>Error:</strong> {error.message}
            </p>
            {error.digest && (
              <p className={`text-xs font-mono mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                <strong>Digest:</strong> {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={reset}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/50'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30'
            }`}
          >
            Try Again
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            Go Home
          </button>
        </div>

        {/* Support Information */}
        <p className={`mt-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          If this problem persists, please{' '}
          <a
            href="https://github.com/harryneopotter/hanger-on2/issues"
            target="_blank"
            rel="noopener noreferrer"
            className={`underline ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
          >
            report an issue
          </a>
          .
        </p>
      </div>
    </div>
  );
}
