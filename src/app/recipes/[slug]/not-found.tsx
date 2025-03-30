import Link from 'next/link';

export default function RecipeNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Recipe Not Found</h1>
      <p className="text-gray-600 mb-8">We couldn't find the recipe you're looking for.</p>
      <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Return to Home
      </Link>
    </div>
  );
} 