'use client';

import Link from 'next/link';

interface HeaderProps {
  title: string;
  showThemeToggle?: boolean;
  onThemeToggle?: () => void;
  darkMode?: boolean;
}

export default function Header({
  title,
  showThemeToggle = false,
  onThemeToggle,
  darkMode = false,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-white/30 dark:border-gray-700/50 z-50">
      <div className="flex items-center justify-between px-6 h-16 relative">
        {/* Account link - moved to left */}
        <div className="flex items-center space-x-2">
          <Link
            href="/account"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50/80 dark:bg-gray-700/80 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.03)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-3px_-3px_9px_rgba(255,255,255,0.9)] dark:hover:shadow-[6px_6px_12px_rgba(0,0,0,0.4),-3px_-3px_9px_rgba(255,255,255,0.05)] transition-all duration-300"
          >
            <i className="ri-user-line text-lg text-gray-600 dark:text-gray-300 drop-shadow-sm" />
          </Link>
        </div>

        {/* Logo + Title - centered */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
          <i className="ri-handbag-line text-xl text-theme-primary-dark dark:text-theme-primary" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white font-['Pacifico']">
            {title}
          </h1>
        </div>

        {/* Theme toggle - moved to right */}
        <div className="flex items-center space-x-2">
          {showThemeToggle && (
            <button
              onClick={onThemeToggle}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50/80 dark:bg-gray-700/80 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.03)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-3px_-3px_9px_rgba(255,255,255,0.9)] dark:hover:shadow-[6px_6px_12px_rgba(0,0,0,0.4),-3px_-3px_9px_rgba(255,255,255,0.05)] transition-all duration-300"
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
    </header>
  );
}