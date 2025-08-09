'use client';

import React, { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface CompactFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  availableTags: string[];
  selectedTags: string[];
  onTagSelect: (tagName: string) => void;
  availableStatuses: string[];
  selectedStatuses: string[];
  onStatusSelect: (status: string) => void;
}

const CompactFilterBar: React.FC<CompactFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  availableTags,
  selectedTags,
  onTagSelect,
  availableStatuses,
  selectedStatuses,
  onStatusSelect,
}) => {
  const [theme] = useTheme();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const hasActiveFilters =
    selectedTags.length > 0 || selectedStatuses.length > 0 || searchQuery.length > 0;

  return (
    <>
      {/* Compact Filter Bar */}
      <div className="px-6 py-4">
        <div className="flex gap-3">
          {/* Search Button */}
          <button
            onClick={() => setShowSearchModal(true)}
            className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 ${
              searchQuery
                ? 'bg-theme-primary text-white shadow-md'
                : 'bg-gray-50/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } shadow-[4px_4px_8px_rgba(0,0,0,0.06),-2px_-2px_6px_rgba(255,255,255,0.7)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/20 dark:border-gray-700/30`}
          >
            <i className="ri-search-line text-lg"></i>
            <span className="text-sm font-medium truncate">{searchQuery || 'Search...'}</span>
          </button>

          {/* Tags Button */}
          <button
            onClick={() => setShowTagsModal(true)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 ${
              selectedTags.length > 0
                ? 'bg-theme-primary text-white shadow-md'
                : 'bg-gray-50/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } shadow-[4px_4px_8px_rgba(0,0,0,0.06),-2px_-2px_6px_rgba(255,255,255,0.7)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/20 dark:border-gray-700/30`}
          >
            <i className="ri-price-tag-3-line text-lg"></i>
            <span className="text-sm font-medium">
              Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
            </span>
          </button>

          {/* Status Button */}
          <button
            onClick={() => setShowStatusModal(true)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 ${
              selectedStatuses.length > 0
                ? 'bg-theme-primary text-white shadow-md'
                : 'bg-gray-50/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            } shadow-[4px_4px_8px_rgba(0,0,0,0.06),-2px_-2px_6px_rgba(255,255,255,0.7)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/20 dark:border-gray-700/30`}
          >
            <i className="ri-checkbox-circle-line text-lg"></i>
            <span className="text-sm font-medium">
              Status {selectedStatuses.length > 0 && `(${selectedStatuses.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Search</h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <i className="ri-close-line text-xl text-gray-500 dark:text-gray-400"></i>
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <i className="ri-search-line text-gray-400 dark:text-gray-500"></i>
              </div>
              <input
                type="text"
                placeholder="Search garments..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-theme-primary border border-gray-200 dark:border-gray-600"
                autoFocus
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  onSearchChange('');
                  setShowSearchModal(false);
                }}
                className="flex-1 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => setShowSearchModal(false)}
                className="flex-1 px-4 py-2 text-sm bg-theme-primary text-white rounded-lg hover:bg-theme-primary/90 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tags Modal */}
      {showTagsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filter by Tags
              </h3>
              <button
                onClick={() => setShowTagsModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <i className="ri-close-line text-xl text-gray-500 dark:text-gray-400"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {availableTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      className={`px-3 py-2 text-sm rounded-full transition-colors duration-200 ${
                        selectedTags.includes(tag)
                          ? 'bg-theme-primary text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      onClick={() => onTagSelect(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No tags available
                </p>
              )}
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={() => {
                  selectedTags.forEach((tag) => onTagSelect(tag));
                }}
                className="flex-1 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowTagsModal(false)}
                className="flex-1 px-4 py-2 text-sm bg-theme-primary text-white rounded-lg hover:bg-theme-primary/90 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filter by Status
              </h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <i className="ri-close-line text-xl text-gray-500 dark:text-gray-400"></i>
              </button>
            </div>
            <div className="space-y-2">
              {availableStatuses.map((status) => (
                <button
                  key={status}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 ${
                    selectedStatuses.includes(status)
                      ? 'bg-theme-primary text-white shadow-sm'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => onStatusSelect(status)}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedStatuses.includes(status)
                        ? 'border-white'
                        : 'border-gray-400 dark:border-gray-500'
                    }`}
                  >
                    {selectedStatuses.includes(status) && <i className="ri-check-line text-xs"></i>}
                  </div>
                  <span className="text-sm font-medium">{status}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  selectedStatuses.forEach((status) => onStatusSelect(status));
                }}
                className="flex-1 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 px-4 py-2 text-sm bg-theme-primary text-white rounded-lg hover:bg-theme-primary/90 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompactFilterBar;
