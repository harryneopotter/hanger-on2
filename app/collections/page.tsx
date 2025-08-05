'use client';

import { useState } from 'react';
import Layout from '@/components/ui/Layout';
import TagFilter from '@/components/features/TagFilter';
import TagList from '@/components/features/TagList';
import Header from '@/components/ui/Header';

interface Collection {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  image: string;
  color: string;
}

export default function Collections() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const collections: Collection[] = [
    {
      id: '1',
      name: 'Winter Essentials',
      description: 'Cozy layers and warm pieces for cold weather',
      itemCount: 24,
      image: 'https://readdy.ai/api/search-image?query=Elegant%20winter%20fashion%20collection%20for%20women%2C%20cozy%20wool%20coats%2C%20cashmere%20scarves%2C%20warm%20knitwear%2C%20sophisticated%20layering%20pieces%2C%20neutral%20winter%20tones%2C%20luxury%20fabric%20textures%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20premium%20fashion%20styling%2C%20cold%20weather%20elegance&width=400&height=300&seq=winter1&orientation=landscape',
      color: 'from-blue-400 to-indigo-600'
    },
    {
      id: '2',
      name: 'Summer Breeze',
      description: 'Light, airy pieces for warm sunny days',
      itemCount: 18,
      image: 'https://readdy.ai/api/search-image?query=Fresh%20summer%20fashion%20collection%20for%20women%2C%20flowing%20lightweight%20fabrics%2C%20bright%20airy%20dresses%2C%20linen%20pieces%2C%20pastel%20colors%2C%20beach-ready%20styles%2C%20feminine%20summer%20elegance%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20breezy%20fashion%20styling%2C%20warm%20weather%20essentials&width=400&height=300&seq=summer1&orientation=landscape',
      color: 'from-amber-400 to-orange-500'
    },
    {
      id: '3',
      name: 'Casual Comfort',
      description: 'Relaxed everyday pieces for comfort and style',
      itemCount: 32,
      image: 'https://readdy.ai/api/search-image?query=Comfortable%20casual%20fashion%20collection%20for%20women%2C%20soft%20loungewear%2C%20cozy%20sweaters%2C%20relaxed%20jeans%2C%20everyday%20essentials%2C%20neutral%20comfortable%20tones%2C%20premium%20casual%20fabrics%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20lifestyle%20fashion%20styling%2C%20effortless%20elegance&width=400&height=300&seq=casual1&orientation=landscape',
      color: 'from-green-400 to-teal-500'
    },
    {
      id: '4',
      name: 'Formal Affairs',
      description: 'Professional and sophisticated pieces',
      itemCount: 15,
      image: 'https://readdy.ai/api/search-image?query=Professional%20formal%20fashion%20collection%20for%20women%2C%20elegant%20blazers%2C%20sophisticated%20dresses%2C%20business%20attire%2C%20office%20wear%2C%20classic%20tailoring%2C%20premium%20formal%20fabrics%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20corporate%20fashion%20styling%2C%20executive%20elegance&width=400&height=300&seq=formal1&orientation=landscape',
      color: 'from-gray-500 to-slate-600'
    },
    {
      id: '5',
      name: 'Wedding Ready',
      description: 'Special occasion and celebration outfits',
      itemCount: 8,
      image: 'https://readdy.ai/api/search-image?query=Elegant%20wedding%20guest%20fashion%20collection%20for%20women%2C%20sophisticated%20special%20occasion%20dresses%2C%20formal%20evening%20wear%2C%20celebration%20outfits%2C%20luxurious%20fabrics%2C%20romantic%20feminine%20styling%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20special%20event%20fashion%2C%20glamorous%20elegance&width=400&height=300&seq=wedding1&orientation=landscape',
      color: 'from-pink-400 to-rose-500'
    },
    {
      id: '6',
      name: 'Date Night',
      description: 'Romantic and charming pieces for special evenings',
      itemCount: 12,
      image: 'https://readdy.ai/api/search-image?query=Romantic%20date%20night%20fashion%20collection%20for%20women%2C%20elegant%20evening%20dresses%2C%20sophisticated%20feminine%20pieces%2C%20charming%20dinner%20outfits%2C%20luxurious%20romantic%20styling%2C%20soft%20evening%20colors%2C%20premium%20evening%20fabrics%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20romantic%20fashion%20styling&width=400&height=300&seq=date1&orientation=landscape',
      color: 'from-purple-400 to-violet-500'
    }
  ];

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <Layout>
      <div className={darkMode ? 'dark' : ''}>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
          <Header 
            title="Collections" 
            showThemeToggle 
            onThemeToggle={handleThemeToggle} 
            darkMode={darkMode}
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
                  className="w-full pl-12 pr-4 py-3 bg-gray-50/80 dark:bg-gray-800/80 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 text-sm shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-2px_-2px_6px_rgba(255,255,255,0.7)] dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/20 dark:border-gray-700/30 focus:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.1),inset_-3px_-3px_9px_rgba(255,255,255,0.8)] dark:focus:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.4),inset_-3px_-3px_9px_rgba(255,255,255,0.03)]"
                />
              </div>
            </div>

            <div className="px-6 py-4">
              <TagFilter availableTags={[{ name: 'Casual' }, { name: 'Formal' }]} selectedTags={[]} />
              <TagList tags={[{ name: 'Work' }, { name: 'Weekend' }]} />
            </div>

            <div className="px-6">
              <div className="grid gap-6">
                {filteredCollections.map((collection) => (
                  <div
                    key={collection.id}
                    className="bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.02)] hover:shadow-[12px_12px_24px_rgba(0,0,0,0.15),-6px_-6px_18px_rgba(255,255,255,0.8)] dark:hover:shadow-[12px_12px_24px_rgba(0,0,0,0.4),-6px_-6px_18px_rgba(255,255,255,0.03)] transition-all duration-300 overflow-hidden backdrop-blur-sm border border-white/20 dark:border-gray-700/30 cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-2px_-2px_6px_rgba(255,255,255,0.6)] dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.01)]">
                      <img
                        src={collection.image}
                        alt={collection.name}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${collection.color} opacity-20`}></div>
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 dark:bg-gray-800/90 px-3 py-1.5 rounded-full shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.03)] backdrop-blur-sm">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 drop-shadow-sm">
                            {collection.itemCount} items
                          </span>
                        </div>
                      </div>
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
                        {collection.description}
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
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 drop-shadow-sm">No collections found</h3>
                  <p className="text-gray-500 dark:text-gray-400 drop-shadow-sm">Try adjusting your search</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}