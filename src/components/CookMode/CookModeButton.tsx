'use client';

import { useState, useRef, useCallback } from 'react';
import { Sheet, VisuallyHidden, useThemeColorDimmingOverlay } from '@silk-hq/components';
import { InstructionStep } from '@/services/recipes';
import './CookModeButton.css';

interface CookModeButtonProps {
  instructions: InstructionStep[];
  recipeTitle: string;
  imageUrl: string;
}

export function CookModeButton({ instructions, recipeTitle, imageUrl }: CookModeButtonProps) {
  // Debug logging
  console.log('CookModeButton received instructions:', instructions);

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState({ start: 0, end: 0 });
  const [inertOutside, setInertOutside] = useState(false);
  const [activeDetent, setActiveDetent] = useState(2); // Start at detent 2 (expanded)
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);

  // Refs
  const contentRef = useRef<HTMLDivElement>(null);
  const themeColorDimmingControllerRef = useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;
  const backdropRef = useRef<HTMLDivElement>(null);
  const retractedContentRef = useRef<HTMLDivElement>(null);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  // Theme color dimming
  const { setDimmingOverlayOpacity } = useThemeColorDimmingOverlay({
    elementRef: themeColorDimmingControllerRef,
    dimmingColor: "rgb(255, 255, 255)"
  });

  // Handlers
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const rangeChangeHandler = useCallback((newRange: { start: number; end: number }) => {
    setRange(newRange);
    setInertOutside(newRange.start === 2 && newRange.end === 2);
  }, []);

  const travelHandler = useCallback(({ progress, range, progressAtDetents }: { 
    progress: number; 
    range: { start: number; end: number }; 
    progressAtDetents?: number[] 
  }) => {
    if (!progressAtDetents) return;

    // Calculate normalized progress for all animations
    const normalisedProgress = range.end > 1 
      ? (progress - progressAtDetents[1]) / (1 - progressAtDetents[1])
      : progress;

    // Apply all animations simultaneously
    if (retractedContentRef.current) {
      retractedContentRef.current.style.setProperty('opacity', (1 - normalisedProgress).toString());
    }

    setDimmingOverlayOpacity(normalisedProgress);

    if (backdropRef.current) {
      backdropRef.current.style.setProperty('opacity', (normalisedProgress * 0.25).toString());
    }

    if (expandedContentRef.current) {
      expandedContentRef.current.style.setProperty('opacity', normalisedProgress.toString());
    }
  }, [setDimmingOverlayOpacity]);

  const handleManualStep = useCallback(() => {
    // Only proceed if we're at detent 2 (expanded)
    if (activeDetent === 2) {
      setActiveDetent(1); // Step to detent 1 (minimized)
    }
  }, [activeDetent]);

  const toggleStep = (index: number) => {
    setCheckedSteps(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const progressPercentage = (checkedSteps.length / instructions.length) * 100;
  const progressRotation = (checkedSteps.length / instructions.length) * 360;

  // Content components
  const retractedContent = (
    <div className="cook-mode-retracted-content">
      <div className="flex items-center gap-4">
        <div className="cook-mode-recipe-image">
          <img src={imageUrl} alt={recipeTitle} className="w-full h-full object-cover rounded-lg" />
        </div>
        <div className="flex-1">
          <h3 className="text-medium font-bold text-white">{recipeTitle}</h3>
          <p className="text-sm text-white/70">
            {checkedSteps.length} of {instructions.length} steps complete
          </p>
        </div>
        <div 
          className="cook-mode-progress-circle self-center" 
          style={{ '--progress-rotation': `${progressRotation}deg` } as React.CSSProperties}
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );

  const expandedContent = (
    <div className="cook-mode-expanded-content-container">
      <div className="cook-mode-expanded-header">
        <div 
          className="cook-mode-expanded-handle" 
          onClick={handleManualStep}
          role="button"
          tabIndex={0}
          aria-label="Minimize recipe"
          ref={handleRef}
        />
        <Sheet.Trigger 
          className="cook-mode-close-button"
          action="dismiss"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </Sheet.Trigger>
        <h3 className="text-xl font-bold text-white mb-4">{recipeTitle}</h3>
      </div>
      
      <div className="cook-mode-expanded-content">
        <div className="space-y-6">
          {!instructions || !Array.isArray(instructions) ? (
            <div>No instructions available</div>
          ) : (
            instructions.map((instruction, index) => {
              console.log('Rendering instruction:', instruction);
              return (
                <div key={index} className="p-2 rounded-lg shadow-sm cook-mode-step-container">
                  <div className="flex items-start">
                    <div 
                      className={`cook-mode-step-checkbox ${checkedSteps.includes(index) ? 'checked' : ''}`}
                      onClick={() => toggleStep(index)}
                      role="checkbox"
                      aria-checked={checkedSteps.includes(index)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleStep(index);
                        }
                      }}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div className="cook-mode-step-text">
                      
                      {/* Description */}
                      <p className={`text-white ${checkedSteps.includes(index) ? 'completed' : ''}`}>
                        {instruction.description}
                      </p>
                      
                      {/* Tip if available */}
                      {instruction.tip && (
                        <div className="mt-2 text-sm text-white/90">
                          <em>{instruction.tip}</em>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Sheet.Root 
      license="commercial"
      activeDetent={activeDetent}
      onActiveDetentChange={setActiveDetent}
    >
      {range.start === 0 && range.end === 0 && (
        <Sheet.Trigger asChild>
          <button 
            className="cook-mode-fab"
            aria-label="Start cooking"
          >
            <span className="cook-mode-fab-text">Start Cooking</span>
          </button>
        </Sheet.Trigger>
      )}

      <Sheet.Portal>
        <Sheet.View
          className={`cook-mode-view detent2-${range.start === 2 && range.end === 2}`}
          detents="max(env(safe-area-inset-bottom, 0px) + 66px, 76px)"
          swipeOvershoot={false}
          swipeDismissal={false}
          onTravelRangeChange={rangeChangeHandler}
          inertOutside={inertOutside}
          onClickOutside={{ dismiss: range.end !== 1 }}
          onTravel={travelHandler}
          nativeEdgeSwipePrevention={range.end !== 1}
          steppingAnimationSettings={{
            preset: "smooth", // Use the smooth preset for stepping animations
            duration: 400    // Match the duration to swipe animations
          }}
        >
          <div
            className="cook-mode-theme-color-dimming-controller"
            ref={themeColorDimmingControllerRef}
          />
          {range.end > 1 && (
            <Sheet.Backdrop
              className="cook-mode-backdrop"
              travelAnimation={{ opacity: null }}
              ref={backdropRef}
            />
          )}
          <Sheet.Content
            className={`cook-mode-sheet-content detent2-${range.start === 2 && range.end === 2}`}
            ref={contentRef}
          >
            <Sheet.SpecialWrapper.Root>
              <Sheet.SpecialWrapper.Content>
                <VisuallyHidden.Root asChild>
                  <Sheet.Title>Recipe Steps</Sheet.Title>
                </VisuallyHidden.Root>
                <VisuallyHidden.Root asChild>
                  <Sheet.Description>Step by step cooking instructions</Sheet.Description>
                </VisuallyHidden.Root>

                <div className="cook-mode-actual-content">
                  <div
                    className="cook-mode-retracted-content-container"
                    ref={retractedContentRef}
                  >
                    {range.start < 2 && retractedContent}
                  </div>
                  {range.end === 1 && (
                    <Sheet.Trigger
                      className="cook-mode-expand-trigger"
                      action={{
                        type: "step",
                        detent: 2,
                      }}
                    >
                      <VisuallyHidden.Root>Expand</VisuallyHidden.Root>
                    </Sheet.Trigger>
                  )}
                  {range.end > 1 && (
                    <div
                      className="cook-mode-expanded-content-container"
                      ref={expandedContentRef}
                    >
                      {expandedContent}
                    </div>
                  )}
                </div>
              </Sheet.SpecialWrapper.Content>
            </Sheet.SpecialWrapper.Root>
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  );
}

// Also export as default for dynamic import
export default CookModeButton; 