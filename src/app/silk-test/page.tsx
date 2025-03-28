'use client';

import { BottomSheet } from '@/components/BottomSheet';

export default function SilkTestPage() {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Silk Components Test</h1>
      <div className="space-y-4">
        <p className="text-gray-600">
          Click the button below to test the BottomSheet component:
        </p>
        <BottomSheet />
      </div>
    </main>
  );
} 