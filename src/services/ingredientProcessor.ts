import { RecipeIngredient } from './recipes';

/**
 * Creates a mapping of ingredient slugs to their full recipe ingredient data
 * for faster lookups when processing instruction text
 */
export function createIngredientsSlugMap(ingredients: RecipeIngredient[]): Record<string, RecipeIngredient> {
  const slugMap: Record<string, RecipeIngredient> = {};
  
  ingredients.forEach(item => {
    if (item.ingredients) {
      const ingredient = item.ingredients;
      const name = ingredient.name;
      // Generate a slug if not available
      const slug = ingredient.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      
      slugMap[slug] = item;
    }
  });
  
  return slugMap;
}

/**
 * Process instruction text to replace {{ingredient:slug}} placeholders with
 * formatted HTML for displaying ingredients with measurements
 */
export function processInstructionText(
  text: string, 
  ingredientsMap: Record<string, RecipeIngredient>,
  options = { useImperial: true }
): string {
  // Look for ingredient references in the format {{ingredient:slug}}
  const ingredientMatches = text.match(/\{\{ingredient:([a-z0-9_-]+)\}\}/g);
  
  if (!ingredientMatches) return text;
  
  let processedText = text;
  
  ingredientMatches.forEach(match => {
    // Extract the slug (remove {{ingredient: and }})
    const slug = match.substring(13, match.length - 2);
    
    // Find the ingredient by slug
    const ingredient = ingredientsMap[slug];
    
    if (ingredient) {
      // Get name and measurement info
      const name = ingredient.ingredients?.name || '';
      
      // Use imperial or metric measurements based on options
      const amount = options.useImperial
        ? `${ingredient.imperial_amount} ${ingredient.imperial_unit || ''}`
        : `${ingredient.metric_amount} ${ingredient.metric_unit || ''}`;
      
      // Create the replacement HTML
      const replacement = amount.trim()
        ? `<span class="ingredient">${amount.trim()} ${name}</span>`
        : `<span class="ingredient">${name}</span>`;
      
      // Replace in the text
      processedText = processedText.replace(match, replacement);
    } else {
      // Fallback to just showing the slug in a readable format
      const readableSlug = slug.replace(/_/g, ' ');
      processedText = processedText.replace(match, `<span class="ingredient">${readableSlug}</span>`);
    }
  });
  
  return processedText;
} 