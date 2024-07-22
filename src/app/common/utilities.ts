export function isNil<T>(
  value: T | undefined | null,
): value is undefined | null {
  return value === undefined || value === null;
}

export function isNotNil<T>(
  value?: T | undefined | null,
): value is NonNullable<T> {
  return !isNil(value);
}
