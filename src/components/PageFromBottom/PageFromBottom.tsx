"use client";
import { useState, useEffect } from "react";
import { Sheet } from "@silk-hq/components";
import "./PageFromBottom.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  presentTrigger?: React.ReactNode;
  sheetContent: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDismiss?: () => void;
  onPresent?: () => void;
}

const PageFromBottom = ({ 
  presentTrigger, 
  sheetContent, 
  isOpen: controlledIsOpen, 
  onOpenChange,
  onDismiss,
  onPresent,
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

  // Handle dismiss event
  const handleDismiss = () => {
    handleOpenChange(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  // Handle present event
  const handlePresent = () => {
    handleOpenChange(true);
    if (onPresent) {
      onPresent();
    }
  };

  return (
    <Sheet.Root 
      open={isOpen}
      onDismiss={handleDismiss}
      onPresent={handlePresent}
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