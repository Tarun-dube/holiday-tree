import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

/**
 * A utility function to merge Tailwind CSS classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date into a readable string.
 * Example Usage: formatDate('2025-09-29T10:00:00Z') -> "Sep 29, 2025"
 */
export function formatDate(date: string | number | Date, formatString = 'LLL dd, y') {
  return format(new Date(date), formatString);
}

/**
 * Formats a number as a currency string.
 * Example Usage: formatCurrency(129.5) -> "$129.50"
 */
export function formatCurrency(amount: number, currency = 'INR') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}