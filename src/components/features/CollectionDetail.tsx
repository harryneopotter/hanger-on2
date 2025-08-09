'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Grid, List, Settings, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Collection, UpdateCollection } from '@/lib/validation/schemas';
import CollectionForm from './CollectionForm';
import SmartCollectionManager from './SmartCollectionManager';

interface Garment {
  id: string;
  name: string;
  category: string;
  color: string;
  brand?: string;
  material?: string;
  status: string;
  images: { id: string; url: string; altText?: string }[];
  tags: { id: string; name: string; color: string }[];
}

interface CollectionDetailProps {
  collection: Collection & {
    garments: Garment[];
    _count: { garments: number };
  };
  onUpdate: (data: UpdateCollection) => Promise<void>;
  onDelete: () => Promise<void>;
  onAddGarments: (garmentIds: string[]) => Promise<void>;
  onRemoveGarment: (garmentId: string) => Promise<void>;
}

export default function CollectionDetail({
  collection,
  onUpdate,
  onDelete,
  onAddGarments,
  onRemoveGarment,
}: CollectionDetailProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (data: UpdateCollection) => {
    setLoading(true);
    try {
      await onUpdate(data);
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating collection:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete();
    } catch (error) {
      console.error('Error deleting collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveGarment = async (garmentId: string) => {
    try {
      await onRemoveGarment(garmentId);
    } catch (error) {
      console.error('Error removing garment:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Collection Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="h-32 relative" style={{ backgroundColor: collection.color || '#3B82F6' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          {collection.image && (
            <Image src={collection.image} alt={collection.name} fill className="object-cover" />
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {collection.name}
                </h1>
                {collection.isSmartCollection && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
                    <Sparkles className="w-3 h-3" />
                    Smart
                  </span>
                )}
              </div>
              {collection.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">{collection.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{collection._count.garments} items</span>
                <span>•</span>
                <span>Created {new Date(collection.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEditForm(true)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Collection Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-theme-primary text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-theme-primary text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>

        {!collection.isSmartCollection && (
          <button className="flex items-center gap-2 px-4 py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            Add Garments
          </button>
        )}
      </div>

      {/* Smart Collection Rules */}
      {collection.isSmartCollection && (
        <SmartCollectionManager
          collectionId={collection.id}
          rules={collection.rules || []}
          onUpdateRules={async (rules) => {
            await onUpdate({ rules });
          }}
          onRefreshCollection={async () => {
            try {
              const response = await fetch('/api/collections/smart/refresh', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ collectionId: collection.id }),
              });

              if (!response.ok) {
                throw new Error('Failed to refresh collection');
              }

              // Trigger a refresh of the collection data
              window.location.reload();
            } catch (error) {
              console.error('Error refreshing smart collection:', error);
              throw error;
            }
          }}
          garmentCount={collection._count.garments}
        />
      )}

      {/* Garments Grid/List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {collection.garments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No garments in this collection
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {collection.isSmartCollection
                ? 'No garments match the current rules. Try adjusting the rules or wait for new garments to be added.'
                : 'Start building your collection by adding some garments.'}
            </p>
            {!collection.isSmartCollection && (
              <button className="px-4 py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-primary/90 transition-colors">
                Add Garments
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {collection.garments.map((garment) => (
              <div
                key={garment.id}
                className={
                  viewMode === 'grid'
                    ? 'group cursor-pointer'
                    : 'flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                }
              >
                <Link href={`/garments/${garment.id}`} className="block">
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden mb-3 relative'
                        : 'w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative flex-shrink-0'
                    }
                  >
                    {garment.images[0] ? (
                      <Image
                        src={garment.images[0].url}
                        alt={garment.images[0].altText || garment.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Grid className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className={viewMode === 'grid' ? '' : 'flex-1 min-w-0'}>
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {garment.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {garment.category} • {garment.color}
                    </p>
                    {garment.brand && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                        {garment.brand}
                      </p>
                    )}
                  </div>
                </Link>

                {!collection.isSmartCollection && (
                  <button
                    onClick={() => handleRemoveGarment(garment.id)}
                    className={
                      viewMode === 'grid'
                        ? 'absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                        : 'p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors'
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Form Modal */}
      <CollectionForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleUpdate}
        initialData={{
          name: collection.name,
          description: collection.description,
          color: collection.color,
          image: collection.image,
          isSmartCollection: collection.isSmartCollection,
          rules: collection.rules,
        }}
        title="Edit Collection"
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Delete Collection
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{collection.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
