
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { 
      href: '/', 
      icon: 'ri-handbag-2-line', 
      activeIcon: 'ri-handbag-2-fill',
      label: 'Closet' 
    },
    { 
      href: '/add', 
      icon: 'ri-add-circle-line', 
      activeIcon: 'ri-add-circle-fill',
      label: 'Add' 
    },
    { 
      href: '/collections', 
      icon: 'ri-folder-3-line', 
      activeIcon: 'ri-folder-3-fill',
      label: 'Collections' 
    },
    { 
      href: '/stats', 
      icon: 'ri-bar-chart-2-line', 
      activeIcon: 'ri-bar-chart-2-fill',
      label: 'Stats' 
    },
    { 
      href: '/settings', 
      icon: 'ri-settings-3-line', 
      activeIcon: 'ri-settings-3-fill',
      label: 'Settings' 
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-[0_-4px_12px_rgba(0,0,0,0.1),2px_2px_8px_rgba(255,255,255,0.6)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.3),2px_2px_8px_rgba(255,255,255,0.02)] border-t border-white/30 dark:border-gray-700/50 z-50">
      <div className="grid grid-cols-5 h-20 px-0">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                isActive 
                  ? 'shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.02)]' 
                  : 'shadow-[2px_2px_4px_rgba(0,0,0,0.05),-1px_-1px_3px_rgba(255,255,255,0.7)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.2),-1px_-1px_3px_rgba(255,255,255,0.01)] hover:shadow-[3px_3px_6px_rgba(0,0,0,0.08),-2px_-2px_4px_rgba(255,255,255,0.8)] dark:hover:shadow-[3px_3px_6px_rgba(0,0,0,0.25),-2px_-2px_4px_rgba(255,255,255,0.02)]'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <i 
                  className={`${isActive ? item.activeIcon : item.icon} text-lg ${
                    isActive 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  } drop-shadow-sm`}
                />
              </div>
              <span 
                className={`text-xs font-medium ${
                  isActive 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-500 dark:text-gray-400'
                } drop-shadow-sm`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
