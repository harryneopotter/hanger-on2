
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { useDarkMode } from '@/hooks/useDarkMode';
import Layout from '@/components/ui/Layout';
import Header from '@/components/ui/Header';
import CategoryTabs from '@/components/ui/CategoryTabs';
import CompactFilterBar from '@/components/features/CompactFilterBar';
import GarmentCard from '@/components/features/GarmentCard';
import { HangerFAB } from '@/components/ui/FloatingActionButton';
import EmptyState from '@/components/features/EmptyState';
import { demoGarments, demoTags, isGuestMode, setGuestMode, clearGuestMode } from '@/lib/demo-data';


const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [darkMode, setDarkMode, isHydrated] = useDarkMode();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initialize guest mode based on URL params first, then localStorage
  const [isGuest, setIsGuest] = useState(false);
  const [hasCheckedGuest, setHasCheckedGuest] = useState(false);
  
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // SWR hooks must be called before any conditional logic
  // Only make API calls if not in guest mode and session exists
  const shouldMakeApiCalls = !isGuest && session;
  const { data: garments = [], mutate } = useSWR(shouldMakeApiCalls ? '/api/garments' : null, fetcher);
  const { data: tags = [] } = useSWR(shouldMakeApiCalls ? '/api/tags' : null, fetcher);

  // Initialize guest mode on client side
  useEffect(() => {
    if (!hasCheckedGuest) {
      const urlParams = new URLSearchParams(window.location.search);
      const guestParam = urlParams.get('guest');
      const isGuestFromUrl = guestParam === 'true';
      const isGuestFromStorage = isGuestMode();
      
      if (isGuestFromUrl || isGuestFromStorage) {
        setGuestMode(true);
        setIsGuest(true);
      }
      setHasCheckedGuest(true);
    }
  }, [hasCheckedGuest]);

  useEffect(() => {
    if (!hasCheckedGuest || status === 'loading') return;
    
    // If user is authenticated, clear guest mode
    if (session) {
      clearGuestMode();
      setIsGuest(false);
      return;
    }
    
    // Auto-enable guest mode in production for demo purposes
    if (!session && !isGuest) {
      // Check if we're in production (Vercel deployment)
      const isProduction = process.env.NODE_ENV === 'production' || window.location.hostname.includes('vercel.app');
      
      if (isProduction) {
        // Automatically enable guest mode for demo
        setGuestMode(true);
        setIsGuest(true);
      } else {
        // In development, redirect to login
        router.push('/login');
      }
      return;
    }
  }, [session, status, router, isGuest, hasCheckedGuest]);

  // Show loading while checking authentication and guest mode
  if (!hasCheckedGuest || (status === 'loading' && !isGuest)) {
    return (
      <Layout>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300 flex items-center justify-center">
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </Layout>
    );
  }

  // Don't render if not authenticated and not in guest mode (will redirect)
  if (!session && !isGuest && hasCheckedGuest) {
    return null;
  }

  // Helpers to toggle selection
  const handleStatusSelect = (statusValue: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(statusValue) ? prev.filter((s) => s !== statusValue) : [...prev, statusValue]
    );
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };
  
  // Use demo data for guest mode
  const displayGarments = isGuest ? demoGarments : garments;
  const displayTags = isGuest ? demoTags : tags;

  const updateGarmentStatus = async (garmentId: string, newStatus: string) => {
    if (isGuest) {
      // Show toast notification for guest users
      alert('Please sign in to edit garments');
      return;
    }
    
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

  const filteredGarments = (displayGarments || []).filter(garment => {
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
            title="Hanger On" 
            showThemeToggle={isHydrated} 
            onThemeToggle={handleThemeToggle} 
            darkMode={darkMode}
            isGuest={isGuest}
          />
          
          <div className="pt-20">

            <CompactFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              availableTags={displayTags.map((tag: any) => tag.name)}
              selectedTags={selectedTags}
              onTagSelect={handleTagSelect}
              availableStatuses={["Clean", "Worn", "Dirty", "Worn 2x", "Needs Washing"]}
              selectedStatuses={selectedStatuses}
              onStatusSelect={handleStatusSelect}
            />
            <CategoryTabs onCategoryChange={setActiveCategory} />

            <div className="w-full px-4 md:px-8 xl:px-16">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredGarments.map((garment) => (
                  <GarmentCard
                    key={garment.id}
                    {...garment}
                    isGuest={isGuest}
                    onEdit={() => {
                      if (isGuest) {
                        alert('Please sign in to edit garments');
                        return;
                      }
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
                <div className="col-span-full flex justify-center items-center min-h-[60vh]">
                  <EmptyState
                    title={(() => {
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
                      return isGuest ? 'Welcome to your demo wardrobe!' : 'Your closet is empty';
                    })()}
                    message={(() => {
                      if (searchQuery || activeCategory !== 'All' || selectedStatuses.length > 0) {
                        return 'Try adjusting your filters or search terms';
                      }
                      return isGuest 
                        ? 'Explore these demo items to see how Hanger On works!' 
                        : 'Start adding items to your wardrobe and watch your collection grow!';
                    })()}
                    actionText={(() => {
                      if (searchQuery || activeCategory !== 'All' || selectedStatuses.length > 0) {
                        return 'Clear filters';
                      }
                      return isGuest ? 'Sign up to get started' : 'Add your first item';
                    })()}
                    actionHref={(() => {
                      if (searchQuery || activeCategory !== 'All' || selectedStatuses.length > 0) {
                        return '/';
                      }
                      return isGuest ? '/login' : '/add';
                    })()}
                    type={searchQuery || activeCategory !== 'All' || selectedStatuses.length > 0 ? 'search' : 'garments'}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Floating Action Button */}
          <HangerFAB isGuest={isGuest} />
        </div>
    </Layout>
  );
}
