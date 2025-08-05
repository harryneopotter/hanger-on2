
'use client';

import Link from 'next/link';
import Image from 'next/image';

interface GarmentCardProps {
  id: string;
  name: string;
  category: string;
  material: string;
  status: 'Clean' | 'Dirty' | 'Worn 2x' | 'Needs Washing';
  image: string;
  onEdit?: () => void;
}

export default function GarmentCard({ id, name, category, material, status, image, onEdit }: GarmentCardProps) {
  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
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

  const getStatusDot = (statusValue: string) => {
    switch (statusValue) {
      case 'Clean':
        return 'bg-emerald-500 shadow-[2px_2px_5px_rgba(5,150,105,0.3),inset_1px_1px_2px_rgba(255,255,255,0.3)]';
      case 'Worn 2x':
        return 'bg-amber-500 shadow-[2px_2px_5px_rgba(245,158,11,0.3),inset_1px_1px_2px_rgba(255,255,255,0.3)]';
      case 'Dirty':
      case 'Needs Washing':
        return 'bg-red-500 shadow-[2px_2px_5px_rgba(239,68,68,0.3),inset_1px_1px_2px_rgba(255,255,255,0.3)]';
      default:
        return 'bg-gray-400 shadow-[2px_2px_5px_rgba(107,114,128,0.3),inset_1px_1px_2px_rgba(255,255,255,0.3)]';
    }
  };

  return (
    <Link href={`/item/${id}`}>
      <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.02)] hover:shadow-[12px_12px_24px_rgba(0,0,0,0.15),-6px_-6px_18px_rgba(255,255,255,0.8)] dark:hover:shadow-[12px_12px_24px_rgba(0,0,0,0.4),-6px_-6px_18px_rgba(255,255,255,0.03)] transition-all duration-300 overflow-hidden backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
        <div className="relative aspect-square bg-gray-100/30 dark:bg-gray-700/30 overflow-hidden shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-2px_-2px_6px_rgba(255,255,255,0.6)] dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.01)]">
          <div className={`absolute top-3 left-3 w-3 h-3 rounded-full ${getStatusDot(status)}`}></div>
          <Image
            src={image}
            alt={name}
            width={400}
            height={400}
            className="w-full h-full object-cover object-top"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              onEdit?.();
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.03)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.15),-3px_-3px_9px_rgba(255,255,255,0.9)] dark:hover:shadow-[6px_6px_12px_rgba(0,0,0,0.4),-3px_-3px_9px_rgba(255,255,255,0.05)] transition-all duration-200 backdrop-blur-sm"
          >
            <i className="ri-more-line text-gray-600 dark:text-gray-300"></i>
          </button>
        </div>

        {/* Quick action buttons */}
        <div className="flex justify-around p-2">
          <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center shadow-[2px_2px_5px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.7)] dark:shadow-[2px_2px_5px_rgba(0,0,0,0.3),-1px_-1px_3px_rgba(255,255,255,0.05)] hover:shadow-[3px_3px_6px_rgba(0,0,0,0.15),-1.5px_-1.5px_4.5px_rgba(255,255,255,0.8)] dark:hover:shadow-[3px_3px_6px_rgba(0,0,0,0.4),-1.5px_-1.5px_4.5px_rgba(255,255,255,0.07)] transition-all duration-200">
            {/* TODO: Implement Mark as Worn action */}Mark as Worn
          </button>
          <button className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center shadow-[2px_2px_5px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.7)] dark:shadow-[2px_2px_5px_rgba(0,0,0,0.3),-1px_-1px_3px_rgba(255,255,255,0.05)] hover:shadow-[3px_3px_6px_rgba(0,0,0,0.15),-1.5px_-1.5px_4.5px_rgba(255,255,255,0.8)] dark:hover:shadow-[3px_3px_6px_rgba(0,0,0,0.4),-1.5px_-1.5px_4.5px_rgba(255,255,255,0.07)] transition-all duration-200">
            Move to Laundry
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 font-['Inter'] drop-shadow-sm">{name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 drop-shadow-sm">{material} • {category}</p>
          <div className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(status)} backdrop-blur-sm`}>
            {status}
          </div>
        </div>
      </div>
    </Link>
  );
}
