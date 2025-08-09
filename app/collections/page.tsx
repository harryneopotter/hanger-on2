'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useDarkMode } from '@/hooks/useDarkMode';
import Layout from '@/components/ui/Layout';
import TagFilter from '@/components/features/TagFilter';
import TagList from '@/components/features/TagList';
import Header from '@/components/ui/Header';
import CollectionForm from '@/src/components/features/CollectionForm';
import { CreateCollection } from '@/lib/validation/schemas';
import type { Collection, Garment } from '@/types';
import { demoCollections, isGuestMode, setGuestMode } from '@/lib/demo-data';

interface ExtendedCollection extends Collection {
  _count?: {
    garments: number;
  };
  garments?: Garment[];
}

export default function Collections() {
  const [darkMode, setDarkMode] = useDarkMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [collections, setCollections] = useState<ExtendedCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    // Check if user came from guest mode link
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('guest');

    if (guestParam === 'true' || isGuestMode()) {
      setGuestMode(true);
      setIsGuest(true);
      setLoading(false);
      return;
    }

    if (!session) {
      router.push('/login');
      return;
    }
    fetchCollections();
  }, [session, status, router]);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/collections');
      if (!response.ok) {
        throw new Error('Failed to fetch collections');
      }
      const data = await response.json();
      setCollections(data);
    } catch (fetchError) {
      console.error('Error fetching collections:', fetchError);
      setError('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  // Use demo data for guest mode
  const displayCollections = isGuest ? demoCollections : collections.length > 0 ? collections : [];
  const filteredCollections = displayCollections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateCollection = async (data: CreateCollection) => {
    if (isGuest) {
      alert('Please sign in to create collections');
      return;
    }

    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create collection');
      }

      const newCollection = await response.json();
      setCollections((prev) => [newCollection, ...prev]);
      setShowCreateForm(false);
    } catch (createError) {
      console.error('Error creating collection:', createError);
      throw createError;
    }
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleCollectionClick = (collectionId: string) => {
    if (isGuest) {
      alert('Please sign in to view collection details');
      return;
    }
    router.push(`/collections/${collectionId}`);
  };

  // Show loading while checking authentication
  if (status === 'loading' && !isGuest) {
    return (
      <Layout>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300 flex items-center justify-center">
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </Layout>
    );
  }

  // Don't render if not authenticated and not in guest mode (will redirect)
  if (!session && !isGuest) {
    return null;
  }

  return (
    <Layout>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <Header
          title="Collections"
          showThemeToggle
          onThemeToggle={handleThemeToggle}
          darkMode={darkMode}
          isGuest={isGuest}
        />

        <div className="pt-20 pb-20">
          <div className="px-6 py-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <i className="ri-search-line text-gray-400 dark:text-gray-500 drop-shadow-sm"></i>
              </div>
              <input
                type="text"
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50/80 dark:bg-gray-800/80 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/50 focus:border-transparent transition-all duration-300 text-sm shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-2px_-2px_6px_rgba(255,255,255,0.7)] dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/20 dark:border-gray-700/30 focus:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.1),inset_-3px_-3px_9px_rgba(255,255,255,0.8)] dark:focus:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.4),inset_-3px_-3px_9px_rgba(255,255,255,0.03)]"
              />
            </div>
          </div>

          <div className="px-6 py-4">
            <TagFilter availableTags={[{ name: 'Casual' }, { name: 'Formal' }]} selectedTags={[]} />
            <TagList tags={[{ name: 'Work' }, { name: 'Weekend' }]} />
          </div>

          {loading && (
            <div className="px-6 py-12 text-center">
              <div className="w-12 h-12 mx-auto mb-4 border-4 border-theme-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading collections...</p>
            </div>
          )}

          {error && (
            <div className="px-6 py-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <i className="ri-error-warning-line text-2xl text-red-500"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{error}</h3>
              <button
                onClick={fetchCollections}
                className="px-4 py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="px-6">
              <div className="grid gap-6">
                {filteredCollections.map((collection) => (
                  <div
                    key={collection.id}
                    onClick={() => handleCollectionClick(collection.id)}
                    className="bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.02)] hover:shadow-[12px_12px_24px_rgba(0,0,0,0.15),-6px_-6px_18px_rgba(255,255,255,0.8)] dark:hover:shadow-[12px_12px_24px_rgba(0,0,0,0.4),-6px_-6px_18px_rgba(255,255,255,0.03)] transition-all duration-300 overflow-hidden backdrop-blur-sm border border-white/20 dark:border-gray-700/30 cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-2px_-2px_6px_rgba(255,255,255,0.6)] dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.01)]">
                      <img
                        src={collection.image}
                        alt={collection.name}
                        className="w-full h-full object-cover object-center"
                      />
                      {collection.color && (
                        <div
                          className="absolute inset-0 bg-gradient-to-t opacity-20"
                          style={{ backgroundColor: collection.color }}
                        ></div>
                      )}
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 dark:bg-gray-800/90 px-3 py-1.5 rounded-full shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.03)] backdrop-blur-sm">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 drop-shadow-sm">
                            {collection._count.garments} items
                          </span>
                        </div>
                      </div>
                      {collection.isSmartCollection && (
                        <div className="absolute top-4 left-4">
                          <div className="bg-purple-500/90 px-2 py-1 rounded-full">
                            <span className="text-xs font-medium text-white">Smart</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white drop-shadow-sm">
                          {collection.name}
                        </h3>
                        <button className="w-8 h-8 bg-gray-100/80 dark:bg-gray-700/80 rounded-full flex items-center justify-center shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.03)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-3px_-3px_9px_rgba(255,255,255,0.9)] dark:hover:shadow-[6px_6px_12px_rgba(0,0,0,0.4),-3px_-3px_9px_rgba(255,255,255,0.05)] transition-all duration-200 backdrop-blur-sm">
                          <i className="ri-arrow-right-line text-gray-600 dark:text-gray-300"></i>
                        </button>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed drop-shadow-sm">
                        {collection.description || 'No description available'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCollections.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-100/80 dark:bg-gray-700/80 rounded-full flex items-center justify-center shadow-[6px_6px_12px_rgba(0,0,0,0.1),-3px_-3px_9px_rgba(255,255,255,0.8)] dark:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-3px_-3px_9px_rgba(255,255,255,0.02)] backdrop-blur-sm">
                    <i className="ri-folder-line text-2xl text-gray-400 dark:text-gray-500 drop-shadow-sm"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 drop-shadow-sm">
                    No collections found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 drop-shadow-sm">
                    Try adjusting your search
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <CollectionForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateCollection}
        title="Create New Collection"
      />
    </Layout>
  );
}
