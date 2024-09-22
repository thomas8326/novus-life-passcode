import dayjs from 'dayjs';

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

export function formatBirthday(birthday: string | null | undefined): string {
  const defaultDate = dayjs()
    .subtract(18, 'year')
    .startOf('year')
    .toISOString();

  return !birthday || birthday === ''
    ? defaultDate
    : dayjs(birthday).toISOString();
}
