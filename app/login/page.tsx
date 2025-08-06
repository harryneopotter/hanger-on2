
'use client';
import { useDarkMode } from '@/hooks/useDarkMode';

import { signIn, getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [darkMode] = useDarkMode();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    getSession().then((session) => {
      if (session) {
        router.push('/');
      }
    });
  }, [router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Subtle wardrobe background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-8 h-16 border-2 border-theme-primary rounded-t-lg"></div>
                <div className="absolute top-20 left-20 w-8 h-16 border-2 border-theme-primary rounded-t-lg"></div>
                <div className="absolute top-20 left-30 w-8 h-16 border-2 border-theme-primary rounded-t-lg"></div>
                <div className="absolute bottom-32 right-10 w-8 h-16 border-2 border-theme-primary rounded-t-lg"></div>
                <div className="absolute bottom-32 right-20 w-8 h-16 border-2 border-theme-primary rounded-t-lg"></div>
                <div className="absolute bottom-32 right-30 w-8 h-16 border-2 border-theme-primary rounded-t-lg"></div>
      </div>
      
      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-lg">
            <i className="ri-handbag-2-line text-2xl text-white drop-shadow-sm"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-['Pacifico']">
            HangarOn
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
            Your digital closet organizer
          </p>
        </div>

        {/* Google Sign In Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Welcome to HangarOn
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Sign in with your Google account to get started
            </p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-xl border border-gray-200 transition-colors duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            By continuing, you agree to our{' '}
            <button className="text-theme-primary-dark hover:text-theme-primary">Terms</button> and{' '}
                <button className="text-theme-primary-dark hover:text-theme-primary">Privacy Policy</button>
          </div>
        </div>

        {/* Demo Access */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-theme-primary-dark hover:text-theme-primary text-sm font-medium flex items-center justify-center space-x-2"
          >
            <i className="ri-handbag-line text-sm"></i>
            <span>Continue as Guest</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
