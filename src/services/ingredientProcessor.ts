import { RecipeIngredient } from './recipes';
import { generateIngredientHTML, FractionFormatOptions, formatFraction } from '@/lib/fractionUtils';

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

interface ProcessInstructionOptions {
  useImperial?: boolean;
  formatOptions?: FractionFormatOptions;
}

/**
 * Process decimal numbers in text to use fraction formatting
 */
function processDecimalNumbers(text: string, formatOptions: FractionFormatOptions = {}): string {
  // Match decimal numbers followed by units
  // e.g., "2.5 cups", "0.75 teaspoon", "0.5 tablespoon"
  const decimalPattern = /(\d+\.\d+)\s+(cup|cups|teaspoon|teaspoons|tablespoon|tablespoons|tsp|tbsp|g|gram|grams|ml|oz|ounce|ounces|pound|pounds|lb|lbs)/g;
  
  return text.replace(decimalPattern, (match, number, unit) => {
    const formattedNumber = formatFraction(parseFloat(number), formatOptions);
    return `${formattedNumber} ${unit}`;
  });
}

/**
 * Process instruction text to replace both ingredient references and decimal numbers
 * with properly formatted measurements
 */
export function processInstructionText(
  text: string, 
  ingredientsMap: Record<string, RecipeIngredient>,
  options: ProcessInstructionOptions = { useImperial: true }
): string {
  const { useImperial = true, formatOptions = {} } = options;
  
  // First process ingredient references
  let processedText = text;
  const ingredientMatches = text.match(/\{\{ingredient:([a-z0-9_-]+)\}\}/g);
  
  if (ingredientMatches) {
    ingredientMatches.forEach(match => {
      const slug = match.substring(13, match.length - 2);
      const ingredient = ingredientsMap[slug];
      
      if (ingredient) {
        const name = ingredient.ingredients?.name || '';
        const replacement = generateIngredientHTML(
          ingredient.imperial_amount,
          ingredient.imperial_unit || '',
          ingredient.metric_amount,
          ingredient.metric_unit || '',
          name,
          useImperial,
          formatOptions
        );
        processedText = processedText.replace(match, replacement);
      } else {
        const readableSlug = slug.replace(/_/g, ' ');
        processedText = processedText.replace(match, `<span class="ingredient">${readableSlug}</span>`);
      }
    });
  }
  
  // Then process any remaining decimal numbers
  return processDecimalNumbers(processedText, formatOptions);
} 