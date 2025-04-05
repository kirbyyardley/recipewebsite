'use client';

import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import { IoHeartOutline } from 'react-icons/io5';
import { useScrollDirection } from '@/hooks/useScrollDirection';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const router = useRouter();
  const isVisible = useScrollDirection();

  return (
    <header 
      className={`
        sticky top-0 z-20 bg-white border-b border-gray-200
        transform transition-transform duration-300
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
      `}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <IoArrowBack className="w-6 h-6" />
        </button>
        
        <h1 className="text-medium font-semibold absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center max-w-[60%] line-clamp-2">
          {title}
        </h1>
        
        <button
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Like recipe"
        >
          <IoHeartOutline className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
} 