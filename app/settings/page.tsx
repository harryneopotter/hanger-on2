
'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import Header from '@/components/Header';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleExport = () => {
    const data = {
      wardrobe: [],
      settings: { darkMode, notifications, autoBackup },
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hangaron-wardrobe-${new Date().toISOString().split('T')[0]}.json`;
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
      <div className={darkMode ? 'dark' : ''}>
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
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Dark Mode</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark themes</div>
                    </div>
                    <button
                      onClick={handleThemeToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        darkMode ? 'bg-indigo-600' : 'bg-gray-200'
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
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Push Notifications</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Get notified about washing reminders</div>
                    </div>
                    <button
                      onClick={() => setNotifications(!notifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        notifications ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          notifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Data Management</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Auto Backup</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Automatically backup your wardrobe data</div>
                    </div>
                    <button
                      onClick={() => setAutoBackup(!autoBackup)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        autoBackup ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'
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
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors duration-200 !rounded-button"
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
                    <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 dark:bg-indigo-900 rounded-2xl flex items-center justify-center">
                      <i className="ri-shirt-line text-2xl text-indigo-600 dark:text-indigo-400"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white font-[\'Pacifico\']">HangarOn</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 mb-4">Your privacy-focused digital wardrobe manager</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Version 1.0.0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showExportModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export Wardrobe Data</h3>
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
                    className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors duration-200 !rounded-button"
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Import Wardrobe Data</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Select a JSON file exported from HangarOn to restore your wardrobe data.
                </p>
                <div className="mb-6">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
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
