import { useState, useEffect } from 'react';

export function useDarkMode(): readonly [boolean, (value: boolean) => void, boolean] {
  const [darkMode, setDarkMode] = useState<boolean>(false);
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
    
    setDarkMode(initialDarkMode);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem('darkMode', darkMode.toString());
    } catch {
      // ignore write errors
    }
  }, [darkMode]);

  return [darkMode, setDarkMode, isHydrated] as const;
}

