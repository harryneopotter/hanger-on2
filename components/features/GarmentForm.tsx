'use client';

import React, { useState } from 'react';

import { Garment } from '@/lib/validation/schemas';

interface GarmentFormProps {
  initialData?: {
    name: string;
    category: string;
    material: string;
    status: 'Clean' | 'Dirty' | 'Worn 2x' | 'Needs Washing';
  };
  onSubmit: (data: Garment) => void;
}

const GarmentForm: React.FC<GarmentFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    category: '',
    material: '',
    status: 'Clean',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
      <div className="mb-6">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-100/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.6)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(255,255,255,0.01)] transition-all duration-200"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-100/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.6)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(255,255,255,0.01)] transition-all duration-200"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="material" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Material</label>
        <input
          type="text"
          id="material"
          name="material"
          value={formData.material}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-100/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.6)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(255,255,255,0.01)] transition-all duration-200"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-100/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.6)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(255,255,255,0.01)] transition-all duration-200 appearance-none"
        >
          <option value="Clean">Clean</option>
          <option value="Dirty">Dirty</option>
          <option value="Worn 2x">Worn 2x</option>
          <option value="Needs Washing">Needs Washing</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow-[8px_8px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.02)] hover:shadow-[12px_12px_24px_rgba(0,0,0,0.15),-6px_-6px_18px_rgba(255,255,255,0.8)] dark:hover:shadow-[12px_12px_24px_rgba(0,0,0,0.4),-6px_-6px_18px_rgba(255,255,255,0.03)] transition-all duration-300 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] dark:active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.05)]"
      >
        Save Garment
      </button>
    </form>
  );
};

export default GarmentForm;