import Link from 'next/link';
import Header from '@/components/Header/Header';

export default function CategoryNotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Category Not Found" />
      
      <div className="max-w-7xl mx-auto p-4 lg:pl-72 text-center">
        <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
        <p className="mb-6">Sorry, we couldn't find any recipes in this category.</p>
        <Link href="/" className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
          Return to Home
        </Link>
      </div>
    </div>
  );
} 