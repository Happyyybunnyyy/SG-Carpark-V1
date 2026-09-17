import { Carpark, VehicleType } from '../types';

export function calculateEstimatedParkingCost(
  carpark: Carpark,
  durationHours: number,
  timePeriod: 'day' | 'evening' | 'weekend' | string = 'day',
  vehicle: VehicleType
): { cost: number; formatted: string; breakdown: string } {
  if (vehicle === 'bikes') {
    const raw = carpark.fullSchedule.motorcycleRate;
    const match = raw.match(/\$([0-9.]+)/);
    const cost = match ? parseFloat(match[1]) : 1.30;
    return {
      cost,
      formatted: `$${cost.toFixed(2)}`,
      breakdown: 'Per entry motorcycle rate',
    };
  }

  // If evening flat entry
  if (timePeriod === 'evening') {
    const eveningRate = carpark.rates.find((r) => r.period.toLowerCase().includes('after') || r.firstRateUnit.includes('per entry'));
    if (eveningRate) {
      const match = eveningRate.firstRate.match(/\$([0-9.]+)/);
      const cost = match ? parseFloat(match[1]) : 4.00;
      return {
        cost,
        formatted: `$${cost.toFixed(2)}`,
        breakdown: 'Per entry evening flat rate',
      };
    }
  }

  // Weekday daytime or weekend
  const primaryRate = timePeriod === 'weekend' 
    ? (carpark.rates.find((r) => r.period.toLowerCase().includes('sat') || r.period.toLowerCase().includes('sun')) || carpark.rates[0])
    : carpark.rates[0];

  const firstMatch = primaryRate.firstRate.match(/\$([0-9.]+)/);
  const firstRateVal = firstMatch ? parseFloat(firstMatch[1]) : carpark.baseRateNum;

  // Check first hour duration
  const isFirstTwoHours = primaryRate.firstRateUnit.includes('2 hr') || primaryRate.firstRateUnit.includes('2 hrs');
  const baseCoveredHours = isFirstTwoHours ? 2 : 1;

  if (durationHours <= baseCoveredHours) {
    return {
      cost: firstRateVal,
      formatted: `$${firstRateVal.toFixed(2)}`,
      breakdown: `${durationHours}h @ first rate`,
    };
  }

  // Subsequent rate
  let subRateVal = 1.30;
  let intervalMins = 30;
  if (primaryRate.subsequentRate) {
    const subMatch = primaryRate.subsequentRate.match(/\$([0-9.]+)/);
    if (subMatch) subRateVal = parseFloat(subMatch[1]);
  }
  if (primaryRate.subsequentRateUnit.includes('15m') || primaryRate.subsequentRateUnit.includes('15 mins')) {
    intervalMins = 15;
  }

  const remainingHours = durationHours - baseCoveredHours;
  const intervals = Math.ceil((remainingHours * 60) / intervalMins);
  const totalCost = firstRateVal + (intervals * subRateVal);

  return {
    cost: totalCost,
    formatted: `$${totalCost.toFixed(2)}`,
    breakdown: `${baseCoveredHours}h ($${firstRateVal.toFixed(2)}) + ${remainingHours}h ($${(intervals * subRateVal).toFixed(2)})`,
  };
}
