'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CollectionDetail from '@/src/components/features/CollectionDetail';
import { UpdateCollection } from '@/lib/validation/schemas';

interface Collection {
  id: string;
  name: string;
  description: string;
  color: string;
  image?: string;
  isSmartCollection: boolean;
  rules?: Array<{
    field: string;
    operator: string;
    value: string;
  }>;
  createdAt: string;
  updatedAt: string;
  garments: Array<{
    id: string;
    name: string;
    category: string;
    color: string;
    brand?: string;
    material?: string;
    status: string;
    images: Array<{
      id: string;
      url: string;
      altText?: string;
    }>;
    tags: Array<{
      id: string;
      name: string;
      color: string;
    }>;
  }>;
  _count: {
    garments: number;
  };
}

export default function CollectionPage() {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const collectionId = params.id as string;

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    fetchCollection();
  }, [session, status, collectionId]);

  const fetchCollection = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/collections/${collectionId}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Collection not found');
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch collection');
        }
        return;
      }

      const data = await response.json();
      setCollection(data);
    } catch (error) {
      console.error('Error fetching collection:', error);
      setError('Failed to load collection');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: UpdateCollection) => {
    try {
      const response = await fetch(`/api/collections/${collectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update collection');
      }

      const updatedCollection = await response.json();
      setCollection(updatedCollection);
    } catch (error) {
      console.error('Error updating collection:', error);
      throw error;
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/collections/${collectionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete collection');
      }

      router.push('/collections');
    } catch (error) {
      console.error('Error deleting collection:', error);
      throw error;
    }
  };

  const handleAddGarments = async (garmentIds: string[]) => {
    try {
      const response = await fetch(`/api/collections/${collectionId}/garments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ garmentIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add garments');
      }

      // Refresh collection data
      await fetchCollection();
    } catch (error) {
      console.error('Error adding garments:', error);
      throw error;
    }
  };

  const handleRemoveGarment = async (garmentId: string) => {
    try {
      const response = await fetch(`/api/collections/${collectionId}/garments`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ garmentIds: [garmentId] }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove garment');
      }

      // Update local state
      if (collection) {
        setCollection({
          ...collection,
          garments: collection.garments.filter((g) => g.id !== garmentId),
          _count: {
            garments: collection._count.garments - 1,
          },
        });
      }
    } catch (error) {
      console.error('Error removing garment:', error);
      throw error;
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-theme-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{error}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The collection you're looking for might have been deleted or you don't have permission
            to view it.
          </p>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 px-4 py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collections
          </Link>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Collection not found
          </h2>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 px-4 py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Collections
          </Link>
        </div>

        <CollectionDetail
          collection={collection}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onAddGarments={handleAddGarments}
          onRemoveGarment={handleRemoveGarment}
        />
      </div>
    </div>
  );
}
