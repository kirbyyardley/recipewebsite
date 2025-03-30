'use client';

import { useState, useEffect } from 'react';
import { Sheet } from '@silk-hq/components';
import Image from 'next/image';
import './PersistentSheet.css';

interface PersistentSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  albumCover?: string;
  title?: string;
  artist?: string;
  fullContent?: React.ReactNode;
  trigger?: React.ReactNode;
}

const PersistentSheet = ({
  albumCover = '/placeholder-album.jpg',
  title = 'Barcelona Dreams',
  artist = 'Eira Voss',
  fullContent,
  trigger,
  ...restProps
}: PersistentSheetProps) => {
  // State for controlling detent positions
  const [activeDetent, setActiveDetent] = useState<number>(0);
  const [presented, setPresented] = useState<boolean>(false);

  // Handle detent changes
  const handleActiveDetentChange = (detent: number) => {
    setActiveDetent(detent);
  };

  // Handle open state changes
  const handlePresentedChange = (open: boolean) => {
    setPresented(open);
  };

  // Handle manual trigger click
  const handleTriggerClick = () => {
    setPresented(true);
  };

  // Expand to full detent
  const handleExpand = () => {
    setActiveDetent(1);
  };

  // Retract to mini player
  const handleRetract = () => {
    setActiveDetent(0);
  };

  const defaultTrigger = (
    <div 
      className="PersistentSheet-trigger inline-block cursor-pointer"
      onClick={handleTriggerClick}
    >
      Open Persistent Sheet with Detent
    </div>
  );

  // Wrap the custom trigger with onClick handler if provided
  const wrappedTrigger = trigger ? (
    <div onClick={handleTriggerClick}>{trigger}</div>
  ) : defaultTrigger;

  return (
    <Sheet.Root 
      license="commercial" 
      presented={presented}
      onPresentedChange={handlePresentedChange}
      activeDetent={activeDetent}
      onActiveDetentChange={handleActiveDetentChange}
      sheetRole=""
      {...restProps}
    >
      <Sheet.Trigger asChild>
        {wrappedTrigger}
      </Sheet.Trigger>
      <Sheet.Portal>
        <Sheet.View
          className="PersistentSheet-view"
          contentPlacement="bottom"
          detents={['72px', '100%']} // Define detent positions
          swipe={true}
          nativeEdgeSwipePrevention={true}
          onClickOutside={{
            dismiss: false,
            stopOverlayPropagation: false,
          }}
          onEscapeKeyDown={{
            dismiss: false,
            stopOverlayPropagation: false,
          }}
        >
          <Sheet.Backdrop 
            className="PersistentSheet-backdrop" 
            onClick={(e) => e.preventDefault()}
          />
          <Sheet.Content className="PersistentSheet-content">
            <div className="PersistentSheet-actualContent">
              {/* Mini player at bottom detent */}
              <div 
                className="PersistentSheet-retractedContentContainer cursor-pointer" 
                onClick={handleExpand}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleExpand()}
              >
                <div className="ExamplePersistentSheet-retractedRoot">
                  <Image 
                    src={albumCover}
                    alt="Album cover"
                    width={156}
                    height={156}
                    className="ExamplePersistentSheet-retractedPicture"
                  />
                  <div className="ExamplePersistentSheet-retractedTextContent">
                    <div className="ExamplePersistentSheet-retractedTitle">{title}</div>
                    <div className="ExamplePersistentSheet-retractedSubtitle">
                      {artist}
                      <span className="ml-2 text-xs text-gray-400">(Tap to expand)</span>
                    </div>
                  </div>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    className="ExamplePersistentSheet-retractedPlayButton"
                  >
                    <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" />
                  </svg>
                </div>
              </div>
              
              {/* Full content - visible in second detent */}
              {fullContent && activeDetent === 1 && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <div 
                      className="text-gray-500 hover:text-gray-700 cursor-pointer"
                      onClick={handleRetract}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleRetract()}
                    >
                      Minimize
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <Image 
                        src={albumCover}
                        alt="Album cover"
                        width={120}
                        height={120}
                        className="rounded-lg object-cover mr-4"
                      />
                      <div>
                        <h3 className="text-xl font-semibold">{title}</h3>
                        <p className="text-gray-600">{artist}</p>
                      </div>
                    </div>
                  </div>
                  
                  {fullContent}
                </div>
              )}
            </div>
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  );
};

export { PersistentSheet }; 