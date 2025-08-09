'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useDarkMode } from '@/hooks/useDarkMode';
import Layout from '@/components/ui/Layout';
import Header from '@/components/ui/Header';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface UserStats {
  totalItems: number;
  totalValue: number;
  categoryBreakdown: Array<{
    category: string;
    count: number;
  }>;
  mostWornItems: Array<{
    id: string;
    name: string;
    category: string;
    usageCount: number;
  }>;
}

export default function Stats() {
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useDarkMode();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/stats');

        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }

        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [session?.user?.id]);

  if (loading) {
    return (
      <Layout>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
          <Header
            title="Wardrobe Stats"
            showThemeToggle
            onThemeToggle={handleThemeToggle}
            darkMode={darkMode}
          />
          <div className="pt-20 pb-24 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
          <Header
            title="Wardrobe Stats"
            showThemeToggle
            onThemeToggle={handleThemeToggle}
            darkMode={darkMode}
          />
          <div className="pt-20 pb-24 px-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!session?.user?.id) {
    return (
      <Layout>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
          <Header
            title="Wardrobe Stats"
            showThemeToggle
            onThemeToggle={handleThemeToggle}
            darkMode={darkMode}
          />
          <div className="pt-20 pb-24 px-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-600 dark:text-yellow-400">
                Please log in to view your wardrobe statistics.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <Header
          title="Wardrobe Stats"
          showThemeToggle
          onThemeToggle={handleThemeToggle}
          darkMode={darkMode}
        />

        <div className="pt-20 pb-24">
          <div className="px-6 py-4">
            <div className="flex gap-2 mb-6">
              {['overview', 'usage'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 capitalize ${
                    activeTab === tab
                      ? 'bg-theme-primary-dark text-white shadow-md'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                  } !rounded-button`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-theme-primary-dark dark:text-theme-primary mb-1">
                        {stats?.totalItems || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Items</div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                        ${stats?.totalValue?.toLocaleString() || '0'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Value</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Category Breakdown
                  </h3>
                  <div className="aspect-square bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4">
                    <img
                      src="https://readdy.ai/api/search-image?query=Pie%20chart%20showing%20clothing%20category%20distribution%20with%20segments%20for%20shirts%2C%20pants%2C%20shoes%2C%20accessories%2C%20and%20outerwear%20in%20modern%20colors%2C%20clean%20minimal%20design%2C%20professional%20data%20visualization&width=300&height=300&seq=piechart1&orientation=squarish"
                      alt="Category pie chart"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="space-y-3">
                    {stats?.categoryBreakdown && stats.categoryBreakdown.length > 0 ? (
                      stats.categoryBreakdown.map((category, index) => {
                        const colors = [
                          'bg-theme-primary',
                          'bg-emerald-500',
                          'bg-amber-500',
                          'bg-red-500',
                          'bg-purple-500',
                          'bg-blue-500',
                          'bg-pink-500',
                          'bg-indigo-500',
                        ];
                        const colorClass = colors[index % colors.length];

                        return (
                          <div
                            key={category.category}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 ${colorClass} rounded-full`}></div>
                              <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                                {category.category}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {category.count}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          No items in your wardrobe yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Weekly Usage
                  </h3>
                  <div className="aspect-[4/3] bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                    <img
                      src="https://readdy.ai/api/search-image?query=Bar%20chart%20showing%20weekly%20clothing%20usage%20statistics%20with%20days%20of%20week%20on%20x-axis%20and%20number%20of%20items%20worn%20on%20y-axis%2C%20modern%20clean%20design%2C%20professional%20data%20visualization&width=400&height=300&seq=barchart1&orientation=landscape"
                      alt="Weekly usage bar chart"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Most Worn Items
                  </h3>
                  <div className="space-y-4">
                    {stats?.mostWornItems && stats.mostWornItems.length > 0 ? (
                      stats.mostWornItems.map((item, index) => {
                        const colors = [
                          {
                            bg: 'bg-theme-primary-light dark:bg-theme-primary-dark',
                            icon: 'text-theme-primary-dark dark:text-theme-primary',
                          },
                          {
                            bg: 'bg-emerald-100 dark:bg-emerald-900',
                            icon: 'text-emerald-600 dark:text-emerald-400',
                          },
                          {
                            bg: 'bg-amber-100 dark:bg-amber-900',
                            icon: 'text-amber-600 dark:text-amber-400',
                          },
                          {
                            bg: 'bg-red-100 dark:bg-red-900',
                            icon: 'text-red-600 dark:text-red-400',
                          },
                          {
                            bg: 'bg-purple-100 dark:bg-purple-900',
                            icon: 'text-purple-600 dark:text-purple-400',
                          },
                        ];
                        const colorClass = colors[index % colors.length];

                        return (
                          <div key={item.id} className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 ${colorClass.bg} rounded-xl flex items-center justify-center`}
                            >
                              <i className={`ri-shirt-line ${colorClass.icon}`}></i>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Worn {item.usageCount} times this month
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          No usage data available yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
