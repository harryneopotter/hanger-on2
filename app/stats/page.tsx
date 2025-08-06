
'use client';

import { useState } from 'react';
import Layout from '@/components/ui/Layout';
import Header from '@/components/ui/Header';

export default function Stats() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <Layout>
      <div className={darkMode ? 'dark' : ''}>
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
                {['overview', 'usage', 'spending'].map((tab) => (
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
                        <div className="text-3xl font-bold text-theme-primary-dark dark:text-theme-primary mb-1">156</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Items</div>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">$2,847</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Value</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Breakdown</h3>
                    <div className="aspect-square bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-4">
                      <img
                        src="https://readdy.ai/api/search-image?query=Pie%20chart%20showing%20clothing%20category%20distribution%20with%20segments%20for%20shirts%2C%20pants%2C%20shoes%2C%20accessories%2C%20and%20outerwear%20in%20modern%20colors%2C%20clean%20minimal%20design%2C%20professional%20data%20visualization&width=300&height=300&seq=piechart1&orientation=squarish"
                        alt="Category pie chart"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-theme-primary rounded-full"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Shirts</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">42</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Pants</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">38</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Shoes</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">28</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Outerwear</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">24</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">Accessories</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">24</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'usage' && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Usage</h3>
                    <div className="aspect-[4/3] bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                      <img
                        src="https://readdy.ai/api/search-image?query=Bar%20chart%20showing%20weekly%20clothing%20usage%20statistics%20with%20days%20of%20week%20on%20x-axis%20and%20number%20of%20items%20worn%20on%20y-axis%2C%20modern%20clean%20design%2C%20professional%20data%20visualization&width=400&height=300&seq=barchart1&orientation=landscape"
                        alt="Weekly usage bar chart"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Most Worn Items</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-theme-primary-light dark:bg-theme-primary-dark rounded-xl flex items-center justify-center">
              <i className="ri-shirt-line text-theme-primary-dark dark:text-theme-primary"></i>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">White Oxford Shirt</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Worn 12 times this month</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-xl flex items-center justify-center">
                          <i className="ri-t-shirt-line text-emerald-600 dark:text-emerald-400"></i>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">Black Jeans</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Worn 9 times this month</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-xl flex items-center justify-center">
                          <i className="ri-footprint-line text-amber-600 dark:text-amber-400"></i>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">White Sneakers</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Worn 8 times this month</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'spending' && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Spending</h3>
                    <div className="aspect-[4/3] bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                      <img
                        src="https://readdy.ai/api/search-image?query=Line%20chart%20showing%20monthly%20clothing%20spending%20over%20time%20with%20smooth%20curves%20and%20gradient%20fill%2C%20modern%20clean%20design%2C%20professional%20financial%20data%20visualization&width=400&height=300&seq=linechart1&orientation=landscape"
                        alt="Monthly spending line chart"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending by Brand</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Ralph Lauren</span>
                        <span className="font-medium text-gray-900 dark:text-white">$487</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Levi's</span>
                        <span className="font-medium text-gray-900 dark:text-white">$324</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Nike</span>
                        <span className="font-medium text-gray-900 dark:text-white">$298</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Zara</span>
                        <span className="font-medium text-gray-900 dark:text-white">$245</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">Others</span>
                        <span className="font-medium text-gray-900 dark:text-white">$1,493</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
