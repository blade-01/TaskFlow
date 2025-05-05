export function getErrorMessage(error: unknown, log = false): string {
  if (log) console.error(error);
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
