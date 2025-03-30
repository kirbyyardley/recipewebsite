import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { getRecipeBySlug, RecipeWithIngredients } from '@/services/recipes';
import './recipe-page.css'; // Import the CSS file

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const recipe = await getRecipeBySlug(params.slug);
  
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
  const recipe = await getRecipeBySlug(params.slug);
  
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

  // Convert difficulty level number to text
  const getDifficultyText = (level?: number) => {
    if (!level) return 'Unknown';
    const difficultyMap: Record<number, string> = {
      1: 'Easy',
      2: 'Moderate',
      3: 'Hard'
    };
    return difficultyMap[level] || 'Unknown';
  };

  // Get the processed instructions
  const instructions = recipe.processed_instructions || [];

  return (
    <div className="min-h-screen px-4 py-8 max-w-6xl mx-auto">
      <Link href="/" className="inline-block mb-6 text-blue-600 hover:underline">
        ← Back to Recipes
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="relative w-full rounded-lg overflow-hidden" style={{ height: '450px' }}>
            <Image 
              src={recipe.image_url} 
              alt={recipe.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
          <p className="text-gray-700 mb-6">{recipe.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
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
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-gray-500 text-sm">Difficulty</div>
              <div className="font-semibold">{getDifficultyText(recipe.difficulty)}</div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.recipe_ingredients?.map((item) => (
                <li key={item.id} className="flex items-start">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 mt-0.5">
                    {item.optional ? "?" : "✓"}
                  </span>
                  <div>
                    <span className="font-medium">
                      {item.metric_amount}{item.metric_unit} {item.ingredient?.name}
                    </span>
                    {item.notes && (
                      <span className="text-gray-500 text-sm ml-2">({item.notes})</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Instructions</h2>
        {instructions.length > 0 ? (
          <ol className="space-y-6">
            {instructions.map((instruction, index) => (
              <li key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                    {instruction.step || index + 1}
                  </div>
                  <div>
                    {instruction.processed_description ? (
                      <div 
                        className="text-gray-700 instruction-text"
                        dangerouslySetInnerHTML={{ __html: instruction.processed_description }}
                      />
                    ) : (
                      <p className="text-gray-700">{instruction.description}</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-500">No instructions available for this recipe.</p>
        )}
      </div>
    </div>
  );
} 