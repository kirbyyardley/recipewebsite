'use client';

import { NavigationProvider } from '@/lib/contexts/navigation-context';
import { Navigation } from '@/components/Navigation';

export default function NavTestPage() {
  return (
    <NavigationProvider>
      <div className="min-h-screen bg-gray-50 p-4 lg:pl-72">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Navigation Test</h1>
          
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-xl font-bold mb-4">Responsive Navigation Demo</h2>
            <p className="mb-3">
              This page demonstrates a responsive navigation that shows as:
            </p>
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li>Bottom navigation bar on mobile devices</li>
              <li>Side navigation panel on desktop devices (lg breakpoint and above)</li>
            </ul>
            
            <p className="text-gray-600 text-sm mb-6">
              Resize your browser window to see the responsive behavior.
            </p>
            
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="mb-2">Sample content area.</p>
              <p>
                Notice how the content area has a padding on the left side on desktop 
                to accommodate the side navigation (lg:pl-72).
              </p>
            </div>
          </div>
        </div>
        
        <Navigation />
      </div>
    </NavigationProvider>
  );
} 