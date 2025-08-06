'use client';

import { useState } from 'react';
import BottomNavigation from './BottomNavigation';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useTheme } from '@/hooks/useTheme';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [darkMode] = useDarkMode();
  const [theme] = useTheme();
// removed local darkMode – using useDarkMode hook

  return (
<div className="min-h-screen">
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <div className="pb-20">
          {children}
        </div>
        <BottomNavigation />
      </div>
    </div>
  );
}