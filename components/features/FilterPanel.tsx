'use client';

import React from 'react';
import { useTheme } from '@/hooks/useTheme';

interface FilterPanelProps {
  availableTags: string[];
  selectedTags: string[];
  onTagSelect: (tagName: string) => void;
  availableStatuses: string[];
  selectedStatuses: string[];
  onStatusSelect: (status: string) => void;
}

/**
 * Horizontal scrollable list of status & tag filters shown below the search bar.
 */
const FilterPanel: React.FC<FilterPanelProps> = ({
  availableTags,
  selectedTags,
  onTagSelect,
  availableStatuses,
  selectedStatuses,
  onStatusSelect,
}) => {
  const [theme] = useTheme(); // Ensure component re-renders when theme changes

  return (
    <div className="space-y-3 py-2">
      {/* Status Filter */}
      {availableStatuses.length > 0 && (
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
          <div className="flex flex-wrap gap-2">
            {availableStatuses.map((status) => (
              <button
                key={status}
                className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                  selectedStatuses.includes(status)
                    ? 'bg-theme-primary text-white shadow-sm'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => onStatusSelect(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tags Filter */}
      {availableTags.length > 0 && (
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags:</span>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                  selectedTags.includes(tag)
                    ? 'bg-theme-primary text-white shadow-sm'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
                onClick={() => onTagSelect(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
