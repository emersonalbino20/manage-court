export function receiveCentFront(cents) {
  const kwanzas = cents / 100;
  return kwanzas.toFixed(2); // Returns the formatted value with two decimal places
}

export function sendCoinBeck(cents) {
  const amountInCents = Math.round(cents * 100); // Convert to cents
  return parseInt(amountInCents); // Returns the formatted value with two decimal places
}
