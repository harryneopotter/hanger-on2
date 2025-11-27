'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 via-white to-orange-50">
          <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-2xl p-8">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-600"
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
            <h1 className="text-2xl font-bold mb-3 text-gray-900">
              Critical Error
            </h1>

            <p className="mb-6 text-gray-600">
              We encountered a critical error. Please try refreshing the page.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && error.message && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                <p className="text-xs font-mono text-gray-700">
                  <strong>Error:</strong> {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs font-mono mt-2 text-gray-600">
                    <strong>Digest:</strong> {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-red-500/30"
              >
                Try Again
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl font-medium transition-all duration-200"
              >
                Reload Page
              </button>
            </div>

            {/* Support Information */}
            <p className="mt-6 text-sm text-gray-500">
              If this problem persists, please contact support or{' '}
              <a
                href="https://github.com/harryneopotter/hanger-on2/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-red-600 hover:text-red-700"
              >
                report an issue
              </a>
              .
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
