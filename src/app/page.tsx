import Link from 'next/link';
import Image from 'next/image';
import { Navigation } from '@/components/Navigation';
import { getRecentRecipes } from '@/services/recipes';

export default async function Home() {
  const recipes = await getRecentRecipes(12); // Get 12 most recent recipes

  return (
    <main className="min-h-screen bg-gray-50 p-4 lg:pl-72">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Our Recipes</h1>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <Link 
              key={recipe.id} 
              href={`/recipes/${recipe.slug}`}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative w-full pt-[66.67%]">
                <Image
                  src={recipe.image_url}
                  alt={recipe.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="p-4">
                <h2 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  {recipe.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {recipe.description}
                </p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span className="flex items-center">
                    {recipe.prep_time && (
                      <>
                        <span>Prep: {recipe.prep_time}m</span>
                        <span className="mx-2">•</span>
                      </>
                    )}
                    {recipe.cook_time && (
                      <>
                        <span>Cook: {recipe.cook_time}m</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <Navigation />
    </main>
  );
}
