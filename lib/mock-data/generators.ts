/**
 * Mock Data Generator Utilities
 * Helper functions for creating realistic mocked data
 */

export function randomBTC(min: number, max: number): number {
  return +(Math.random() * (max - min) + min).toFixed(8);
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomItem<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error("Cannot select random item from empty array");
  }
  return array[randomInt(0, array.length - 1)]!;
}

export function generatePubkey(): string {
  return Array.from({ length: 66 }, () => randomInt(0, 15).toString(16)).join(
    ""
  );
}

export function generateId(prefix: string, index: number): string {
  return `${prefix}_${String(index).padStart(3, "0")}`;
}

export function dateNDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export function randomDate(startDaysAgo: number, endDaysAgo: number): string {
  const days = randomInt(endDaysAgo, startDaysAgo);
  return dateNDaysAgo(days);
}

export function generateBitcoinAddress(): string {
  // Generate a realistic-looking bech32 address
  const prefix = "bc1q";
  const chars = "acdefghjklmnpqrstuvwxyz023456789";
  const length = randomInt(38, 58);
  const suffix = Array.from({ length }, () => randomItem(chars.split(""))).join(
    ""
  );
  return prefix + suffix;
}

export function formatDate(date: string): string {
  // Format ISO date to YYYY-MM-DD
  return date.split("T")[0] || date;
}
