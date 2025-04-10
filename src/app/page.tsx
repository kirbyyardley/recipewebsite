import Link from 'next/link';
import Image from 'next/image';
import { Navigation } from '@/components/Navigation';
import { RecipeCategoryCarousel } from '@/components/RecipeCategoryCarousel';
import { getRecentRecipes } from '@/services/recipes';

export default async function Home() {
  const recipes = await getRecentRecipes(12); // Get 12 most recent recipes

  return (
    <main className="min-h-screen bg-gray-50 p-4 lg:pl-72">
      <div className="max-w-7xl mx-auto">
        <RecipeCategoryCarousel />
        
        <h1 className="text-2xl font-semibold mb-4">Featured Recipes</h1>
        
        <div className="featured-recipes-carousel overflow-x-auto scrollbar-hide mb-8">
          <div className="flex space-x-4 py-2 w-full">
            {recipes.map((recipe) => (
              <Link 
                key={recipe.id} 
                href={`/recipes/${recipe.slug}`}
                className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow min-w-[220px] md:min-w-[250px] w-[220px] md:w-[250px] flex-shrink-0 flex flex-col"
              >
                <div className="relative w-full" style={{ height: "165px" }}>
                  <Image
                    src={recipe.image_url}
                    alt={recipe.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <h2 className="font-bold text-base mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {recipe.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-2 flex-1">
                    {recipe.description}
                  </p>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
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
      </div>
      
      <Navigation />
    </main>
  );
}
