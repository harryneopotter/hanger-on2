'use client';

import { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Header from '@/components/Header';

interface ItemDetailProps {
  itemId: string;
}

export default function ItemDetail({ itemId }: ItemDetailProps) {
  const [darkMode, setDarkMode] = useState(false);

  const garments = {
    '1': {
      id: '1',
      name: 'Silk Blouse',
      category: 'Shirts',
      material: 'Silk',
      status: 'Clean' as const,
      brand: 'Everlane',
      size: 'M',
      color: 'Ivory',
      price: '$89',
      purchaseDate: '2024-01-15',
      lastWorn: '2024-02-10',
      wearCount: 8,
      careInstructions: 'Hand wash cold, hang dry, iron on low heat',
      notes: 'Perfect for work meetings and dinner dates. Pairs well with high-waist trousers.',
      image: 'https://readdy.ai/api/search-image?query=Elegant%20silk%20blouse%20for%20women%2C%20flowing%20fabric%2C%20professional%20feminine%20style%2C%20soft%20pastel%20colors%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20high-quality%20fashion%20photography%2C%20delicate%20texture%20details&width=400&height=400&seq=blouse1&orientation=squarish'
    },
    '2': {
      id: '2',
      name: 'High-Waist Jeans',
      category: 'Pants',
      material: 'Denim',
      status: 'Worn 2x' as const,
      brand: 'Levi\'s',
      size: '28',
      color: 'Dark Wash',
      price: '$98',
      purchaseDate: '2023-11-20',
      lastWorn: '2024-02-08',
      wearCount: 15,
      careInstructions: 'Machine wash cold, tumble dry low, wash inside out',
      notes: 'Great fit, very comfortable. Goes with everything in my wardrobe.',
      image: 'https://readdy.ai/api/search-image?query=High-waisted%20denim%20jeans%20for%20women%2C%20modern%20fit%2C%20dark%20blue%20wash%2C%20feminine%20silhouette%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20fashion%20styling%2C%20premium%20denim%20texture&width=400&height=400&seq=jeans2&orientation=squarish'
    },
    '3': {
      id: '3',
      name: 'Ballet Flats',
      category: 'Shoes',
      material: 'Leather',
      status: 'Clean' as const,
      brand: 'Repetto',
      size: '7',
      color: 'Nude',
      price: '$195',
      purchaseDate: '2024-01-05',
      lastWorn: '2024-02-09',
      wearCount: 12,
      careInstructions: 'Wipe with damp cloth, use leather conditioner monthly',
      notes: 'Incredibly comfortable for all-day wear. Classic and versatile.',
      image: 'https://readdy.ai/api/search-image?query=Classic%20ballet%20flats%20for%20women%2C%20soft%20leather%2C%20elegant%20feminine%20design%2C%20neutral%20beige%20color%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20luxury%20footwear%20styling%2C%20sophisticated%20details&width=400&height=400&seq=flats1&orientation=squarish'
    },
    '4': {
      id: '4',
      name: 'Cashmere Cardigan',
      category: 'Outerwear',
      material: 'Cashmere',
      status: 'Dirty' as const,
      brand: 'Uniqlo',
      size: 'S',
      color: 'Camel',
      price: '$79',
      purchaseDate: '2023-10-12',
      lastWorn: '2024-02-07',
      wearCount: 22,
      careInstructions: 'Dry clean only, store flat, use cashmere comb',
      notes: 'Needs dry cleaning. Perfect layering piece for office and weekends.',
      image: 'https://readdy.ai/api/search-image?query=Luxurious%20cashmere%20cardigan%20for%20women%2C%20soft%20knit%20texture%2C%20elegant%20draping%2C%20warm%20neutral%20tones%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20premium%20knitwear%20styling%2C%20cozy%20feminine%20fashion&width=400&height=400&seq=cardigan1&orientation=squarish'
    },
    '5': {
      id: '5',
      name: 'Midi Dress',
      category: 'Dresses',
      material: 'Cotton',
      status: 'Clean' as const,
      brand: '& Other Stories',
      size: 'M',
      color: 'Forest Green',
      price: '$65',
      purchaseDate: '2023-09-18',
      lastWorn: '2024-02-06',
      wearCount: 6,
      careInstructions: 'Machine wash cold, hang dry, steam if needed',
      notes: 'Beautiful color, perfect for brunch and casual dates. Very flattering silhouette.',
      image: 'https://readdy.ai/api/search-image?query=Elegant%20midi%20dress%20for%20women%2C%20flowing%20cotton%20fabric%2C%20feminine%20silhouette%2C%20sophisticated%20design%2C%20soft%20colors%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20modern%20fashion%20styling%2C%20versatile%20wardrobe%20piece&width=400&height=400&seq=dress1&orientation=squarish'
    },
    '6': {
      id: '6',
      name: 'Ankle Boots',
      category: 'Shoes',
      material: 'Leather',
      status: 'Clean' as const,
      brand: 'Acne Studios',
      size: '7.5',
      color: 'Black',
      price: '$450',
      purchaseDate: '2023-08-30',
      lastWorn: '2024-02-05',
      wearCount: 18,
      careInstructions: 'Polish regularly, waterproof spray before wearing',
      notes: 'Investment piece. Goes with everything from jeans to dresses.',
      image: 'https://readdy.ai/api/search-image?query=Stylish%20ankle%20boots%20for%20women%2C%20premium%20leather%20construction%2C%20modern%20heel%20design%2C%20versatile%20black%20color%2C%20product%20photography%20on%20white%20background%2C%20centered%20composition%2C%20luxury%20footwear%20styling%2C%20contemporary%20fashion&width=400&height=400&seq=boots2&orientation=squarish'
    }
  };

  const item = garments[itemId as keyof typeof garments];

  if (!item) {
    return (
      <Layout>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Item not found</h2>
            <Link href="/" className="text-indigo-600 dark:text-indigo-400">Return to closet</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Clean':
        return 'bg-emerald-50/80 text-emerald-700 shadow-[inset_2px_2px_5px_rgba(5,150,105,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] dark:bg-emerald-900/30 dark:text-emerald-300 dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(5,150,105,0.1)]';
      case 'Worn 2x':
        return 'bg-amber-50/80 text-amber-700 shadow-[inset_2px_2px_5px_rgba(245,158,11,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] dark:bg-amber-900/30 dark:text-amber-300 dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(245,158,11,0.1)]';
      case 'Dirty':
      case 'Needs Washing':
        return 'bg-red-50/80 text-red-700 shadow-[inset_2px_2px_5px_rgba(239,68,68,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] dark:bg-red-900/30 dark:text-red-300 dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(239,68,68,0.1)]';
      default:
        return 'bg-gray-50/80 text-gray-700 shadow-[inset_2px_2px_5px_rgba(107,114,128,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] dark:bg-gray-700/50 dark:text-gray-300 dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(107,114,128,0.1)]';
    }
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <Layout>
      <div className={darkMode ? 'dark' : ''}>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
          <header className="fixed top-0 left-0 right-0 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.1),-2px_-2px_8px_rgba(255,255,255,0.6)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3),-2px_-2px_8px_rgba(255,255,255,0.02)] border-b border-white/30 dark:border-gray-700/50 z-50">
            <div className="flex items-center justify-between px-6 h-16">
              <Link
                href="/"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50/80 dark:bg-gray-700/80 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.03)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-3px_-3px_9px_rgba(255,255,255,0.9)] dark:hover:shadow-[6px_6px_12px_rgba(0,0,0,0.4),-3px_-3px_9px_rgba(255,255,255,0.05)] transition-all duration-200 backdrop-blur-sm border border-white/20 dark:border-gray-600/30"
              >
                <i className="ri-arrow-left-line text-lg text-gray-600 dark:text-gray-300 drop-shadow-sm"></i>
              </Link>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white drop-shadow-sm">
                {item.name}
              </h1>
              <button
                onClick={handleThemeToggle}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50/80 dark:bg-gray-700/80 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.03)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-3px_-3px_9px_rgba(255,255,255,0.9)] dark:hover:shadow-[6px_6px_12px_rgba(0,0,0,0.4),-3px_-3px_9px_rgba(255,255,255,0.05)] transition-all duration-200 backdrop-blur-sm border border-white/20 dark:border-gray-600/30"
              >
                <i className={`${darkMode ? 'ri-sun-line' : 'ri-moon-line'} text-lg text-gray-600 dark:text-gray-300 drop-shadow-sm`}></i>
              </button>
            </div>
          </header>

          <div className="pt-20 pb-6">
            <div className="px-6">
              <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.02)] overflow-hidden backdrop-blur-sm border border-white/20 dark:border-gray-700/30 mb-6">
                <div className="aspect-square bg-gray-100/30 dark:bg-gray-700/30 overflow-hidden shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-2px_-2px_6px_rgba(255,255,255,0.6)] dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.01)]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 drop-shadow-sm">{item.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400 drop-shadow-sm">{item.brand}</p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(item.status)} backdrop-blur-sm`}>
                    {item.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-100/50 dark:bg-gray-700/50 rounded-xl p-4 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2),inset_-2px_-2px_5px_rgba(255,255,255,0.01)]">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Category</div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.category}</div>
                  </div>
                  <div className="bg-gray-100/50 dark:bg-gray-700/50 rounded-xl p-4 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2),inset_-2px_-2px_5px_rgba(255,255,255,0.01)]">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Material</div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.material}</div>
                  </div>
                  <div className="bg-gray-100/50 dark:bg-gray-700/50 rounded-xl p-4 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2),inset_-2px_-2px_5px_rgba(255,255,255,0.01)]">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Size</div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.size}</div>
                  </div>
                  <div className="bg-gray-100/50 dark:bg-gray-700/50 rounded-xl p-4 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2),inset_-2px_-2px_5px_rgba(255,255,255,0.01)]">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Color</div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.color}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Price</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{item.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Purchase Date</span>
                    <span className="text-gray-900 dark:text-white">{new Date(item.purchaseDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Last Worn</span>
                    <span className="text-gray-900 dark:text-white">{new Date(item.lastWorn).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Wear Count</span>
                    <span className="text-gray-900 dark:text-white">{item.wearCount} times</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 drop-shadow-sm">Care Instructions</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed drop-shadow-sm">{item.careInstructions}</p>
              </div>

              <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 drop-shadow-sm">Notes</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed drop-shadow-sm">{item.notes}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-[4px_4px_8px_rgba(79,70,229,0.3),-2px_-2px_6px_rgba(255,255,255,0.8)] hover:shadow-[6px_6px_12px_rgba(79,70,229,0.4),-3px_-3px_9px_rgba(255,255,255,0.9)] transition-all duration-200 !rounded-button">
                  <i className="ri-edit-line"></i>
                  Edit Item
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.02)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-3px_-3px_9px_rgba(255,255,255,0.9)] dark:hover:shadow-[6px_6px_12px_rgba(0,0,0,0.4),-3px_-3px_9px_rgba(255,255,255,0.03)] transition-all duration-200 !rounded-button">
                  <i className="ri-delete-bin-line"></i>
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}