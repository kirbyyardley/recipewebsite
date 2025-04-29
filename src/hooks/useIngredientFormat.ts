import { useMemo, useCallback } from 'react';
import { parseAmount, formatFraction, FractionFormatOptions } from '@/lib/fractionUtils';

export interface UseIngredientFormatOptions {
  defaultUnit?: 'imperial' | 'metric';
  formatOptions?: FractionFormatOptions;
}

interface FormatResult {
  formattedAmount: string;
  numericValue: number;
  unit: string;
}

const DEFAULT_FORMAT_OPTIONS: FractionFormatOptions = {
  mixedNumber: true,
  unicode: true,
  precision: 4,
};

export function useIngredientFormat(options: UseIngredientFormatOptions = {}) {
  const {
    defaultUnit = 'imperial',
    formatOptions = DEFAULT_FORMAT_OPTIONS,
  } = options;

  // Memoize the format options to prevent unnecessary recalculations
  const memoizedFormatOptions = useMemo(() => ({
    ...DEFAULT_FORMAT_OPTIONS,
    ...formatOptions,
  }), [formatOptions]);

  // Format a single ingredient amount
  const formatAmount = useCallback((
    amount: string,
    unit?: string,
  ): FormatResult => {
    const numericValue = parseAmount(amount);
    const formattedAmount = formatFraction(numericValue, memoizedFormatOptions);

    return {
      formattedAmount,
      numericValue,
      unit: unit || '',
    };
  }, [memoizedFormatOptions]);

  // Format an ingredient with both imperial and metric measurements
  const formatIngredient = useCallback((
    imperialAmount: string,
    imperialUnit: string,
    metricAmount: string,
    metricUnit: string,
  ): FormatResult => {
    const isImperial = defaultUnit === 'imperial';
    
    return formatAmount(
      isImperial ? imperialAmount : metricAmount,
      isImperial ? imperialUnit : metricUnit,
    );
  }, [defaultUnit, formatAmount]);

  return {
    formatAmount,
    formatIngredient,
    defaultUnit,
    formatOptions: memoizedFormatOptions,
  };
} 