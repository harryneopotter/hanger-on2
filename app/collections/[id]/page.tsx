'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/ui/Layout';
import Header from '@/components/ui/Header';
import GarmentCard from '@/components/features/GarmentCard';

interface CollectionItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  color: string;
  size: string;
  image: string;
  lastWorn: string;
  tags: string[];
}

interface Collection {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  image: string;
  color: string;
  items: CollectionItem[];
}

export default function CollectionDetail() {
  const [darkMode, setDarkMode] = useState(false);
  const params = useParams();
  const router = useRouter();
  const collectionId = params.id as string;

  // Mock collection data - in a real app, this would come from an API
  const collections: Collection[] = [
    {
      id: '1',
      name: 'Winter Essentials',
      description: 'Cozy layers and warm pieces for cold weather',
      itemCount: 24,
      image: 'https://readdy.ai/api/search-image?query=Elegant%20winter%20fashion%20collection%20for%20women%2C%20cozy%20wool%20coats%2C%20cashmere%20scarves%2C%20warm%20knitwear%2C%20sophisticated%20layering%20pieces%2C%20neutral%20winter%20tones%2C%20luxury%20fabric%20textures%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20premium%20fashion%20styling%2C%20cold%20weather%20elegance&width=400&height=300&seq=winter1&orientation=landscape',
      color: 'from-blue-400 to-indigo-600',
      items: [
        {
          id: '1',
          name: 'Wool Coat',
          brand: 'Zara',
          category: 'Outerwear',
          color: 'Navy',
          size: 'M',
          image: 'https://readdy.ai/api/search-image?query=Navy%20wool%20coat%20women%20elegant%20winter%20fashion&width=300&height=400&seq=coat1',
          lastWorn: '2024-01-10',
          tags: ['formal', 'winter']
        },
        {
          id: '2',
          name: 'Cashmere Scarf',
          brand: 'H&M',
          category: 'Accessories',
          color: 'Beige',
          size: 'One Size',
          image: 'https://readdy.ai/api/search-image?query=Beige%20cashmere%20scarf%20luxury%20winter%20accessory&width=300&height=400&seq=scarf1',
          lastWorn: '2024-01-08',
          tags: ['casual', 'winter']
        }
      ]
    },
    {
      id: '2',
      name: 'Summer Breeze',
      description: 'Light, airy pieces for warm sunny days',
      itemCount: 18,
      image: 'https://readdy.ai/api/search-image?query=Fresh%20summer%20fashion%20collection%20for%20women%2C%20flowing%20lightweight%20fabrics%2C%20bright%20airy%20dresses%2C%20linen%20pieces%2C%20pastel%20colors%2C%20beach-ready%20styles%2C%20feminine%20summer%20elegance%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20breezy%20fashion%20styling%2C%20warm%20weather%20essentials&width=400&height=300&seq=summer1&orientation=landscape',
      color: 'from-amber-400 to-orange-500',
      items: [
        {
          id: '3',
          name: 'Linen Dress',
          brand: 'Mango',
          category: 'Dresses',
          color: 'White',
          size: 'S',
          image: 'https://readdy.ai/api/search-image?query=White%20linen%20dress%20summer%20casual%20fashion&width=300&height=400&seq=dress1',
          lastWorn: '2024-01-05',
          tags: ['casual', 'summer']
        }
      ]
    },
    {
      id: '3',
      name: 'Work Wardrobe',
      description: 'Professional pieces for the office',
      itemCount: 32,
      image: 'https://readdy.ai/api/search-image?query=Professional%20work%20wardrobe%20collection%20for%20women%2C%20tailored%20blazers%2C%20elegant%20blouses%2C%20sophisticated%20trousers%2C%20office-appropriate%20dresses%2C%20neutral%20professional%20colors%2C%20business%20formal%20styling%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20corporate%20fashion%20elegance&width=400&height=300&seq=work1&orientation=landscape',
      color: 'from-gray-400 to-slate-600',
      items: [
        {
          id: '4',
          name: 'Blazer',
          brand: 'Zara',
          category: 'Outerwear',
          color: 'Black',
          size: 'M',
          image: 'https://readdy.ai/api/search-image?query=Black%20blazer%20women%20professional%20work%20fashion&width=300&height=400&seq=blazer1',
          lastWorn: '2024-01-12',
          tags: ['formal', 'work']
        }
      ]
    }
  ];

  const collection = collections.find(c => c.id === collectionId);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleItemEdit = (itemId: string) => {
    router.push(`/add?edit=${itemId}`);
  };

  const handleItemMarkAsWorn = (itemId: string) => {
    console.log('Mark as worn:', itemId);
    alert('Item marked as worn!');
  };

  const handleItemMoveToLaundry = (itemId: string) => {
    console.log('Move to laundry:', itemId);
    alert('Item moved to laundry!');
  };

  if (!collection) {
    return (
      <Layout>
        <div className={darkMode ? 'dark' : ''}>
          <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <Header 
              title="Collection Not Found" 
              showThemeToggle 
              onThemeToggle={handleThemeToggle} 
              darkMode={darkMode}
            />
            <div className="pt-20 pb-20 px-6">
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Collection not found</h2>
                <p className="text-gray-500 dark:text-gray-400">The collection you're looking for doesn't exist.</p>
                <button 
                  onClick={() => router.push('/collections')}
                  className="mt-4 px-6 py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-primary-dark transition-colors"
                >
                  Back to Collections
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={darkMode ? 'dark' : ''}>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
          <Header 
            title={collection.name} 
            showThemeToggle 
            onThemeToggle={handleThemeToggle} 
            darkMode={darkMode}
          />
          
          <div className="pt-20 pb-20">
            {/* Collection Header */}
            <div className="px-6 py-6">
              <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.02)] overflow-hidden backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${collection.color} opacity-20`}></div>
                  <div className="absolute bottom-4 left-4">
                    <h1 className="text-2xl font-bold text-white drop-shadow-lg">{collection.name}</h1>
                    <p className="text-white/90 drop-shadow-sm">{collection.itemCount} items</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{collection.description}</p>
                </div>
              </div>
            </div>

            {/* Collection Items */}
            <div className="px-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 drop-shadow-sm">Items in this collection</h2>
              <div className="grid gap-4">
                {collection.items.map((item) => (
                  <GarmentCard
                    key={item.id}
                    garment={item}
                    onEdit={handleItemEdit}
                    onMarkAsWorn={handleItemMarkAsWorn}
                    onMoveToLaundry={handleItemMoveToLaundry}
                  />
                ))}
              </div>
              
              {collection.items.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-100/80 dark:bg-gray-700/80 rounded-full flex items-center justify-center shadow-[6px_6px_12px_rgba(0,0,0,0.1),-3px_-3px_9px_rgba(255,255,255,0.8)] dark:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-3px_-3px_9px_rgba(255,255,255,0.02)] backdrop-blur-sm">
                    <i className="ri-shirt-line text-2xl text-gray-400 dark:text-gray-500 drop-shadow-sm"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 drop-shadow-sm">No items in this collection</h3>
                  <p className="text-gray-500 dark:text-gray-400 drop-shadow-sm">Add some items to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}