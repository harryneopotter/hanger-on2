'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

interface Collection {
  id: string;
  name: string;
  color: string;
}

interface GarmentCardProps {
  id: string;
  name: string;
  category: string;
  material: string;
  status: 'CLEAN' | 'DIRTY' | 'WORN_2X' | 'NEEDS_WASHING';
  image: string;
  isGuest?: boolean;
  onEdit?: () => void;
  onMarkAsWorn?: () => void;
  onMoveToLaundry?: () => void;
}

export default function GarmentCard({
  id,
  name,
  category,
  material,
  status,
  image,
  isGuest = false,
  onEdit,
  onMarkAsWorn,
  onMoveToLaundry,
}: GarmentCardProps) {
  const { data: session } = useSession();
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showCollectionModal && session) {
      fetchCollections();
    }
  }, [showCollectionModal, session]);

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections');
      if (response.ok) {
        const data = await response.json();
        setCollections(data);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const addToCollection = async (collectionId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/collections/${collectionId}/garments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ garmentIds: [id] }),
      });

      if (response.ok) {
        setShowCollectionModal(false);
        // You could add a toast notification here
      }
    } catch (error) {
      console.error('Error adding to collection:', error);
    } finally {
      setLoading(false);
    }
  };
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CLEAN':
        return 'Clean';
      case 'WORN_2X':
        return 'Worn 2x';
      case 'DIRTY':
        return 'Dirty';
      case 'NEEDS_WASHING':
        return 'Needs Washing';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CLEAN':
        return 'bg-emerald-50/80 text-emerald-700 shadow-[inset_2px_2px_5px_rgba(5,150,105,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] dark:bg-emerald-900/30 dark:text-emerald-300 dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(5,150,105,0.1)]';
      case 'WORN_2X':
        return 'bg-amber-50/80 text-amber-700 shadow-[inset_2px_2px_5px_rgba(245,158,11,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] dark:bg-amber-900/30 dark:text-amber-300 dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(245,158,11,0.1)]';
      case 'DIRTY':
      case 'NEEDS_WASHING':
        return 'bg-red-50/80 text-red-700 shadow-[inset_2px_2px_5px_rgba(239,68,68,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] dark:bg-red-900/30 dark:text-red-300 dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(239,68,68,0.1)]';
      default:
        return 'bg-gray-50/80 text-gray-700 shadow-[inset_2px_2px_5px_rgba(107,114,128,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8)] dark:bg-gray-700/50 dark:text-gray-300 dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(107,114,128,0.1)]';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'CLEAN':
        return 'bg-emerald-500 shadow-[2px_2px_5px_rgba(5,150,105,0.3),inset_1px_1px_2px_rgba(255,255,255,0.3)]';
      case 'WORN_2X':
        return 'bg-amber-500 shadow-[2px_2px_5px_rgba(245,158,11,0.3),inset_1px_1px_2px_rgba(255,255,255,0.3)]';
      case 'DIRTY':
      case 'NEEDS_WASHING':
        return 'bg-red-500 shadow-[2px_2px_5px_rgba(239,68,68,0.3),inset_1px_1px_2px_rgba(255,255,255,0.3)]';
      default:
        return 'bg-gray-400 shadow-[2px_2px_5px_rgba(107,114,128,0.3),inset_1px_1px_2px_rgba(255,255,255,0.3)]';
    }
  };

  return (
    <motion.div
      className="garment-card bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-4px_-4px_12px_rgba(255,255,255,0.7)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-4px_-4px_12px_rgba(255,255,255,0.02)] overflow-hidden backdrop-blur-sm border border-white/20 dark:border-gray-700/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(59, 130, 246, 0.1)',
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        duration: 0.3,
      }}
    >
      <Link href={`/item/${id}`}>
        <motion.div
          className="relative aspect-square bg-gray-100/30 dark:bg-gray-700/30 overflow-hidden shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-2px_-2px_6px_rgba(255,255,255,0.6)] dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.01)] cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={`absolute top-3 left-3 w-3 h-3 rounded-full ${getStatusDot(status)} statusPulse`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          ></motion.div>
          <motion.img
            src={image}
            alt={name}
            className="w-full h-full object-cover object-top"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isGuest) {
                alert('Please sign in to edit garments');
                return;
              }
              onEdit?.();
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-[4px_4px_8px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.8)] dark:shadow-[4px_4px_8px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(255,255,255,0.03)] backdrop-blur-sm"
            whileHover={{
              scale: 1.1,
              rotate: 90,
              boxShadow: '6px 6px 12px rgba(0,0,0,0.15), -3px -3px 9px rgba(255,255,255,0.9)',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <i className="ri-more-line text-gray-600 dark:text-gray-300"></i>
          </motion.button>
        </motion.div>
      </Link>

      {/* Quick action buttons */}
      <motion.div
        className="flex justify-around p-2 gap-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isGuest) {
              alert('Please sign in to edit garments');
              return;
            }
            onMarkAsWorn?.();
          }}
          className="px-2 py-1 bg-hanger-blue text-white text-xs rounded-full min-w-[40px] min-h-[32px] flex items-center justify-center shadow-[2px_2px_5px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.7)] dark:shadow-[2px_2px_5px_rgba(0,0,0,0.3),-1px_-1px_3px_rgba(255,255,255,0.05)]"
          whileHover={{
            scale: 1.05,
            boxShadow: '3px 3px 6px rgba(0,0,0,0.15), -1.5px -1.5px 4.5px rgba(255,255,255,0.8)',
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          Worn
        </motion.button>
        <motion.button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isGuest) {
              alert('Please sign in to edit garments');
              return;
            }
            onMoveToLaundry?.();
          }}
          className="px-2 py-1 bg-hanger-amber text-white text-xs rounded-full min-w-[40px] min-h-[32px] flex items-center justify-center shadow-[2px_2px_5px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.7)] dark:shadow-[2px_2px_5px_rgba(0,0,0,0.3),-1px_-1px_3px_rgba(255,255,255,0.05)]"
          whileHover={{
            scale: 1.05,
            boxShadow: '3px 3px 6px rgba(0,0,0,0.15), -1.5px -1.5px 4.5px rgba(255,255,255,0.8)',
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          Laundry
        </motion.button>
        <motion.button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isGuest) {
              alert('Please sign in to edit garments');
              return;
            }
            setShowCollectionModal(true);
          }}
          className="px-2 py-1 bg-purple-500 text-white text-xs rounded-full min-w-[40px] min-h-[32px] flex items-center justify-center shadow-[2px_2px_5px_rgba(0,0,0,0.1),-1px_-1px_3px_rgba(255,255,255,0.7)] dark:shadow-[2px_2px_5px_rgba(0,0,0,0.3),-1px_-1px_3px_rgba(255,255,255,0.05)]"
          whileHover={{
            scale: 1.1,
            rotate: 90,
            boxShadow: '3px 3px 6px rgba(0,0,0,0.15), -1.5px -1.5px 4.5px rgba(255,255,255,0.8)',
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          +
        </motion.button>
      </motion.div>

      <Link href={`/item/${id}`}>
        <div className="p-4 cursor-pointer">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 font-['Inter'] drop-shadow-sm">
            {name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 drop-shadow-sm">
            {material} • {category}
          </p>
          <div
            className={`inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(status)} backdrop-blur-sm`}
          >
            {getStatusLabel(status)}
          </div>
        </div>
      </Link>

      {/* Collection Modal */}
      <AnimatePresence>
        {showCollectionModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowCollectionModal(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Add to Collection
              </h3>

              {collections.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                  No collections found. Create a collection first.
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {collections.map((collection, index) => (
                    <motion.button
                      key={collection.id}
                      onClick={() => addToCollection(collection.id)}
                      disabled={loading}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: collection.color }}
                          whileHover={{ scale: 1.2 }}
                          transition={{ duration: 0.2 }}
                        ></motion.div>
                        <span className="text-gray-900 dark:text-white">{collection.name}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowCollectionModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
