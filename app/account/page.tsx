'use client';

import { useEffect } from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';
import Layout from '../../components/ui/Layout';
import { signOut, useSession } from 'next-auth/react';
import Header from '../../components/ui/Header';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AccountPage() {
  const [darkMode, setDarkMode] = useDarkMode();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: user, error, isLoading } = useSWR(session ? '/api/user' : null, fetcher);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push('/login');
    }
  }, [session, status, router]);

  // Show loading state
  if (status === 'loading' || isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-gray-600 dark:text-gray-400">Loading...</div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-red-600 dark:text-red-400">Error loading profile</div>
        </div>
      </Layout>
    );
  }

  // Don't render if no session or user data
  if (!session || !user) {
    return null;
  }

  // Format join date
  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Default avatar if user doesn't have one
  const userAvatar =
    user.image ||
    'https://readdy.ai/api/search-image?query=Professional%20person%20portrait%2C%20clean%20minimal%20style%2C%20friendly%20smile%2C%20business%20casual%20outfit%2C%20soft%20lighting%2C%20neutral%20background%2C%20high%20quality%20headshot%20photography&width=128&height=128&seq=account-avatar&orientation=squarish';

  const menuItems = [
    {
      icon: 'ri-user-line',
      title: 'Edit Profile',
      description: 'Update your personal information',
      onClick: () => router.push('/account/edit'),
    },
    {
      icon: 'ri-shield-check-line',
      title: 'Privacy & Security',
      description: 'Control your privacy settings',
      onClick: () => console.log('Privacy'),
    },
    {
      icon: 'ri-download-line',
      title: 'Export Data',
      description: 'Download your wardrobe data',
      onClick: () => console.log('Export data'),
    },
    {
      icon: 'ri-upload-line',
      title: 'Import Data',
      description: 'Import wardrobe from file',
      onClick: () => console.log('Import data'),
    },
    {
      icon: 'ri-question-line',
      title: 'Help & Support',
      description: 'Get help and contact support',
      onClick: () => console.log('Help'),
    },
    {
      icon: 'ri-information-line',
      title: 'About Hanger On',
      description: 'App version and information',
      onClick: () => console.log('About'),
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header
          title="Account"
          showThemeToggle={true}
          onThemeToggle={() => setDarkMode(!darkMode)}
          darkMode={darkMode}
        />

        <div className="pt-20 px-6">
          {/* Profile Header */}
          <div className="bg-gray-50/80 dark:bg-gray-800/80 rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200/50 dark:bg-gray-700/50 shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.02)]">
                <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white drop-shadow-sm">
                  {user.name || 'User'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm drop-shadow-sm">
                  {user.email}
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-xs mt-1 drop-shadow-sm">
                  Member since {formatJoinDate(user.joinedDate)}
                </p>
              </div>
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/80 dark:bg-gray-700/80 shadow-[3px_3px_6px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.8)] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.3),-1px_-1px_3px_rgba(255,255,255,0.02)] hover:shadow-[4px_4px_8px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.9)] dark:hover:shadow-[4px_4px_8px_rgba(0,0,0,0.4),-2px_-2px_6px_rgba(255,255,255,0.03)] transition-all duration-200 backdrop-blur-sm"
                onClick={() => router.push('/account/edit')}
              >
                <i className="ri-pencil-line text-gray-600 dark:text-gray-300 text-sm drop-shadow-sm"></i>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200/30 dark:border-gray-700/30">
              <div className="text-center p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/30 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-1px_-1px_3px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.05)] backdrop-blur-sm">
                <div className="text-2xl font-bold text-theme-primary-dark drop-shadow-sm">
                  {user.totalItems}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm drop-shadow-sm">
                  Total Items
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/30 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-1px_-1px_3px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-1px_-1px_3px_rgba(255,255,255,0.05)] backdrop-blur-sm">
                <div className="text-2xl font-bold text-theme-primary-dark drop-shadow-sm">
                  {user.favoriteCategory}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-sm drop-shadow-sm">
                  Favorite Category
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-3">
            {menuItems
              .filter(
                (item) =>
                  !['Privacy & Security', 'Help & Support', 'About Hanger On'].includes(item.title),
              )
              .map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full bg-gray-50/80 dark:bg-gray-800/80 rounded-xl shadow-[6px_6px_12px_rgba(0,0,0,0.1),-3px_-3px_9px_rgba(255,255,255,0.8)] dark:shadow-[6px_6px_12px_rgba(0,0,0,0.3),-3px_-3px_9px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-4 flex items-center space-x-4 hover:shadow-[8px_8px_16px_rgba(0,0,0,0.15),-4px_-4px_12px_rgba(255,255,255,0.9)] dark:hover:shadow-[8px_8px_16px_rgba(0,0,0,0.4),-4px_-4px_12px_rgba(255,255,255,0.03)] transition-all duration-300 !rounded-button"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100/80 dark:bg-gray-700/80 shadow-[3px_3px_6px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.8)] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.3),-1px_-1px_3px_rgba(255,255,255,0.02)] backdrop-blur-sm">
                    <i
                      className={`${item.icon} text-gray-600 dark:text-gray-300 drop-shadow-sm`}
                    ></i>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-gray-900 dark:text-white drop-shadow-sm">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm drop-shadow-sm">
                      {item.description}
                    </p>
                  </div>
                  <i className="ri-arrow-right-s-line text-gray-400 dark:text-gray-500 drop-shadow-sm"></i>
                </button>
              ))}
          </div>

          {/* Logout Button */}
          <div className="mt-8 pb-6">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full bg-red-50/80 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium py-3 px-4 rounded-xl shadow-[6px_6px_12px_rgba(239,68,68,0.2),-3px_-3px_9px_rgba(255,255,255,0.8)] dark:shadow-[6px_6px_12px_rgba(239,68,68,0.3),-3px_-3px_9px_rgba(255,255,255,0.02)] backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 hover:shadow-[8px_8px_16px_rgba(239,68,68,0.3),-4px_-4px_12px_rgba(255,255,255,0.9)] dark:hover:shadow-[8px_8px_16px_rgba(239,68,68,0.4),-4px_-4px_12px_rgba(255,255,255,0.03)] transition-all duration-300 !rounded-button"
            >
              <i className="ri-logout-box-line mr-2 drop-shadow-sm"></i>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
