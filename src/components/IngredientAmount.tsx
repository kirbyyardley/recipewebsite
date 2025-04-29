import React from 'react';
import { useIngredientFormat, UseIngredientFormatOptions } from '@/hooks/useIngredientFormat';
import { FractionFormatOptions } from '@/lib/fractionUtils';

export interface IngredientAmountProps {
  imperialAmount: string;
  imperialUnit?: string;
  metricAmount: string;
  metricUnit?: string;
  formatOptions?: FractionFormatOptions;
  className?: string;
  preferredUnit?: 'imperial' | 'metric';
}

export function IngredientAmount({
  imperialAmount,
  imperialUnit = '',
  metricAmount,
  metricUnit = '',
  formatOptions,
  className = '',
  preferredUnit = 'imperial',
}: IngredientAmountProps) {
  const hookOptions: UseIngredientFormatOptions = {
    defaultUnit: preferredUnit,
    formatOptions,
  };

  const { formatIngredient } = useIngredientFormat(hookOptions);

  const { formattedAmount, unit } = formatIngredient(
    imperialAmount,
    imperialUnit,
    metricAmount,
    metricUnit,
  );

  return (
    <span className={`ingredient-amount ${className}`.trim()}>
      {formattedAmount}
      {unit && <span className="ingredient-unit"> {unit}</span>}
    </span>
  );
}

// Also export a simpler version for when we only have one measurement system
export interface SimpleIngredientAmountProps {
  amount: string;
  unit?: string;
  formatOptions?: FractionFormatOptions;
  className?: string;
}

export function SimpleIngredientAmount({
  amount,
  unit,
  formatOptions,
  className = '',
}: SimpleIngredientAmountProps) {
  const { formatAmount } = useIngredientFormat({ formatOptions });
  const { formattedAmount, unit: formattedUnit } = formatAmount(amount, unit);

  return (
    <span className={`ingredient-amount ${className}`.trim()}>
      {formattedAmount}
      {formattedUnit && <span className="ingredient-unit"> {formattedUnit}</span>}
    </span>
  );
} 