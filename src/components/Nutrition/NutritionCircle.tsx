'use client';

import React from 'react';
import 'react-circular-progressbar/dist/styles.css';

interface NutritionCircleProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// These values are percentages of daily recommended values
// Carbs: ~130g per day (based on 2000 calorie diet)
// Protein: ~50g per day (varies by weight but common recommendation)
// Fat: ~65g per day (based on 2000 calorie diet)
const calculatePercentages = (carbs: number, protein: number, fat: number) => {
  return {
    carbsPercent: Math.round((carbs / 130) * 100),
    proteinPercent: Math.round((protein / 50) * 100),
    fatPercent: Math.round((fat / 65) * 100)
  };
};

const NutritionCircle: React.FC<NutritionCircleProps> = ({ calories, protein, carbs, fat }) => {
  const { carbsPercent, proteinPercent, fatPercent } = calculatePercentages(carbs, protein, fat);
  
  // Calculate the total macros for proportions in the circle
  const totalGrams = carbs + protein + fat;
  const carbsProportion = carbs / totalGrams;
  const proteinProportion = protein / totalGrams;
  const fatProportion = fat / totalGrams;
  
  // Calculate the stroke dash array and offset for each segment
  const circumference = 2 * Math.PI * 40; // r=40 for the circle
  const carbsLength = circumference * carbsProportion;
  const proteinLength = circumference * proteinProportion;
  const fatLength = circumference * fatProportion;
  
  // Calculate starting positions
  const proteinOffset = circumference - carbsLength;
  const fatOffset = circumference - carbsLength - proteinLength;

  return (
    <div className="flex items-center justify-around w-full">
      <div className="w-24 h-24 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Background circle with gray stroke */}
          <circle cx="50" cy="50" r="40" fill="white" stroke="#e6e6e6" strokeWidth="12" />
          
          {/* Rotated group for the progress segments */}
          <g transform="rotate(-90 50 50)">
            {/* Carbs segment - Teal */}
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="none" 
              stroke="#4DD0E1" 
              strokeWidth="12" 
              strokeDasharray={`${carbsLength} ${circumference - carbsLength}`} 
              strokeDashoffset="0"
            />
            
            {/* Protein segment - Amber */}
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="none" 
              stroke="#FFB74D" 
              strokeWidth="12" 
              strokeDasharray={`${proteinLength} ${circumference - proteinLength}`} 
              strokeDashoffset={proteinOffset}
            />
            
            {/* Fat segment - Purple/Blue */}
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="none" 
              stroke="#5E35B1" 
              strokeWidth="12" 
              strokeDasharray={`${fatLength} ${circumference - fatLength}`} 
              strokeDashoffset={fatOffset}
            />
          </g>
          
          {/* Center circle for text */}
          <circle cx="50" cy="50" r="30" fill="white" />
          
          {/* Calories text - not rotated */}
          <text x="50" y="50" textAnchor="middle" fontSize="16" fontWeight="bold">{calories}</text>
          <text x="50" y="64" textAnchor="middle" fontSize="10">cal</text>
        </svg>
      </div>
      
      <div className="flex justify-between space-x-10">
        <div className="flex flex-col items-center">
          <span className="text-teal-400 font-bold">{carbsPercent}%</span>
          <span className="text-xl font-bold">{carbs} g</span>
          <span className="text-gray-600">Carbs</span>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-indigo-600 font-bold">{fatPercent}%</span>
          <span className="text-xl font-bold">{fat} g</span>
          <span className="text-gray-600">Fat</span>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-amber-500 font-bold">{proteinPercent}%</span>
          <span className="text-xl font-bold">{protein} g</span>
          <span className="text-gray-600">Protein</span>
        </div>
      </div>
    </div>
  );
};

export default NutritionCircle; 