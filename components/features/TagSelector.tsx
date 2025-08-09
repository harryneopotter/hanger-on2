'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import TagInput from './TagInput';

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
  disabled?: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TagSelector({
  selectedTags,
  onTagsChange,
  disabled = false,
}: TagSelectorProps) {
  const { data: tags = [], mutate } = useSWR('/api/tags', fetcher);
  const [showAddTag, setShowAddTag] = useState(false);

  const handleTagToggle = (tagId: string) => {
    if (disabled) return;

    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];

    onTagsChange(newSelectedTags);
  };

  const handleTagAdded = (newTag: Tag) => {
    // Update the tags list
    mutate([...tags, newTag], false);
    // Auto-select the newly created tag
    onTagsChange([...selectedTags, newTag.id]);
    setShowAddTag(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
        <button
          type="button"
          onClick={() => setShowAddTag(!showAddTag)}
          disabled={disabled}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {showAddTag ? 'Cancel' : '+ Add New Tag'}
        </button>
      </div>

      {showAddTag && (
        <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <TagInput onTagAdded={handleTagAdded} disabled={disabled} />
        </div>
      )}

      {tags.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Select tags to categorize this garment:
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: Tag) => {
              const isSelected = selectedTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  disabled={disabled}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                    border-2 disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      isSelected
                        ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-500 text-blue-700 dark:text-blue-300 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]'
                        : 'bg-gray-50/80 dark:bg-gray-700/80 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-[2px_2px_4px_rgba(0,0,0,0.1),-1px_-1px_2px_rgba(255,255,255,0.6)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3),-1px_-1px_2px_rgba(255,255,255,0.02)]'
                    }
                  `}
                  style={{
                    borderColor: isSelected ? tag.color : undefined,
                    backgroundColor: isSelected ? `${tag.color}20` : undefined,
                  }}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.name}
                  {isSelected && <span className="ml-1 text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <p className="text-sm">No tags available.</p>
          <p className="text-xs mt-1">Create your first tag to get started!</p>
        </div>
      )}

      {selectedTags.length > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
}
