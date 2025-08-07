import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  type?: 'garments' | 'collections' | 'search';
}

export default function EmptyState({
  title = "Nothing here yet",
  message = "Start organizing your wardrobe",
  actionText = "Add your first item",
  actionHref = "/add",
  onAction,
  type = 'garments'
}: EmptyStateProps) {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'collections':
        return {
          title: "No collections yet",
          message: "Create your first collection to organize your wardrobe",
          actionText: "Create collection",
          actionHref: "/collections"
        };
      case 'search':
        return {
          title: "No results found",
          message: "Try adjusting your search or filters",
          actionText: "Clear filters",
          actionHref: "/"
        };
      default:
        return {
          title,
          message,
          actionText,
          actionHref
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="relative mb-6">
        {/* Hanger illustration */}
        <svg 
          className="w-24 h-24 text-gray-300 dark:text-gray-600 mb-4" 
          viewBox="0 0 64 64" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M32 8C20.9543 8 12 16.9543 12 28V36C12 47.0457 20.9543 56 32 56C43.0457 56 52 47.0457 52 36V28C52 16.9543 43.0457 8 32 8Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M32 8V20" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M12 28H52" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M20 40C20 40 24 48 32 48C40 48 44 40 44 40" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            strokeDasharray="2 2"
          />
        </svg>
        
        {/* Subtle decorative elements */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-theme-primary/20 rounded-full"></div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-theme-secondary/20 rounded-full"></div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {content.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-sm">
        {content.message}
      </p>

      {(actionHref || onAction) && (
        onAction ? (
          <button 
            onClick={onAction}
            className="inline-flex items-center px-4 py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-primary-dark transition-colors"
          >
            <svg 
              className="w-4 h-4 mr-2" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 2V12M12 12V22M12 12H2M12 12H22" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            {actionText}
          </button>
        ) : (
          <Link 
            href={content.actionHref}
            className="inline-flex items-center px-4 py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-primary-dark transition-colors"
          >
            <svg 
              className="w-4 h-4 mr-2" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 2V12M12 12V22M12 12H2M12 12H22" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            {content.actionText}
          </Link>
        )
      )}
    </div>
  );
}