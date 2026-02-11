export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined && value !== null;
}

export function defaultValue<T>(value: T | undefined, defaultValue: T): T {
  return isDefined(value) ? value : defaultValue;
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    return false
  }
}