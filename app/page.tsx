
'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import CategoryTabs from '@/components/CategoryTabs';
import GarmentCard from '@/components/GarmentCard';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const garments = [
    {
      id: '1',
      name: 'Silk Blouse',
      category: 'Shirts',
      material: 'Silk',
      status: 'Clean' as const,
      image: 'https://readdy.ai/api/search-image?query=Elegant%20silk%20blouse%20for%20women%2C%20flowing%20fabric%2C%20professional%20feminine%20style%2C%20soft%20pastel%20colors%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20high-quality%20fashion%20photography%2C%20delicate%20texture%20details&width=400&height=400&seq=blouse1&orientation=squarish'
    },
    {
      id: '2',
      name: 'High-Waist Jeans',
      category: 'Pants',
      material: 'Denim',
      status: 'Worn 2x' as const,
      image: 'https://readdy.ai/api/search-image?query=High-waisted%20denim%20jeans%20for%20women%2C%20modern%20fit%2C%20dark%20blue%20wash%2C%20feminine%20silhouette%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20fashion%20styling%2C%20premium%20denim%20texture&width=400&height=400&seq=jeans2&orientation=squarish'
    },
    {
      id: '3',
      name: 'Ballet Flats',
      category: 'Shoes',
      material: 'Leather',
      status: 'Clean' as const,
      image: 'https://readdy.ai/api/search-image?query=Classic%20ballet%20flats%20for%20women%2C%20soft%20leather%2C%20elegant%20feminine%20design%2C%20neutral%20beige%20color%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20luxury%20footwear%20styling%2C%20sophisticated%20details&width=400&height=400&seq=flats1&orientation=squarish'
    },
    {
      id: '4',
      name: 'Cashmere Cardigan',
      category: 'Outerwear',
      material: 'Cashmere',
      status: 'Dirty' as const,
      image: 'https://readdy.ai/api/search-image?query=Luxurious%20cashmere%20cardigan%20for%20women%2C%20soft%20knit%20texture%2C%20elegant%20draping%2C%20warm%20neutral%20tones%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20premium%20knitwear%20styling%2C%20cozy%20feminine%20fashion&width=400&height=400&seq=cardigan1&orientation=squarish'
    },
    {
      id: '5',
      name: 'Midi Dress',
      category: 'Dresses',
      material: 'Cotton',
      status: 'Clean' as const,
      image: 'https://readdy.ai/api/search-image?query=Elegant%20midi%20dress%20for%20women%2C%20flowing%20cotton%20fabric%2C%20feminine%20silhouette%2C%20sophisticated%20design%2C%20soft%20colors%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20modern%20fashion%20styling%2C%20versatile%20wardrobe%20piece&width=400&height=400&seq=dress1&orientation=squarish'
    },
    {
      id: '6',
      name: 'Ankle Boots',
      category: 'Shoes',
      material: 'Leather',
      status: 'Clean' as const,
      image: 'https://readdy.ai/api/search-image?query=Stylish%20ankle%20boots%20for%20women%2C%20premium%20leather%20construction%2C%20modern%20heel%20design%2C%20versatile%20black%20color%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20luxury%20footwear%20styling%2C%20contemporary%20fashion&width=400&height=400&seq=boots2&orientation=squarish'
    }
  ];

  const filteredGarments = garments.filter(garment => {
    const matchesCategory = activeCategory === 'All' || garment.category === activeCategory;
    const matchesSearch = garment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         garment.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         garment.material.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <Layout>
      <div className={darkMode ? 'dark' : ''}>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
          <Header 
            title="HangarOn" 
            showThemeToggle 
            onThemeToggle={handleThemeToggle} 
            darkMode={darkMode}
          />
          
          <div className="pt-20">
            <div className="px-6 py-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <i className="ri-search-line text-gray-400 dark:text-gray-500 drop-shadow-sm"></i>
                </div>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <i className="ri-handbag-line text-gray-300 dark:text-gray-600 drop-shadow-sm"></i>
                </div>
                <input
                  type="text"
                  placeholder="Search your wardrobe..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50/80 dark:bg-gray-800/80 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 text-sm shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-2px_-2px_6px_rgba(255,255,255,0.7)] dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/20 dark:border-gray-700/30 focus:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.1),inset_-3px_-3px_9px_rgba(255,255,255,0.8)] dark:focus:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.4),inset_-3px_-3px_9px_rgba(255,255,255,0.03)]"
                />
              </div>
            </div>

            <CategoryTabs onCategoryChange={setActiveCategory} />

            <div className="px-6">
              <div className="grid grid-cols-2 gap-4">
                {filteredGarments.map((garment) => (
                  <GarmentCard
                    key={garment.id}
                    {...garment}
                    onEdit={() => console.log('Edit garment:', garment.id)}
                  />
                ))}
              </div>

              {filteredGarments.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-100/80 dark:bg-gray-700/80 rounded-full flex items-center justify-center shadow-[6px_6px_12px_rgba(0,0,0,0.1),-3px_-3px_9px_rgba(255,255,255,0.8)] dark:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-3px_-3px_9px_rgba(255,255,255,0.02)] backdrop-blur-sm">
                    <i className="ri-handbag-line text-2xl text-gray-400 dark:text-gray-500 drop-shadow-sm"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 drop-shadow-sm">Your closet is empty</h3>
                  <p className="text-gray-500 dark:text-gray-400 drop-shadow-sm">Start adding items to your wardrobe</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
