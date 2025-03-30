import { createClient } from '@supabase/supabase-js';
import { Recipe } from '@/hooks/use-recipes';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Interface for ingredient data
export interface Ingredient {
  id: string;
  name: string;
}

// Interface for recipe ingredient with quantities
export interface RecipeIngredient {
  id: string;
  ingredient_id: string;
  metric_amount: string;
  metric_unit: string;
  imperial_amount: string;
  imperial_unit: string;
  notes: string | null;
  optional: boolean;
  ingredient?: Ingredient; // Joined from ingredients table
  ingredients?: any; // From Supabase join
}

// Interface for instruction step
export interface InstructionStep {
  step: number;
  description: string;
  ingredient_references?: string[];
  processed_description?: string;
}

// Enhanced recipe with ingredients
export interface RecipeWithIngredients extends Recipe {
  recipe_ingredients?: RecipeIngredient[];
  processed_instructions?: InstructionStep[];
}

export async function getRecipeBySlug(slug: string): Promise<RecipeWithIngredients | null> {
  try {
    // Fetch the recipe
    const { data: recipe, error } = await supabase
      .from('recipe')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !recipe) {
      console.error('Error fetching recipe:', error);
      return null;
    }

    // Fetch the recipe ingredients with ingredient details
    const { data: recipeIngredients, error: ingredientsError } = await supabase
      .from('recipe_ingredients')
      .select(`
        *,
        ingredients:ingredient_id (id, name)
      `)
      .eq('recipe_id', recipe.id);

    if (ingredientsError) {
      console.error('Error fetching recipe ingredients:', ingredientsError);
      // Continue with the recipe even if ingredients failed to load
    }

    // Format ingredients for easy lookup
    const ingredientsMap: Record<string, RecipeIngredient> = {};
    recipeIngredients?.forEach(item => {
      if (item.ingredients) {
        // Extract the ingredient from the nested join
        const ingredient = item.ingredients as unknown as Ingredient;
        
        // Store in the map with ID as key
        ingredientsMap[item.ingredient_id] = {
          ...item,
          ingredient: ingredient
        };
      }
    });

    // Process instructions to replace ingredient references
    let processedInstructions: InstructionStep[] = [];
    if (recipe.instructions && Array.isArray(recipe.instructions)) {
      processedInstructions = recipe.instructions.map((instruction: InstructionStep) => {
        if (!instruction.description) return instruction;

        // Create a processed version of the description
        let processedDescription = instruction.description;
        
        // Look for ingredient references in the format [ING:id_prefix]
        const ingredientMatches = processedDescription.match(/\[ING:([a-z0-9]+)\]/g);
        
        if (ingredientMatches) {
          ingredientMatches.forEach((match: string) => {
            // Extract the ID prefix
            const idPrefix = match.substring(5, match.length - 1);
            
            // Find the full ingredient ID that starts with this prefix
            const fullIngredientId = Object.keys(ingredientsMap).find(id => 
              id.startsWith(idPrefix)
            );
            
            // If found, replace the reference with the ingredient name and amount
            if (fullIngredientId && ingredientsMap[fullIngredientId]) {
              const ing = ingredientsMap[fullIngredientId];
              const ingName = ing.ingredient?.name || 'unknown ingredient';
              const amount = ing.metric_amount ? `${ing.metric_amount}${ing.metric_unit || ''}` : '';
              
              const replacement = amount 
                ? `<span class="ingredient">${amount} ${ingName}</span>` 
                : `<span class="ingredient">${ingName}</span>`;
              
              processedDescription = processedDescription.replace(match, replacement);
            } else {
              // If not found, just remove the reference brackets
              processedDescription = processedDescription.replace(match, `unknown ingredient`);
            }
          });
        }

        return {
          ...instruction,
          processed_description: processedDescription
        };
      });
    }

    return {
      ...recipe,
      recipe_ingredients: recipeIngredients || [],
      processed_instructions: processedInstructions
    };
  } catch (err) {
    console.error('Error fetching recipe with details:', err);
    return null;
  }
}

export async function getRecentRecipes(limit = 4): Promise<Recipe[]> {
  try {
    const { data, error } = await supabase
      .from('recipe')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recipes:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching recipes:', err);
    return [];
  }
} 