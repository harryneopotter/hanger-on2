import React from 'react';
import GarmentCard from './GarmentCard';

interface Garment {
  id: string;
  name: string;
  category: string;
  material: string;
  status: 'Clean' | 'Dirty' | 'Worn 2x' | 'Needs Washing';
  imageUrl: string;
}

interface GarmentGridProps {
  garments: Garment[];
  isGuest?: boolean;
  onEdit?: (garment: Garment) => void;
  onMarkAsWorn?: (garment: Garment) => void;
  onMoveToLaundry?: (garment: Garment) => void;
}

const GarmentGrid: React.FC<GarmentGridProps> = ({ garments, isGuest = false, onEdit, onMarkAsWorn, onMoveToLaundry }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {garments.map(garment => (
        <GarmentCard
          key={garment.id}
          id={garment.id}
          name={garment.name}
          category={garment.category}
          material={garment.material}
          status={garment.status}
          imageUrl={garment.imageUrl}
          isGuest={isGuest}
          onEdit={() => onEdit?.(garment)}
          onMarkAsWorn={() => onMarkAsWorn?.(garment)}
          onMoveToLaundry={() => onMoveToLaundry?.(garment)}
        />
      ))}
    </div>
  );
};

export default GarmentGrid;