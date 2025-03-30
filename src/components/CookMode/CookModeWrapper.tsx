'use client';

import { InstructionStep } from '@/services/recipes';
import { CookModeButton } from './CookModeButton';

interface CookModeWrapperProps {
  instructions: InstructionStep[];
  recipeTitle: string;
}

export default function CookModeWrapper({ instructions, recipeTitle }: CookModeWrapperProps) {
  return (
    <CookModeButton 
      instructions={instructions} 
      recipeTitle={recipeTitle} 
    />
  );
} 