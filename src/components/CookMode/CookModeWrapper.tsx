'use client';

import { InstructionStep } from '@/services/recipes';
import { CookModeButton } from './CookModeButton';

interface CookModeWrapperProps {
  instructions: InstructionStep[];
  recipeTitle: string;
  imageUrl: string;
}

export default function CookModeWrapper({ instructions, recipeTitle, imageUrl }: CookModeWrapperProps) {
  return (
    <CookModeButton 
      instructions={instructions} 
      recipeTitle={recipeTitle}
      imageUrl={imageUrl}
    />
  );
} 