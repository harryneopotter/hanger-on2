
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Login/signup logic would go here
    console.log(isLogin ? 'Login' : 'Sign up', { email, password, name });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Subtle wardrobe background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-8 h-16 border-2 border-indigo-300 rounded-t-lg"></div>
        <div className="absolute top-20 left-20 w-8 h-16 border-2 border-indigo-300 rounded-t-lg"></div>
        <div className="absolute top-20 left-30 w-8 h-16 border-2 border-indigo-300 rounded-t-lg"></div>
        <div className="absolute bottom-32 right-10 w-8 h-16 border-2 border-indigo-300 rounded-t-lg"></div>
        <div className="absolute bottom-32 right-20 w-8 h-16 border-2 border-indigo-300 rounded-t-lg"></div>
        <div className="absolute bottom-32 right-30 w-8 h-16 border-2 border-indigo-300 rounded-t-lg"></div>
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

        {/* Login/Signup Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all ${
                isLogin
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all ${
                !isLogin
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 !rounded-button"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {isLogin && (
            <div className="mt-4 text-center">
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                Forgot Password?
              </button>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            By continuing, you agree to our{' '}
            <button className="text-indigo-600 hover:text-indigo-700">Terms</button> and{' '}
            <button className="text-indigo-600 hover:text-indigo-700">Privacy Policy</button>
          </div>
        </div>

        {/* Demo Access */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center justify-center space-x-2"
          >
            <i className="ri-handbag-line text-sm"></i>
            <span>Continue as Guest</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
