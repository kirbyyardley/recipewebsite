"use client";
import { useState, useEffect } from "react";
import { Sheet } from "@silk-hq/components";
import "./PageFromBottom.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  presentTrigger?: React.ReactNode;
  sheetContent: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PageFromBottom = ({ 
  presentTrigger, 
  sheetContent, 
  isOpen: controlledIsOpen, 
  onOpenChange,
  ...restProps 
}: Props) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  // Determine if we're in controlled or uncontrolled mode
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  
  // Handle external open state changes
  useEffect(() => {
    if (isControlled && controlledIsOpen !== internalIsOpen) {
      setInternalIsOpen(controlledIsOpen);
    }
  }, [controlledIsOpen, isControlled, internalIsOpen]);
  
  // Handle state changes
  const handleOpenChange = (open: boolean) => {
    if (!isControlled) {
      setInternalIsOpen(open);
    }
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  return (
    <Sheet.Root 
      open={isOpen}
      onOpenChange={handleOpenChange}
      license="commercial" 
      {...restProps}
    >
      {presentTrigger && (
        <Sheet.Trigger>{presentTrigger}</Sheet.Trigger>
      )}
      <Sheet.Portal>
        <Sheet.View
          className="PageFromBottom-view"
          contentPlacement="bottom"
          swipe={false}
          nativeEdgeSwipePrevention={true}
        >
          <Sheet.Backdrop className="PageFromBottom-backdrop" travelAnimation={{ opacity: [0, 0.1] }} />
          <Sheet.Content className="PageFromBottom-content">
            <div className="PageFromBottom-topBar">
              <Sheet.Trigger className="PageFromBottom-dismissTrigger" action="dismiss">
                Close
              </Sheet.Trigger>
            </div>
            {sheetContent}
          </Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  );
};

export { PageFromBottom }; 