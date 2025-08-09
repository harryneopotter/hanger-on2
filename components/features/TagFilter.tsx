'use client';

import React from 'react';

interface Tag {
  name: string;
  // Add other tag properties if needed
}

interface TagFilterProps {
  availableTags: Tag[];
  selectedTags: string[];
  onTagToggle: (tagName: string) => void;
}

export default function TagFilter({ availableTags, selectedTags, onTagToggle }: TagFilterProps) {
  const isSelected = (tagName: string) => selectedTags.includes(tagName);

  return (
    <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05),inset_-2px_-2px_6px_rgba(255,255,255,0.5)] dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2),inset_-2px_-2px_6px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Filter by Tags</h4>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <button
            key={tag.name}
            onClick={() => onTagToggle(tag.name)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${
                isSelected(tag.name)
                  ? 'bg-blue-500 text-white shadow-[inset_2px_2px_5px_rgba(3,105,161,0.3),inset_-2px_-2px_5px_rgba(255,255,255,0.3)] dark:bg-blue-700 dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(3,105,161,0.1)]'
                  : 'bg-gray-100/80 text-gray-700 shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,0.7)] hover:shadow-[4px_4px_8px_rgba(0,0,0,0.08),-3px_-3px_6px_rgba(255,255,255,0.8)] dark:bg-gray-700/50 dark:text-gray-300 dark:shadow-[2px_2px_5px_rgba(0,0,0,0.3),-2px_-2px_5px_rgba(255,255,255,0.03)] dark:hover:shadow-[4px_4px_8px_rgba(0,0,0,0.4),-3px_-3px_6px_rgba(255,255,255,0.05)]'
              }
              min-w-[44px] min-h-[44px] flex items-center justify-center
            `}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}
