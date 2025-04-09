'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the NutritionCircle component
const NutritionCircle = dynamic(() => import('./NutritionCircle'), { ssr: false });

interface NutritionSectionProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

const NutritionSection: React.FC<NutritionSectionProps> = ({
  calories,
  protein,
  carbs,
  fat,
  fiber,
  sugar,
  sodium
}) => {
  return (
    <div className="mt-8 bg-gray-50 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Nutrition Per Serving</h2>
      
      <div className="flex flex-wrap items-center justify-between">
        <NutritionCircle 
          calories={calories} 
          protein={protein} 
          carbs={carbs} 
          fat={fat}
        />
      </div>
    </div>
  );
};

export default NutritionSection; 