'use client';

import { BottomSheet } from '@/components/BottomSheet';
import { PageFromBottom } from '@/components/PageFromBottom';
import { PersistentSheet } from '@/components/PersistentSheet';
// import { TopSheet } from '@/components/TopSheet'; // Removed

export default function SilkTestPage() {
  // Sample content for the full expanded view
  const fullContent = (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-gray-600">
          Barcelona Dreams is a soothing ambient track that captures the essence of a Mediterranean sunset.
          Perfect for relaxation and mindfulness.
        </p>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold mb-2">Track List</h3>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">1. Mediterranean Dawn</p>
            <p className="text-gray-500 text-sm">Eira Voss</p>
          </div>
          <p className="text-gray-500">3:42</p>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">2. Barcelona Dreams</p>
            <p className="text-gray-500 text-sm">Eira Voss</p>
          </div>
          <p className="text-gray-500">4:17</p>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">3. Coastal Memories</p>
            <p className="text-gray-500 text-sm">Eira Voss</p>
          </div>
          <p className="text-gray-500">3:58</p>
        </div>
      </div>
    </div>
  );

  // Custom trigger for the persistent sheet
  const customTrigger = (
    <div className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors inline-block cursor-pointer text-center">
      Open Music Player with Detent
    </div>
  );

  return (
    <main className="min-h-screen p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">Silk Components Test</h1>
      <div className="space-y-8">
        <p className="text-gray-600">
          The following components demonstrate different Silk UI patterns:
        </p>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Standard Bottom Sheet</h2>
            <p className="text-gray-600 mb-2">A standard bottom sheet that appears from the bottom of the screen</p>
            <BottomSheet />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Page From Bottom</h2>
            <p className="text-gray-600 mb-2">A full-page sheet that slides up from the bottom</p>
            <PageFromBottom 
              sheetContent={<div className="p-4">Test content for the sheet</div>}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Persistent Sheet With Detent</h2>
            <p className="text-gray-600 mb-2">A sheet with multiple detent positions that can be expanded or minimized</p>
            <p className="text-sm text-gray-500 mb-4">Click the button below to open a sheet with a mini-player that can be expanded</p>
            
            <PersistentSheet 
              albumCover="/placeholder-album.jpg"
              fullContent={fullContent}
              trigger={customTrigger}
            />
          </div>
        </div>
      </div>
    </main>
  );
} 