'use client';

import Image from "next/image";
import Link from "next/link";
import { useRecipes } from '@/hooks/use-recipes';

export default function Home() {
  const { recipes, isLoading, error } = useRecipes();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full max-w-7xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Made Easy Recipes</h1>
        
        {/* Recipe section */}
        <section className="w-full">
          <h2 className="text-2xl font-semibold mb-4">Latest Recipes</h2>
          
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>Failed to load recipes: {error}</p>
            </div>
          )}
          
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <Link key={recipe.id} href={`/recipes/${recipe.slug}`}>
                  <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative h-48 w-full">
                      <Image 
                        src={recipe.image_url || '/next.svg'} 
                        alt={recipe.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                      <p className="text-gray-600 line-clamp-2">{recipe.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {!isLoading && !error && recipes.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No recipes found. Add some recipes to get started!</p>
            </div>
          )}
        </section>
      </main>
      
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
