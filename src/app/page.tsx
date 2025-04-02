import Link from 'next/link';
import { Navigation } from '@/components/Navigation';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 lg:pl-72">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Recipe Website</h1>
        
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4">Welcome to Recipe Website</h2>
          <p className="mb-6">
            Your go-to place for delicious recipes and cooking inspiration.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/recipes" className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
              <h3 className="font-bold mb-2">Browse Recipes</h3>
              <p className="text-sm text-gray-600">Explore our collection of tasty recipes</p>
            </Link>
            
            <Link href="/nav-test" className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition">
              <h3 className="font-bold mb-2">Navigation Test</h3>
              <p className="text-sm text-gray-600">Test our responsive navigation component</p>
            </Link>
            
            <Link href="/silk-test" className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
              <h3 className="font-bold mb-2">Silk Components Test</h3>
              <p className="text-sm text-gray-600">Test the Silk UI components</p>
            </Link>
          </div>
        </div>
      </div>
      
      <Navigation />
    </main>
  );
}
