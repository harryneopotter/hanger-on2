'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/ui/Layout';
import Header from '@/components/ui/Header';
import { useDarkMode } from '@/hooks/useDarkMode';

export default function EditProfilePage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useDarkMode();

  const [form, setForm] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    avatar: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate API
    alert('Profile updated (mock)!');
    router.push('/account');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header
          title="Edit Profile"
          showThemeToggle={true}
          onThemeToggle={() => setDarkMode(!darkMode)}
          darkMode={darkMode}
        />

        <div className="pt-20 px-6">
          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto bg-gray-50/80 dark:bg-gray-800/80 rounded-2xl p-6 space-y-6 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/20 dark:border-gray-700/30"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/80 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/50 focus:border-transparent transition-all duration-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/80 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-theme-primary/50 focus:border-transparent transition-all duration-300 text-sm"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-200/90 dark:bg-gray-700/90 hover:bg-gray-300/90 dark:hover:bg-gray-600/90 text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-theme-primary/90 hover:bg-theme-primary-dark/90 text-white font-semibold py-3 rounded-xl transition-all duration-300"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}