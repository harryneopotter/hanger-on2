
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { useDarkMode } from '@/hooks/useDarkMode';
import Layout from '@/components/ui/Layout';
import Header from '@/components/ui/Header';
import CategoryTabs from '@/components/ui/CategoryTabs';
import SearchBar from '@/components/ui/SearchBar';
import FilterPanel from '@/components/features/FilterPanel';
import GarmentCard from '@/components/features/GarmentCard';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [darkMode, setDarkMode, isHydrated] = useDarkMode();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push('/login');
      return;
    }
  }, [session, status, router]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <Layout>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300 flex items-center justify-center">
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </Layout>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!session) {
    return null;
  }

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Helpers to toggle selection
  const handleStatusSelect = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };
  const { data: garments = [], mutate } = useSWR('/api/garments', fetcher);
  const { data: tags = [] } = useSWR('/api/tags', fetcher);

  const updateGarmentStatus = async (garmentId: string, newStatus: string) => {
    try {
      await fetch(`/api/garments/${garmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      mutate(); // Refresh data
    } catch (error) {
      console.error('Failed to update garment:', error);
    }
  };

  const filteredGarments = (garments || []).filter(garment => {
    // Category filtering (using existing activeCategory state)
    const matchesCategory = activeCategory === 'All' || garment.category === activeCategory;

    // Search filtering
    const matchesSearch = garment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         garment.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (garment.material && garment.material.toLowerCase().includes(searchQuery.toLowerCase()));

    // Status filtering
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(garment.status);

    // Tag filtering
    const matchesTags = selectedTags.length === 0 || 
                       (garment.tags && garment.tags.some((tag: any) => selectedTags.includes(tag.tag.name)));

    return matchesCategory && matchesSearch && matchesStatus && matchesTags;
  });

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Layout>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
          <Header 
            title="HangarOn" 
            showThemeToggle={isHydrated} 
            onThemeToggle={handleThemeToggle} 
            darkMode={darkMode}
          />
          
          <div className="pt-20">

            <div className="px-6 py-4">
              <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            <div className="px-6 py-4">
             <FilterPanel
               availableTags={tags.map((tag: any) => tag.name)}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
               availableStatuses={["Clean", "Worn", "Dirty", "Worn 2x", "Needs Washing"]}
               selectedStatuses={selectedStatuses}
               onStatusSelect={handleStatusSelect}
             />
            </div>
            <CategoryTabs onCategoryChange={setActiveCategory} />

            <div className="w-full px-4 md:px-8 xl:px-16">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredGarments.map((garment) => (
                  <GarmentCard
                    key={garment.id}
                    {...garment}
                    onEdit={() => {
                      window.location.href = `/add?edit=${garment.id}`;
                    }}
                    onMarkAsWorn={() => {
                      let nextStatus = garment.status;
                      if (garment.status === "CLEAN") nextStatus = "WORN_2X";
                      else if (garment.status === "WORN_2X") nextStatus = "NEEDS_WASHING";
                      updateGarmentStatus(garment.id, nextStatus);
                    }}
                    onMoveToLaundry={() => {
                      updateGarmentStatus(garment.id, 'DIRTY');
                    }}
                  />
                ))}
              </div>

              {filteredGarments.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-100/80 dark:bg-gray-700/80 rounded-full flex items-center justify-center shadow-[6px_6px_12px_rgba(0,0,0,0.1),-3px_-3px_9px_rgba(255,255,255,0.8)] dark:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-3px_-3px_9px_rgba(255,255,255,0.02)] backdrop-blur-sm">
                    <i className="ri-handbag-line text-2xl text-gray-400 dark:text-gray-500 drop-shadow-sm"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 drop-shadow-sm">
                    {(() => {
                      if (searchQuery) {
                        return `No items found for "${searchQuery}"`;
                      }
                      if (activeCategory !== 'All' && selectedStatuses.length > 0) {
                        return `No ${selectedStatuses.join(' or ')} items in ${activeCategory}`;
                      }
                      if (activeCategory !== 'All') {
                        return `No items in ${activeCategory}`;
                      }
                      if (selectedStatuses.length > 0) {
                        return `No ${selectedStatuses.join(' or ')} items found`;
                      }
                      return 'Your closet is empty';
                    })()}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 drop-shadow-sm">
                    {(() => {
                      if (searchQuery || activeCategory !== 'All' || selectedStatuses.length > 0) {
                        return 'Try adjusting your filters or search terms';
                      }
                      return 'Start adding items to your wardrobe';
                    })()}
                  </p>
                </div>
              )}
            </div>
          </div>
      </div>
    </Layout>
  );
}
