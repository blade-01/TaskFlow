import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateString(
  str: string,
  length: number,
  suffix: string = "..."
): string {
  if (str.length > length) {
    return str.slice(0, length) + suffix;
  }
  return str;
}

export function generateInputError(fieldName: string) {
  return `${fieldName} is required`;
}
