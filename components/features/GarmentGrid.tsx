import React from 'react';
import GarmentCard from './GarmentCard';

interface Garment {
  id: string;
  name: string;
  category: string;
  material: string;
  status: 'Clean' | 'Dirty' | 'Worn 2x' | 'Needs Washing';
  image: string;
}

interface GarmentGridProps {
  garments: Garment[];
}

const GarmentGrid: React.FC<GarmentGridProps> = ({ garments }) => {
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
          image={garment.image}
        />
      ))}
    </div>
  );
};

export default GarmentGrid;