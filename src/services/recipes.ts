import { createClient } from '@supabase/supabase-js';
import { Recipe } from '@/hooks/use-recipes';

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  try {
    const { data, error } = await supabase
      .from('recipe')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching recipe:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error fetching recipe:', err);
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