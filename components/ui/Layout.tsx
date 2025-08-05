'use client';

import BottomNavigation from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // TODO: Implement dark mode toggle functionality
  const darkMode = false;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <div className="pb-20">
          {children}
        </div>
        <BottomNavigation />
      </div>
    </div>
  );
}