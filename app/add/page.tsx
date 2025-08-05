
'use client';

import { useState } from 'react';
import Layout from '@/components/ui/Layout';
import ImageUpload from '@/components/features/ImageUpload';
import ImageCropper from '@/components/features/ImageCropper';
import Header from '@/components/ui/Header';

export default function AddItem() {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    customCategory: '',
    brand: '',
    material: '',
    color: '',
    purchaseDate: '',
    price: '',
    washingInstructions: '',
    notes: '',
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageCrop, setShowImageCrop] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const categories = ['Shirts', 'Pants', 'Shoes', 'Accessories', 'Outerwear', 'Dresses', 'Suits', 'Add Custom Category'];
  const materials = ['Cotton', 'Wool', 'Silk', 'Polyester', 'Linen', 'Denim', 'Leather', 'Cashmere'];
  const washingOptions = ['Machine Wash Cold', 'Hand Wash Only', 'Dry Clean Only', 'Machine Wash Warm', 'Delicate Cycle'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'category') {
      if (value === 'Add Custom Category') {
        setShowCustomCategory(true);
        setFormData(prev => ({ ...prev, category: '', customCategory: '' }));
      } else {
        setShowCustomCategory(false);
        setFormData(prev => ({ ...prev, category: value, customCategory: '' }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setShowImageCrop(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = showCustomCategory ? formData.customCategory : formData.category;
    console.log('Form data:', { ...formData, finalCategory });
    console.log('Image:', selectedImage);
    alert('Item added successfully!');
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <Layout>
      <div className={darkMode ? 'dark' : ''}>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
          <Header 
            title="Add New Item" 
            showThemeToggle 
            onThemeToggle={handleThemeToggle} 
            darkMode={darkMode}
          />

          <div className="pt-20 pb-24">
            <form onSubmit={handleSubmit} className="px-6 space-y-6">

              <div className="bg-gray-50/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 drop-shadow-sm">Item Photo</h2>

                <div className="relative">
                  {showImageCrop ? (
                    // Pass selectedImage to ImageCropper and handle crop/cancel
                    <ImageCropper onImageCropped={() => {}} onCancel={() => setShowImageCrop(false)} />
                  ) : (
                    // Pass the handler that updates state and shows cropper
                    <ImageUpload onImageSelect={handleImageUpload} />
                  )}
                </div>
              </div>

              <div className="bg-gray-50/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/20 dark:border-gray-700/30 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 drop-shadow-sm">Item Details</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Black Midi Dress"
                    className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/80 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 text-sm shadow-[inset_3px_3px_6px_rgba(0,0,0,0.06),inset_-1px_-1px_3px_rgba(255,255,255,0.7)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/10 dark:border-gray-600/20 focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.8)] dark:focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.03)]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={showCustomCategory ? 'Add Custom Category' : formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/80 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 text-sm shadow-[inset_3px_3px_6px_rgba(0,0,0,0.06),inset_-1px_-1px_3px_rgba(255,255,255,0.7)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/10 dark:border-gray-600/20 focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.8)] dark:focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.03)]"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>

                    {showCustomCategory && (
                      <div className="mt-3">
                        <input
                          type="text"
                          name="customCategory"
                          value={formData.customCategory}
                          onChange={handleInputChange}
                          placeholder="Enter custom category"
                          className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/80 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 text-sm shadow-[inset_3px_3px_6px_rgba(0,0,0,0.06),inset_-1px_-1px_3px_rgba(255,255,255,0.7)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/10 dark:border-gray-600/20 focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.8)] dark:focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.03)]"
                          required={showCustomCategory}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Material
                    </label>
                    <select
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/80 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 text-sm shadow-[inset_3px_3px_6px_rgba(0,0,0,0.06),inset_-1px_-1px_3px_rgba(255,255,255,0.7)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/10 dark:border-gray-600/20 focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.8)] dark:focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.03)]"
                    >
                      <option value="">Select material</option>
                      {materials.map(material => (
                        <option key={material} value={material}>{material}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g., Ralph Lauren"
                    className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/80 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 text-sm shadow-[inset_3px_3px_6px_rgba(0,0,0,0.06),inset_-1px_-1px_3px_rgba(255,255,255,0.7)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/10 dark:border-gray-600/20 focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.8)] dark:focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.03)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/80 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 text-sm shadow-[inset_3px_3px_6px_rgba(0,0,0,0.06),inset_-1px_-1px_3px_rgba(255,255,255,0.7)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/10 dark:border-gray-600/20 focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.8)] dark:focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.03)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/80 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 text-sm shadow-[inset_3px_3px_6px_rgba(0,0,0,0.06),inset_-1px_-1px_3px_rgba(255,255,255,0.7)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/10 dark:border-gray-600/20 focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.8)] dark:focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.03)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Washing Instructions
                  </label>
                  <select
                    name="washingInstructions"
                    value={formData.washingInstructions}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/80 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 text-sm shadow-[inset_3px_3px_6px_rgba(0,0,0,0.06),inset_-1px_-1px_3px_rgba(255,255,255,0.7)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/10 dark:border-gray-600/20 focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.8)] dark:focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.03)]"
                  >
                    <option value="">Select washing method</option>
                    {washingOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes about this item..."
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/80 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300 text-sm shadow-[inset_3px_3px_6px_rgba(0,0,0,0.06),inset_-1px_-1px_3px_rgba(255,255,255,0.7)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/10 dark:border-gray-600/20 focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.8)] dark:focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-2px_-2px_6px_rgba(255,255,255,0.03)] resize-none"
                  />
                  <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.notes.length}/500
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-500/90 hover:bg-indigo-600/90 text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-[6px_6px_12px_rgba(79,70,229,0.3),-3px_-3px_9px_rgba(255,255,255,0.8)] dark:shadow-[6px_6px_12px_rgba(79,70,229,0.4),-3px_-3px_9px_rgba(255,255,255,0.03)] hover:shadow-[8px_8px_16px_rgba(79,70,229,0.4),-4px_-4px_12px_rgba(255,255,255,0.9)] dark:hover:shadow-[8px_8px_16px_rgba(79,70,229,0.5),-4px_-4px_12px_rgba(255,255,255,0.05)] backdrop-blur-sm !rounded-button"
              >
                Add to Wardrobe
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
