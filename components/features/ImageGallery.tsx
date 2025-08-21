import React from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {images.map((imageUrl, index) => (
        <div
          key={index}
          className="relative aspect-square rounded-xl overflow-hidden
                     bg-gray-50/50 dark:bg-gray-800/50
                     shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-2px_-2px_6px_rgba(255,255,255,0.6)]
                     dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-2px_-2px_6px_rgba(255,255,255,0.01)]"
        >
          <Image
            src={imageUrl}
            alt={`Gallery image ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;