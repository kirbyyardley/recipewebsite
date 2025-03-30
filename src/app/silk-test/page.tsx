'use client';

import { BottomSheet } from '@/components/BottomSheet';
import { PageFromBottom } from '@/components/PageFromBottom';
// import { TopSheet } from '@/components/TopSheet'; // Removed

export default function SilkTestPage() {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Silk Components Test</h1>
      <div className="space-y-4">
        <p className="text-gray-600">
          Click the buttons below to test the Silk components:
        </p>
        <div className="space-x-4">
          <BottomSheet />
          <PageFromBottom />
        </div>
      </div>
    </main>
  );
} 