import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { getRecipeBySlug, RecipeWithIngredients } from '@/services/recipes';
import CookModeWrapper from '@/components/CookMode/CookModeWrapper';
import Header from '@/components/Header/Header';
import './recipe-page.css'; // Import the CSS file
import { NutritionSection } from '@/components/Nutrition';

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params;
  const recipe = await getRecipeBySlug(slug);
  
  if (!recipe) {
    return {
      title: 'Recipe Not Found',
    };
  }

  return {
    title: `${recipe.title} | Made Easy Recipes`,
    description: recipe.description,
    openGraph: {
      images: [recipe.image_url],
    },
  };
}

export default async function RecipePage({ params }: Props) {
  const { slug } = params;
  const recipe = await getRecipeBySlug(slug);
  
  if (!recipe) {
    notFound();
  }

  // Format time from minutes to "X hr Y min" format
  const formatTime = (minutes?: number) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours} hr ${mins > 0 ? `${mins} min` : ''}` : `${mins} min`;
  };

  // Get the processed instructions
  const instructions = recipe.processed_instructions || [];

  return (
    <div className="min-h-screen">
      <Header title={recipe.title} />
      
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative w-full" style={{ aspectRatio: '1/1' }}>
          <Image 
            src={recipe.image_url} 
            alt={recipe.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="px-4 py-4">
          <h1 className="text-xl font-bold mb-2">{recipe.title}</h1>
          <p className="text-gray-700 mb-4">{recipe.description}</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-gray-500 text-sm">Prep Time</div>
              <div className="font-semibold">{formatTime(recipe.prep_time)}</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-gray-500 text-sm">Cook Time</div>
              <div className="font-semibold">{formatTime(recipe.cook_time)}</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-gray-500 text-sm">Servings</div>
              <div className="font-semibold">{recipe.servings || '-'}</div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Ingredients</h2>
            <ul className="space-y-4">
              {recipe.recipe_ingredients?.map((item) => (
                <li key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">
                      {item.optional ? "?" : "✓"}
                    </span>
                    <div>
                      <span className="font-medium">
                        {item.ingredients?.name}
                      </span>
                      {item.notes && (
                        <div className="text-gray-500 text-sm">{item.notes}</div>
                      )}
                    </div>
                  </div>
                  <span className="font-medium text-right">
                    {item.imperial_amount} {item.imperial_unit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="px-4 max-w-6xl mx-auto">
        {/* Cook Mode Button - Client Component */}
        <CookModeWrapper 
          instructions={instructions} 
          recipeTitle={recipe.title}
          imageUrl={recipe.image_url}
        />
        
        {/* Nutrition Information Section */}
        {recipe.nutrition && (
          <NutritionSection 
            calories={Math.round(recipe.nutrition.calories)} 
            protein={Math.round(recipe.nutrition.protein_g)} 
            carbs={Math.round(recipe.nutrition.carbs_g)} 
            fat={Math.round(recipe.nutrition.fat_g)}
            fiber={recipe.nutrition.fiber_g}
            sugar={recipe.nutrition.sugar_g}
            sodium={recipe.nutrition.sodium_mg}
          />
        )}
        
        {/* Extra space at the bottom */}
        <div className="h-24"></div>
      </div>
    </div>
  );
} 