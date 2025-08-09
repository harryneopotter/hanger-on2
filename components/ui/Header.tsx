'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface HeaderProps {
  title: string;
  showThemeToggle?: boolean;
  onThemeToggle?: () => void;
  darkMode?: boolean;
  isGuest?: boolean;
}

export default function Header({
  title,
  showThemeToggle = false,
  onThemeToggle,
  darkMode = false,
  isGuest = false,
}: HeaderProps) {
  const { data: session } = useSession();

  const handleAccountClick = (e: React.MouseEvent) => {
    if (isGuest || !session) {
      e.preventDefault();
      window.location.href = '/login';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-white/30 dark:border-gray-700/50">
        <div className="flex items-center justify-between px-6 h-20 relative">
          {/* Navigation links - left side */}
          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50/80 dark:bg-gray-700/80 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.03)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-3px_-3px_9px_rgba(255,255,255,0.9)] dark:hover:shadow-[6px_6px_12px_rgba(0,0,0,0.4),-3px_-3px_9px_rgba(255,255,255,0.05)] transition-all duration-300"
              title="Home"
            >
              <i className="ri-home-line text-lg text-gray-600 dark:text-gray-300 drop-shadow-sm" />
            </Link>
            <Link
              href="/tags"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50/80 dark:bg-gray-700/80 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.03)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-3px_-3px_9px_rgba(255,255,255,0.9)] dark:hover:shadow-[6px_6px_12px_rgba(0,0,0,0.4),-3px_-3px_9px_rgba(255,255,255,0.05)] transition-all duration-300"
              title="Tags"
            >
              <i className="ri-price-tag-3-line text-lg text-gray-600 dark:text-gray-300 drop-shadow-sm" />
            </Link>
          </div>

          {/* Logo + Title - centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
            <svg
              className="w-5 h-5 text-theme-primary-dark dark:text-theme-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 7v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
              <path d="M3 7l2-4h14l2 4" />
              <path d="M8 7v4a4 4 0 0 0 8 0V7" />
            </svg>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white font-inter tracking-tight">
              {title}
            </h1>
            {isGuest && (
              <span className="px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full font-medium">
                Demo Mode
              </span>
            )}
          </div>

          {/* Right side navigation */}
          <div className="flex items-center space-x-2">
            <Link
              href={isGuest || !session ? '/login' : '/account'}
              onClick={handleAccountClick}
              className={`w-10 h-10 flex items-center justify-center rounded-full bg-gray-50/80 dark:bg-gray-700/80 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.03)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-3px_-3px_9px_rgba(255,255,255,0.9)] dark:hover:shadow-[6px_6px_12px_rgba(0,0,0,0.4),-3px_-3px_9px_rgba(255,255,255,0.05)] transition-all duration-300`}
              title={isGuest || !session ? 'Sign in to access account' : 'Account'}
            >
              <i className="ri-user-line text-lg text-gray-600 dark:text-gray-300 drop-shadow-sm" />
            </Link>
            {showThemeToggle && (
              <button
                onClick={onThemeToggle}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50/80 dark:bg-gray-700/80 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.03)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-3px_-3px_9px_rgba(255,255,255,0.9)] dark:hover:shadow-[6px_6px_12px_rgba(0,0,0,0.4),-3px_-3px_9px_rgba(255,255,255,0.05)] transition-all duration-300"
                title="Toggle Theme"
              >
                <i
                  className={`${
                    darkMode ? 'ri-sun-line' : 'ri-moon-line'
                  } text-lg text-gray-600 dark:text-gray-300 drop-shadow-sm`}
                />
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Visual separator bar */}
      <div className="h-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.1),1px_1px_4px_rgba(255,255,255,0.6)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),1px_1px_4px_rgba(255,255,255,0.02)] border-b border-white/30 dark:border-gray-700/50"></div>
    </header>
  );
}
