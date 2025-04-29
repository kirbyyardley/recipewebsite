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
  step_number: number;
  description: string;
  timer?: number;     // Optional timer in seconds
  tip?: string;       // Optional cooking tip
  ingredients?: {
    name: string;
    unit?: string | null;
    amount?: number | null;
    preparation?: string | null;
  }[];
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
    
    // Check if we have instructions in the new format (nested under steps)
    if (recipe.instructions?.steps && Array.isArray(recipe.instructions.steps)) {
      console.log('Processing instructions from steps array');
      processedInstructions = recipe.instructions.steps.map((step: InstructionStep) => ({
        ...step,
        description: processInstructionText(step.description, ingredientsBySlug, {
          useImperial: true,
          formatOptions: {
            mixedNumber: true,
            unicode: true
          }
        })
      }));
    }
    // Check if we have structured instructions in the old format
    else if (recipe.structured_instructions && Array.isArray(recipe.structured_instructions)) {
      console.log('Processing structured instructions');
      
      processedInstructions = recipe.structured_instructions.map((instruction: StructuredInstructionStep) => {
        return {
          step_number: instruction.step,
          description: processInstructionText(instruction.description, ingredientsBySlug, {
            useImperial: true,
            formatOptions: {
              mixedNumber: true,
              unicode: true
            }
          }),
          timer: instruction.timer,
          tip: instruction.tip,
          ingredients: []
        };
      });
    }
    // Fall back to legacy format if needed
    else if (recipe.instructions && Array.isArray(recipe.instructions)) {
      console.log('Falling back to legacy instruction format');
      
      processedInstructions = recipe.instructions.map((instruction: InstructionStep) => {
        if (!instruction.description) return instruction;
        return {
          ...instruction,
          description: processInstructionText(instruction.description, ingredientsBySlug, {
            useImperial: true,
            formatOptions: {
              mixedNumber: true,
              unicode: true
            }
          }),
          ingredients: []
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