'use client';

import React, { useState } from 'react';

interface Tag {
  id: string;
  name: string;
  color?: string;
  _count?: {
    garments: number;
  };
}

interface TagListProps {
  tags: Tag[];
  onTagDeleted?: (tagId: string) => void;
  showCount?: boolean;
}

const TagList: React.FC<TagListProps> = ({ tags, onTagDeleted, showCount = false }) => {
  const [deletingTags, setDeletingTags] = useState<Set<string>>(new Set());

  const handleDeleteTag = async (tagId: string, tagName: string) => {
    if (deletingTags.has(tagId)) return;
    
    setDeletingTags(prev => new Set(prev).add(tagId));
    
    try {
      const response = await fetch(`/api/tags/${tagId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete tag');
      }
      
      onTagDeleted?.(tagId);
    } catch (error) {
      console.error('Error deleting tag:', error);
      // You might want to show a toast notification here
    } finally {
      setDeletingTags(prev => {
        const newSet = new Set(prev);
        newSet.delete(tagId);
        return newSet;
      });
    }
  };

  if (tags.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No tags yet. Create your first tag above!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 p-2">
      {tags.map((tag) => {
        const isDeleting = deletingTags.has(tag.id);
        const tagStyle = tag.color ? { backgroundColor: tag.color + '20', borderColor: tag.color } : {};
        
        return (
          <div
            key={tag.id}
            className="inline-flex items-center bg-gray-50/50 dark:bg-gray-800/50 rounded-full px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(255,255,255,0.02)] backdrop-blur-sm border"
            style={tagStyle}
          >
            <span className="flex items-center gap-1">
              {tag.color && (
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: tag.color }}
                />
              )}
              {tag.name}
              {showCount && tag._count && (
                <span className="text-xs opacity-70">({tag._count.garments})</span>
              )}
            </span>
            <button
              className="ml-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-full p-1 opacity-70 hover:opacity-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={() => handleDeleteTag(tag.id, tag.name)}
              disabled={isDeleting}
              aria-label={`Remove tag ${tag.name}`}
              style={{ minWidth: '24px', minHeight: '24px' }}
            >
              {isDeleting ? (
                <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default TagList;