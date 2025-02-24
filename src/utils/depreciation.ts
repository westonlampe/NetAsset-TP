import { Asset, DepreciationSchedule } from '../types/asset';

export function calculateDepreciation(
  cost: number,
  salvageValue: number,
  life: number,
  method: DepreciationSchedule['method'],
  periodInYears: number
): number {
  switch (method) {
    case 'straight-line':
      return (cost - salvageValue) / life;
    case 'declining-balance':
      const rate = 2 / life; // 200% declining balance
      return (cost - calculateAccumulatedDepreciation(cost, rate, periodInYears - 1)) * rate;
    case 'sum-of-years-digits':
      const remaining = life - periodInYears + 1;
      const sumOfYears = (life * (life + 1)) / 2;
      return ((cost - salvageValue) * remaining) / sumOfYears;
    case 'units-of-production':
      // Simplified implementation - would need actual units produced
      return (cost - salvageValue) / life;
    default:
      return 0;
  }
}

function calculateAccumulatedDepreciation(cost: number, rate: number, periods: number): number {
  let remainingValue = cost;
  for (let i = 0; i < periods; i++) {
    remainingValue -= remainingValue * rate;
  }
  return cost - remainingValue;
}

export function applyDepreciationConvention(
  amount: number,
  convention: DepreciationSchedule['convention'],
  firstYear: boolean
): number {
  switch (convention) {
    case 'half-year':
      return firstYear ? amount * 0.5 : amount;
    case 'mid-quarter':
      return firstYear ? amount * 0.625 : amount; // Simplified - actual would depend on quarter
    case 'mid-month':
      return firstYear ? amount * (11.5 / 12) : amount;
    case 'full-month':
      return amount;
    default:
      return amount;
  }
}