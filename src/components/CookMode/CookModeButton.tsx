'use client';

import { useState } from 'react';
import { PageFromBottom } from '@/components/PageFromBottom';
import { InstructionStep } from '@/services/recipes';
import './CookModeButton.css';

interface CookModeButtonProps {
  instructions: InstructionStep[];
  recipeTitle: string;
}

export function CookModeButton({ instructions, recipeTitle }: CookModeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Event handlers
  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  // Content for the PageFromBottom component
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
    <>
      {/* Only show the button when cook mode is not open */}
      {!isOpen && (
        <button 
          className="cook-mode-fab"
          onClick={handleOpen}
          aria-label="Start cooking"
        >
          <span className="cook-mode-fab-icon">👨‍🍳</span>
          <span className="cook-mode-fab-text">Start Cooking</span>
        </button>
      )}

      <PageFromBottom
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        sheetContent={cookModeContent}
      />
    </>
  );
}

// Also export as default for dynamic import
export default CookModeButton; 