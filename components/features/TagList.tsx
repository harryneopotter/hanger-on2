import React from 'react';

interface Tag {
  name: string;
  // Add other tag properties if needed
}

interface TagListProps {
  tags: Tag[];
  onRemoveTag?: (tagName: string) => void; // Placeholder for remove functionality
}

const TagList: React.FC<TagListProps> = ({ tags, onRemoveTag }) => {
  return (
    <div className="flex flex-wrap gap-2 p-2">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="inline-flex items-center bg-gray-50/50 dark:bg-gray-800/50 rounded-full px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(255,255,255,0.02)] backdrop-blur-sm"
        >
          {tag.name}
          {/* Placeholder close button/icon */}
          <button
            className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full p-1 opacity-70 hover:opacity-100 transition-opacity"
            onClick={() => onRemoveTag?.(tag.name)} // Placeholder action
            aria-label={`Remove tag ${tag.name}`}
            style={{ minWidth: '24px', minHeight: '24px' }} // Ensure touch target size
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default TagList;