'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  isBottomNavHidden: boolean;
  setBottomNavHidden: (hidden: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isBottomNavHidden, setBottomNavHidden] = useState(false);

  return (
    <NavigationContext.Provider value={{ isBottomNavHidden, setBottomNavHidden }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
} 