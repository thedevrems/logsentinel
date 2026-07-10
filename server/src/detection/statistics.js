// Computes the arithmetic mean of a numeric sample array.
export function mean(values) {
  if (!values.length) return 0;
  return values.reduce((acc, v) => acc + v, 0) / values.length;
}

// Computes the population standard deviation of a numeric sample array.
export function standardDeviation(values) {
  if (values.length < 2) return 0;
  const avg = mean(values);
  const variance = mean(values.map((v) => (v - avg) ** 2));
  return Math.sqrt(variance);
}

// Returns how many standard deviations a value sits above the mean.
export function zScore(value, values) {
  const sd = standardDeviation(values);
  if (sd === 0) return 0;
  return (value - mean(values)) / sd;
}
