'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useDarkMode } from '@/hooks/useDarkMode';
import Layout from '@/components/ui/Layout';
import Header from '@/components/ui/Header';
import TagInput from '@/components/features/TagInput';
import TagList from '@/components/features/TagList';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TagsPage() {
  const [darkMode, setDarkMode] = useDarkMode();
  const { data: tags = [], mutate } = useSWR('/api/tags', fetcher);

  const handleTagAdded = (newTag: any) => {
    // Optimistically update the UI
    mutate([...tags, newTag], false);
  };

  const handleTagDeleted = (tagId: string) => {
    // Optimistically update the UI
    mutate(
      tags.filter((tag: any) => tag.id !== tagId),
      false,
    );
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Layout>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <Header
          title="Tag Management"
          showThemeToggle
          onThemeToggle={handleThemeToggle}
          darkMode={darkMode}
        />

        <div className="pt-20 px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Manage Your Tags
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create and organize tags to categorize your garments. Tags help you quickly find and
                filter your wardrobe items.
              </p>
            </div>

            {/* Add New Tag Section */}
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 mb-8 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.02)] backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Create New Tag
              </h2>
              <TagInput onTagAdded={handleTagAdded} />
            </div>

            {/* Existing Tags Section */}
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.02)] backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Tags</h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {tags.length} {tags.length === 1 ? 'tag' : 'tags'}
                </span>
              </div>

              <TagList tags={tags} onTagDeleted={handleTagDeleted} showCount={true} />
            </div>

            {/* Usage Tips */}
            <div className="mt-8 bg-blue-50/80 dark:bg-blue-900/20 rounded-2xl p-6 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.02)] backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                💡 Tag Tips
              </h3>
              <ul className="text-blue-800 dark:text-blue-200 space-y-2 text-sm">
                <li>• Use descriptive names like "Summer", "Work", "Casual", "Formal"</li>
                <li>• Tags are automatically assigned random colors for easy identification</li>
                <li>• You can assign multiple tags to each garment when adding or editing items</li>
                <li>• Use the filter panel on the home page to find garments by tags</li>
                <li>• The number in parentheses shows how many garments use each tag</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
