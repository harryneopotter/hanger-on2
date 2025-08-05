
'use client';

interface HeaderProps {
  title: string;
  showThemeToggle?: boolean;
  onThemeToggle?: () => void;
  darkMode?: boolean;
}

export default function Header({ title, showThemeToggle = false, onThemeToggle, darkMode = false }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.1),-2px_-2px_8px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3),-2px_-2px_8px_rgba(255,255,255,0.02)] border-b border-white/30 dark:border-gray-700/50 z-50">
      <div className="flex items-center justify-between px-6 h-16">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <i className="ri-handbag-line text-xl text-indigo-600 dark:text-indigo-400 drop-shadow-sm"></i>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white font-['Pacifico'] drop-shadow-sm">
            {title}
          </h1>
        </div>
        {showThemeToggle && (
          <button
            onClick={onThemeToggle}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50/80 dark:bg-gray-700/80 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.03)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-3px_-3px_9px_rgba(255,255,255,0.9)] dark:hover:shadow-[6px_6px_12px_rgba(0,0,0,0.4),-3px_-3px_9px_rgba(255,255,255,0.05)] transition-all duration-200 backdrop-blur-sm border border-white/20 dark:border-gray-600/30"
          >
            <i className={`${darkMode ? 'ri-sun-line' : 'ri-moon-line'} text-lg text-gray-600 dark:text-gray-300 drop-shadow-sm`}></i>
          </button>
        )}
      </div>
    </header>
  );
}
