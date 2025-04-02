'use client';

import { useState } from 'react';
// Remove PageFromBottom import
// import { PageFromBottom } from '@/components/PageFromBottom'; 
// Import the core Sheet component from Silk
import { Sheet } from '@silk-hq/components'; 
import { InstructionStep } from '@/services/recipes';
import './CookModeButton.css';

interface CookModeButtonProps {
  instructions: InstructionStep[];
  recipeTitle: string;
}

export function CookModeButton({ instructions, recipeTitle }: CookModeButtonProps) {
  // We might not need explicit isOpen state if Sheet.Trigger handles it,
  // but let's keep it for now in case we need it later for hiding the button.
  const [isOpen, setIsOpen] = useState(false); 

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open); // Keep updating state if sheet provides updates
  };

  // Content for the Sheet component remains the same
  const cookModeContent = (
    <div className="cook-mode-content">
      <h2 className="text-2xl font-bold mb-6">{recipeTitle}</h2>
      <div className="space-y-6">
        {instructions.map((instruction, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-start">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                {instruction.step || index + 1}
              </div>
              <div>
                {instruction.processed_description ? (
                  <div 
                    className="text-gray-700 instruction-text"
                    dangerouslySetInnerHTML={{ __html: instruction.processed_description }}
                  />
                ) : (
                  <p className="text-gray-700">{instruction.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    // Use Sheet.Root to contain the trigger and portal
    <Sheet.Root license="commercial"> 
      {/* Wrap the FAB with Sheet.Trigger */}
      <Sheet.Trigger asChild>
        <button 
          className="cook-mode-fab"
          aria-label="Start cooking"
        >
          <span className="cook-mode-fab-icon">👨‍🍳</span>
          <span className="cook-mode-fab-text">Start Cooking</span>
        </button>
      </Sheet.Trigger>

      {/* Basic Silk Sheet implementation */} 
      <Sheet.Portal>
        {/* Temporarily remove Sheet.Backdrop for debugging */}
        {/* <Sheet.Backdrop /> */}
        <Sheet.View>
          <Sheet.Content>
             <Sheet.Handle />
            {cookModeContent} 
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  );
}

// Also export as default for dynamic import
export default CookModeButton; 