'use client';

import { useState, useRef, useCallback } from 'react';
import { Sheet, VisuallyHidden, useThemeColorDimmingOverlay } from '@silk-hq/components';
import { InstructionStep } from '@/services/recipes';
import './CookModeButton.css';

interface CookModeButtonProps {
  instructions: InstructionStep[];
  recipeTitle: string;
}

export function CookModeButton({ instructions, recipeTitle }: CookModeButtonProps) {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState({ start: 0, end: 0 });
  const [inertOutside, setInertOutside] = useState(false);

  // Refs
  const contentRef = useRef<HTMLDivElement>(null);
  const themeColorDimmingControllerRef = useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;
  const backdropRef = useRef<HTMLDivElement>(null);
  const retractedContentRef = useRef<HTMLDivElement>(null);
  const expandedContentRef = useRef<HTMLDivElement>(null);

  // Theme color dimming
  const { setDimmingOverlayOpacity } = useThemeColorDimmingOverlay({
    elementRef: themeColorDimmingControllerRef,
    dimmingColor: "rgb(255, 255, 255)",
    fallbackColor: "rgb(255, 255, 255)"
  });

  // Handlers
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const rangeChangeHandler = useCallback((newRange: { start: number; end: number }) => {
    setRange((prevRange) => {
      const goingFromDetent1ToDetent2 = prevRange.start === 1 && prevRange.end === 1 && newRange.end === 2;
      const onDetent2 = newRange.start === 2 && newRange.end === 2;

      setInertOutside(goingFromDetent1ToDetent2 || onDetent2);

      return newRange;
    });
  }, []);

  const travelHandler = useCallback(({ progress, range, progressAtDetents }: { 
    progress: number; 
    range: { start: number; end: number }; 
    progressAtDetents?: number[] 
  }) => {
    if (!progressAtDetents) return;

    if (range.end > 1) {
      const normalisedProgress = (progress - progressAtDetents[1]) / (1 - progressAtDetents[1]);

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
    }
  }, [setDimmingOverlayOpacity]);

  // Content components
  const retractedContent = (
    <div className="cook-mode-retracted-content">
      <h2 className="text-xl font-bold">{recipeTitle}</h2>
      <p className="text-gray-600">Pull up to view recipe steps</p>
    </div>
  );

  const expandedContent = (
    <div className="cook-mode-expanded-content">
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
    <Sheet.Root license="commercial">
      <Sheet.Trigger asChild>
        <button 
          className="cook-mode-fab"
          aria-label="Start cooking"
        >
          <span className="cook-mode-fab-icon">👨‍🍳</span>
          <span className="cook-mode-fab-text">Start Cooking</span>
        </button>
      </Sheet.Trigger>

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