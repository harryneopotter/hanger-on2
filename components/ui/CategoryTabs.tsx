
'use client';

import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface CategoryTabsProps {
  onCategoryChange: (category: string) => void;
}

export default function CategoryTabs({ onCategoryChange }: CategoryTabsProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [theme] = useTheme(); // Ensure component re-renders when theme changes

  const categories = ['All', 'Shirts', 'Pants', 'Shoes', 'Accessories', 'Outerwear'];

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    onCategoryChange(category);
  };

  return (
    <div className="flex overflow-x-auto gap-3 px-6 py-4 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all duration-300 backdrop-blur-sm !rounded-button ${
            activeCategory === category
              ? 'bg-theme-primary bg-opacity-90 text-white shadow-lg'
              : 'bg-gray-50/80 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.02)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-3px_-3px_9px_rgba(255,255,255,0.9)] dark:hover:shadow-[6px_6px_12px_rgba(0,0,0,0.4),-3px_-3px_9px_rgba(255,255,255,0.03)] border border-white/30 dark:border-gray-600/30'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
