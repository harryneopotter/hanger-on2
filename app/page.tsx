
'use client';

import { useState } from 'react';
import Layout from '@/components/ui/Layout';
import Header from '@/components/ui/Header';
import CategoryTabs from '@/components/ui/CategoryTabs';
import SearchBar from '@/components/ui/SearchBar';
import FilterPanel from '@/components/features/FilterPanel';
import GarmentCard from '@/components/features/GarmentCard';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
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
    // Category filtering (using existing activeCategory state)
    const matchesCategory = activeCategory === 'All' || garment.category === activeCategory;

    // Search filtering
    const matchesSearch = garment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         garment.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         garment.material.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filtering
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(garment.status);

    // TODO: Implement tag filtering logic here
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
              <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            <div className="px-6 py-4">
             <FilterPanel
               availableTags={[]} // Use an empty array for now
               selectedTags={selectedTags}
               onTagSelect={(tagName) => { /* TODO: Implement tag selection */ }}
               availableStatuses={['Clean', 'Dirty', 'Worn 2x', 'Needs Washing']}
               selectedStatuses={selectedStatuses}
               onStatusSelect={(status) => { /* TODO: Implement status selection */ }}
             />
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
