import { useState, useEffect } from 'react';

export function useTheme(): readonly [string, (value: string) => void] {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selectedTheme');
      if (stored !== null) return stored;
      return 'indigo'; // default theme
    }
    return 'indigo';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('selectedTheme', theme);
    } catch {
      // ignore write errors
    }
  }, [theme]);

  return [theme, setTheme] as const;
}
