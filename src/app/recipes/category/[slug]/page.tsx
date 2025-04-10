import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getRecipesByCategory } from '@/services/recipes';
import { Recipe } from '@/hooks/use-recipes';
import Header from '@/components/Header/Header';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  // Convert slug to display name (e.g., "quick-easy" to "Quick & Easy")
  const categoryName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace('And', '&');

  return {
    title: `${categoryName} Recipes | Made Easy Recipes`,
    description: `Explore our collection of ${categoryName.toLowerCase()} recipes.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = params;
  // Convert slug to display name
  const categoryName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace('And', '&');

  // This function would need to be implemented in your recipes service
  const recipes = await getRecipesByCategory(slug);

  if (!recipes || recipes.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={`${categoryName} Recipes`} />
      
      <main className="max-w-7xl mx-auto p-4 lg:pl-72">
        <h1 className="text-3xl font-bold mb-6">{categoryName} Recipes</h1>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe: Recipe) => (
            <Link 
              key={recipe.id} 
              href={`/recipes/${recipe.slug}`}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative w-full pt-[100%]">
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
      </main>
    </div>
  );
} 