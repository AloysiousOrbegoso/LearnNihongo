export function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return hash >>> 0;
}

export function wordOfDayIndex(day: string, total: number): number {
  if (total <= 0) return 0;
  return hashString(day) % total;
}
