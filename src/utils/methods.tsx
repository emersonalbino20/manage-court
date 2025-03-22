export function receiveCentFront(cents) {
  const value = cents / 100;
  return value.toFixed(2); // Returns the formatted value with two decimal places
}

export function sendCoinBeck(cents) {
  const value = Math.round(cents * 100); // Convert to cents
  return parseInt(value); // Returns the formatted value with two decimal places
}
