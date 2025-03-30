import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Define the Recipe type
export type Recipe = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at?: string;
  slug: string;
  prep_time?: number;
  cook_time?: number;
  servings?: number;
  difficulty?: number;
  instructions?: any;
  primary_cuisine?: any;
};

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('recipe')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) {
          throw new Error(error.message);
        }

        setRecipes(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching recipes:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  return { recipes, isLoading, error };
} 