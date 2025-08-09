import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        {/* Placeholder for search icon */}
        <i className="ri-search-line text-gray-400 dark:text-gray-500 drop-shadow-sm"></i>
      </div>
      <input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={onChange}
        aria-label="Search garments"
        role="searchbox"
        className="w-full pl-12 pr-4 py-3 bg-gray-50/80 dark:bg-gray-800/80 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 text-sm shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-2px_-2px_6px_rgba(255,255,255,0.7)] dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/20 dark:border-gray-700/30 focus:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.1),inset_-3px_-3px_9px_rgba(255,255,255,0.8)] dark:focus:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.4),inset_-3px_-3px_9px_rgba(255,255,255,0.03)]"
      />
    </div>
  );
};

export default SearchBar;
