import { useState, useEffect } from 'react';

export function useDarkMode(): readonly [boolean, (value: boolean) => void] {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('darkMode');
      if (stored !== null) return stored === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem('darkMode', darkMode.toString());
    } catch {
      // ignore write errors
    }
  }, [darkMode]);

  return [darkMode, setDarkMode] as const;
}

