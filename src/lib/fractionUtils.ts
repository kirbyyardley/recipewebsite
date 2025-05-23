// Common cooking fractions and their decimal equivalents
const COMMON_FRACTIONS = new Map<string, number>([
  ['¼', 0.25],
  ['½', 0.5],
  ['¾', 0.75],
  ['⅓', 0.3333],
  ['⅔', 0.6667],
  ['⅛', 0.125],
  ['⅜', 0.375],
  ['⅝', 0.625],
  ['⅞', 0.875],
]);

// Reverse mapping for decimal to unicode fraction
const DECIMAL_TO_UNICODE = new Map<number, string>(
  Array.from(COMMON_FRACTIONS.entries()).map(([key, value]) => [value, key])
);

export interface FractionFormatOptions {
  mixedNumber?: boolean; // Whether to format as mixed number (e.g., "1 1/2" vs "1.5")
  unicode?: boolean;     // Whether to use unicode fractions (e.g., "½" vs "1/2")
  precision?: number;    // Precision for rounding (default: 4)
}

/**
 * Parses a string amount into a decimal number
 * Handles mixed numbers, fractions, and unicode fractions
 */
export function parseAmount(value: string | number | null | undefined): number {
  // Handle null, undefined, or empty string
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  // Convert to string if it's a number
  const strValue = String(value).trim();

  // Handle unicode fractions
  if (COMMON_FRACTIONS.has(strValue)) {
    return COMMON_FRACTIONS.get(strValue)!;
  }

  // Handle mixed numbers (e.g., "1 1/2")
  const mixedMatch = strValue.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const [, whole, num, denom] = mixedMatch;
    return parseInt(whole) + parseInt(num) / parseInt(denom);
  }

  // Handle simple fractions (e.g., "1/2")
  const fractionMatch = strValue.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const [, num, denom] = fractionMatch;
    return parseInt(num) / parseInt(denom);
  }

  // Handle decimal numbers
  const number = parseFloat(strValue);
  return isNaN(number) ? 0 : number;
}

/**
 * Rounds a number to the nearest common cooking fraction
 */
export function roundToCommonFraction(value: number, precision: number = 4): number {
  const commonValues = Array.from(COMMON_FRACTIONS.values());
  const rounded = commonValues.reduce((closest, current) => {
    return Math.abs(current - value) < Math.abs(closest - value) ? current : closest;
  }, Math.round(value));

  return Number(rounded.toFixed(precision));
}

/**
 * Formats a number as a fraction string
 */
export function formatFraction(value: number, options: FractionFormatOptions = {}): string {
  const { mixedNumber = true, unicode = true, precision = 4 } = options;

  if (value === 0) return '0';
  if (Number.isInteger(value)) return value.toString();

  // Handle mixed numbers
  if (mixedNumber && value >= 1) {
    const whole = Math.floor(value);
    const fraction = value - whole;
    
    if (fraction === 0) return whole.toString();
    
    const fractionPart = formatFraction(fraction, { ...options, mixedNumber: false });
    return `${whole} ${fractionPart}`;
  }

  // Try to use unicode fraction if available
  if (unicode) {
    const rounded = roundToCommonFraction(value, precision);
    const unicodeFraction = DECIMAL_TO_UNICODE.get(rounded);
    if (unicodeFraction) return unicodeFraction;
  }

  // Convert to fraction representation
  const denominator = Math.pow(2, Math.ceil(Math.log2(1 / (value % 1))));
  const numerator = Math.round(value * denominator);
  
  // Simplify fraction
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(numerator, denominator);
  
  return `${numerator / divisor}/${denominator / divisor}`;
}

/**
 * Tests if a string represents a valid amount
 */
export function isValidAmount(value: string): boolean {
  if (COMMON_FRACTIONS.has(value)) return true;
  
  // Test for mixed numbers, fractions, and decimals
  const validFormats = [
    /^\d+$/,                    // Whole numbers
    /^\d+\.\d+$/,              // Decimals
    /^\d+\/\d+$/,              // Fractions
    /^\d+\s+\d+\/\d+$/,        // Mixed numbers
  ];

  return validFormats.some(pattern => pattern.test(value));
}

/**
 * Generates an HTML string for an ingredient amount with proper fraction formatting
 */
export function generateIngredientHTML(
  imperialAmount: string | number,
  imperialUnit: string,
  metricAmount: string | number,
  metricUnit: string,
  name: string,
  useImperial: boolean = true,
  options: FractionFormatOptions = {}
): string {
  const amount = useImperial ? imperialAmount : metricAmount;
  let unit = useImperial ? imperialUnit : metricUnit;
  
  // Convert amount to string and handle empty values
  const amountStr = String(amount || '').trim();
  if (!amountStr) {
    return `<span class="ingredient">${name}</span>`;
  }

  const numericValue = parseAmount(amount);
  const formattedAmount = formatFraction(numericValue, options);

  // Abbreviate units
  if (unit) {
    const lowerUnit = unit.toLowerCase();
    if (lowerUnit === 'teaspoon' || lowerUnit === 'teaspoons') unit = 'tsp';
    if (lowerUnit === 'tablespoon' || lowerUnit === 'tablespoons') unit = 'tbsp';
  }
  
  return `<span class="ingredient">${formattedAmount}${unit ? ` ${unit}` : ''} ${name}</span>`;
} 