'use client';

import React, { useState } from 'react';
import { CreateTag } from '@/lib/validation/schemas';

interface TagInputProps {
  onTagAdded?: (tag: any) => void;
  disabled?: boolean;
}

export default function TagInput({ onTagAdded, disabled = false }: TagInputProps) {
  const [tagName, setTagName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTag = async () => {
    if (!tagName.trim() || isLoading || disabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const tagData: CreateTag = {
        name: tagName.trim(),
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
      };

      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create tag');
      }

      const createdTag = await response.json();
      setTagName('');
      onTagAdded?.(createdTag);
    } catch (error) {
      console.error('Error creating tag:', error);
      setError(error instanceof Error ? error.message : 'Failed to create tag');
    } finally {
      setIsLoading(false);
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
    <div className="space-y-2">
      <div className="flex items-center bg-gray-50/50 dark:bg-gray-800/50 rounded-full shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-2px_-2px_6px_rgba(255,255,255,0.6)] dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.01)] overflow-hidden pr-2">
        <input
          type="text"
          value={tagName}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Add tag..."
          disabled={isLoading || disabled}
          className="flex-grow px-4 py-2.5 bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none font-['Inter'] disabled:opacity-50"
          style={{ minHeight: '44px' }} // Ensure minimum touch target height
        />
        <button
          onClick={handleAddTag}
          disabled={isLoading || disabled || !tagName.trim()}
          className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full font-medium shadow-[2px_2px_5px_rgba(0,0,0,0.2)] hover:shadow-[3px_3px_6px_rgba(0,0,0,0.3)] transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ minWidth: '44px', minHeight: '44px' }} // Ensure minimum touch target size
        >
          {isLoading ? '...' : 'Add'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm px-4">{error}</p>}
    </div>
  );
}
