'use client';

import { useState, useEffect } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useTheme } from '@/hooks/useTheme';
import Layout from '@/components/ui/Layout';
import Header from '@/components/ui/Header';

export default function Settings() {
  const [darkMode, setDarkMode] = useDarkMode();
  // darkMode managed by hook
  // const [darkMode, setDarkMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useTheme();
  const [autoBackup, setAutoBackup] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const themeOptions = [
    { name: 'indigo', label: 'Indigo', color: 'bg-indigo-500' },
    { name: 'blue', label: 'Blue', color: 'bg-blue-500' },
    { name: 'purple', label: 'Purple', color: 'bg-purple-500' },
    { name: 'pink', label: 'Pink', color: 'bg-pink-500' },
    { name: 'green', label: 'Green', color: 'bg-green-500' },
    { name: 'orange', label: 'Orange', color: 'bg-orange-500' },
  ];

  // Theme is now managed by useTheme hook

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    // theme toggled via hook
  };

  const handleExport = () => {
    const data = {
      wardrobe: [],
      settings: { darkMode, selectedTheme, autoBackup },
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hanger-on-wardrobe-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowExportModal(false);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          console.log('Imported data:', data);
          setShowImportModal(false);
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Layout>
      <div>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
          <Header
            title="Settings"
            showThemeToggle
            onThemeToggle={handleThemeToggle}
            darkMode={darkMode}
          />

          <div className="pt-20 pb-24">
            <div className="px-6 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Appearance
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Dark Mode</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Toggle between light and dark themes
                      </div>
                    </div>
                    <button
                      onClick={handleThemeToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:ring-offset-2 ${
                        darkMode ? 'bg-theme-primary-dark' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Theme Colors
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Choose your preferred accent color
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-3">
                    {themeOptions.map((theme) => (
                      <button
                        key={theme.name}
                        onClick={() => setSelectedTheme(theme.name)}
                        className={`relative p-3 rounded-xl transition-all duration-300 ${
                          selectedTheme === theme.name
                            ? 'shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.02)] bg-gray-100/50 dark:bg-gray-700/50'
                            : 'shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.02)] bg-gray-50/50 dark:bg-gray-800/50 hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-3px_-3px_9px_rgba(255,255,255,0.9)] dark:hover:shadow-[6px_6px_12px_rgba(0,0,0,0.4),-3px_-3px_9px_rgba(255,255,255,0.03)]'
                        } backdrop-blur-sm border border-white/20 dark:border-gray-700/30`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div
                            className={`w-8 h-8 rounded-full ${theme.color} shadow-[2px_2px_4px_rgba(0,0,0,0.2)] ring-2 ring-white/50 dark:ring-gray-800/50`}
                          ></div>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 drop-shadow-sm">
                            {theme.label}
                          </span>
                        </div>
                        {selectedTheme === theme.name && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-[2px_2px_4px_rgba(0,0,0,0.2)]">
                            <i className="ri-check-line text-white text-xs"></i>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Data Management
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Auto Backup</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Automatically backup your wardrobe data
                      </div>
                    </div>
                    <button
                      onClick={() => setAutoBackup(!autoBackup)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-theme-primary focus:ring-offset-2 ${
                        autoBackup ? 'bg-theme-primary' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          autoBackup ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <button
                      onClick={() => setShowExportModal(true)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-theme-primary text-white rounded-xl font-medium hover:bg-theme-primary-dark transition-colors duration-200 !rounded-button"
                    >
                      <i className="ri-download-2-line"></i>
                      Export Data
                    </button>
                    <button
                      onClick={() => setShowImportModal(true)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 !rounded-button"
                    >
                      <i className="ri-upload-2-line"></i>
                      Import Data
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">About</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-theme-primary-light dark:bg-theme-primary-dark rounded-2xl flex items-center justify-center">
                      <i className="ri-shirt-line text-2xl text-theme-primary-dark dark:text-theme-primary"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white font-['Pacifico']">
                      Hanger On
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 mb-4">
                      Your privacy-focused digital wardrobe manager
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Version 1.0.0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showExportModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Export Wardrobe Data
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  This will download a JSON file containing all your wardrobe data and settings.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 !rounded-button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex-1 px-4 py-3 bg-theme-primary text-white rounded-xl font-medium hover:bg-theme-primary-dark transition-colors duration-200 !rounded-button"
                  >
                    Export
                  </button>
                </div>
              </div>
            </div>
          )}

          {showImportModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Import Wardrobe Data
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Select a JSON file exported from Hanger On to restore your wardrobe data.
                </p>
                <div className="mb-6">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent transition-all duration-200 text-sm"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 !rounded-button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
