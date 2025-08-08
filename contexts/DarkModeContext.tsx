'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface DarkModeContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  isHydrated: boolean;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkModeState] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    // Only run on client side after hydration
    const stored = localStorage.getItem('darkMode');
    let initialDarkMode = false;
    
    if (stored !== null) {
      initialDarkMode = stored === 'true';
    } else {
      initialDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    setDarkModeState(initialDarkMode);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      document.documentElement.classList.toggle('dark', darkMode);
      try {
        localStorage.setItem('darkMode', darkMode.toString());
      } catch {
        // ignore write errors
      }
    }
  }, [darkMode, isHydrated]);

  const setDarkMode = (value: boolean) => {
    setDarkModeState(value);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode, isHydrated }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode(): readonly [boolean, (value: boolean) => void, boolean] {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return [context.darkMode, context.setDarkMode, context.isHydrated] as const;
}