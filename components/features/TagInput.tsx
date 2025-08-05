'use client';

import React, { useState } from 'react';

export default function TagInput() {
  const [tagName, setTagName] = useState('');

  const handleAddTag = () => {
    if (tagName.trim()) {
      console.log('Add tag:', tagName.trim());
      // TODO: Implement tag adding logic (call API, etc.)
      setTagName('');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagName(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="flex items-center bg-gray-50/50 dark:bg-gray-800/50 rounded-full shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-2px_-2px_6px_rgba(255,255,255,0.6)] dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.01)] overflow-hidden pr-2">
      <input
        type="text"
        value={tagName}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Add tag..."
        className="flex-grow px-4 py-2.5 bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none font-['Inter']"
        style={{ minHeight: '44px' }} // Ensure minimum touch target height
      />
      <button
        onClick={handleAddTag}
        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full font-medium shadow-[2px_2px_5px_rgba(0,0,0,0.2)] hover:shadow-[3px_3px_6px_rgba(0,0,0,0.3)] transition-shadow duration-200"
        style={{ minWidth: '44px', minHeight: '44px' }} // Ensure minimum touch target size
      >
        Add
      </button>
    </div>
  );
}