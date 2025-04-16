import { createClient } from '@supabase/supabase-js';
import { Recipe } from '@/hooks/use-recipes';
import { createIngredientsSlugMap, processInstructionText } from './ingredientProcessor';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Interface for ingredient data
export interface Ingredient {
  id: string;
  name: string;
  slug?: string;
}

// Interface for nutrition information
export interface NutritionInfo {
  id: string;
  recipe_id: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
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
  timer?: number;     // Optional timer in seconds
  tip?: string;       // Optional cooking tip
  optional?: boolean; // Whether the step is optional
}

// Interface for structured instruction step
export interface StructuredInstructionStep {
  step: number;
  description: string;
  timer?: number;      // Optional timer in seconds
  tip?: string;        // Optional cooking tip
  optional?: boolean;  // Whether the step is optional
}

// Enhanced recipe with ingredients
export interface RecipeWithIngredients extends Recipe {
  recipe_ingredients?: RecipeIngredient[];
  processed_instructions?: InstructionStep[];
  structured_instructions?: StructuredInstructionStep[];
  nutrition?: NutritionInfo | null;
}

// Interface for category data
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export async function getRecipeBySlug(slug: string): Promise<RecipeWithIngredients | null> {
  try {
    // Fetch the recipe with structured_instructions
    const { data: recipe, error } = await supabase
      .from('recipe')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !recipe) {
      console.error('Error fetching recipe:', error);
      return null;
    }

    // Fetch the recipe ingredients with ingredient details including slug
    const { data: recipeIngredients, error: ingredientsError } = await supabase
      .from('recipe_ingredients')
      .select(`
        *,
        ingredients:ingredient_id (id, name, slug)
      `)
      .eq('recipe_id', recipe.id);

    if (ingredientsError) {
      console.error('Error fetching recipe ingredients:', ingredientsError);
      // Continue with the recipe even if ingredients failed to load
    }

    // Fetch nutrition information
    const { data: nutritionData, error: nutritionError } = await supabase
      .from('recipe_nutrition')
      .select('*')
      .eq('recipe_id', recipe.id)
      .maybeSingle();
    
    if (nutritionError) {
      console.error('Error fetching nutrition data:', nutritionError);
      // Continue with the recipe even if nutrition failed to load
    }

    // Create a map of ingredients by slug for new format
    const ingredientsBySlug = createIngredientsSlugMap(recipeIngredients || []);
    
    // Format ingredients for easy lookup (for legacy format)
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
    
    // Check if we have structured instructions in the new format
    if (recipe.structured_instructions && Array.isArray(recipe.structured_instructions)) {
      console.log('Processing structured instructions');
      
      processedInstructions = recipe.structured_instructions.map((instruction: StructuredInstructionStep) => {
        // Process the instruction text to replace ingredient references
        const processedDescription = processInstructionText(
          instruction.description, 
          ingredientsBySlug,
          { useImperial: true }
        );
        
        return {
          step: instruction.step,
          description: instruction.description,
          processed_description: processedDescription,
          // Add any additional properties
          timer: instruction.timer,
          tip: instruction.tip,
          optional: instruction.optional
        };
      });
    }
    // Fall back to legacy format if needed
    else if (recipe.instructions && Array.isArray(recipe.instructions)) {
      console.log('Falling back to legacy instruction format');
      
      processedInstructions = recipe.instructions.map((instruction: InstructionStep) => {
        if (!instruction.description) return instruction;

        // Create a processed version of the description
        let processedDescription = instruction.description;
        
        // Look for ingredient references in the format [ING:id_prefix]
        const ingredientMatches = processedDescription.match(/\[ING:([a-z0-9]+)\]/g);
        
        if (ingredientMatches && ingredientMatches.length > 0) {
          ingredientMatches.forEach((match: string) => {
            // Extract the ID prefix
            const idPrefix = match.substring(5, match.length - 1);
            
            // Try case-insensitive match or partial match if exact match fails
            let fullIngredientId = Object.keys(ingredientsMap).find(id => 
              id.toLowerCase().includes(idPrefix.toLowerCase())
            );
            
            // If not found, try to match against common ingredients by name
            let commonIngredientName = '';
            if (!fullIngredientId) {
              // Create fallback map for common ingredients
              const commonIngredientsMap: Record<string, string> = {
                '99614736': 'salt',
                '798441ac': 'black pepper',
                'eb95535e': 'all-purpose flour',
                'd0b22b46': 'paprika',
                '665694da': 'sweet potatoes',
                '903f9542': 'chicken broth',
                'c30340c0': 'Greek yogurt',
                '907046e0': 'lemon juice'
              };
              
              commonIngredientName = commonIngredientsMap[idPrefix] || '';
              
              // If we have a name match, look for matching ingredient ID by name
              if (commonIngredientName) {
                fullIngredientId = Object.keys(ingredientsMap).find(id => {
                  const ing = ingredientsMap[id];
                  const name = ing.ingredient?.name || ing.ingredients?.name || '';
                  return name.toLowerCase().includes(commonIngredientName.toLowerCase());
                });
              }
            }
            
            // If found, replace the reference with the ingredient name and amount
            if (fullIngredientId && ingredientsMap[fullIngredientId]) {
              const ing = ingredientsMap[fullIngredientId];
              // Try to get name from either ingredient or ingredients property
              const ingName = ing.ingredient?.name || ing.ingredients?.name || 'unknown ingredient';
              const amount = ing.imperial_amount ? `${ing.imperial_amount} ${ing.imperial_unit || ''}` : '';
              
              const replacement = amount 
                ? `<span class="ingredient">${amount} ${ingName}</span>` 
                : `<span class="ingredient">${ingName}</span>`;
              
              processedDescription = processedDescription.replace(match, replacement);
            } else if (commonIngredientName) {
              // Use the common ingredient name if we have it
              processedDescription = processedDescription.replace(match, `<span class="ingredient">${commonIngredientName}</span>`);
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
      processed_instructions: processedInstructions,
      nutrition: nutritionData || null
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

export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
}

export async function getRecipesByCategory(categorySlug: string): Promise<Recipe[]> {
  try {
    // First, get the category ID from the slug
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();

    if (categoryError || !category) {
      console.error('Error fetching category:', categoryError);
      return [];
    }

    // Then get all recipe IDs in this category using the junction table
    const { data: recipeCategories, error: recipeCategoriesError } = await supabase
      .from('recipe_categories')
      .select('recipe_id')
      .eq('category_id', category.id);

    if (recipeCategoriesError) {
      console.error('Error fetching recipe categories:', recipeCategoriesError);
      return [];
    }

    // If no recipes found in this category
    if (!recipeCategories || recipeCategories.length === 0) {
      return [];
    }

    // Extract recipe IDs
    const recipeIds = recipeCategories.map(rc => rc.recipe_id);

    // Finally, fetch the actual recipes
    const { data: recipes, error: recipesError } = await supabase
      .from('recipe')
      .select('*')
      .in('id', recipeIds)
      .order('created_at', { ascending: false });

    if (recipesError) {
      console.error('Error fetching recipes by category:', recipesError);
      return [];
    }

    return recipes || [];
  } catch (err) {
    console.error('Error fetching recipes by category:', err);
    return [];
  }
} 