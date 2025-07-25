export function formatDateToLocal(dateString: string) {
  return new Date(dateString).toLocaleString(); // Uses device timezone by default
}

// Optional with timezone abbreviation
// export function formatDateToLocalWithTZ(dateString: string) {
//   return new Date(dateString).toLocaleString(undefined, {
//     timeZoneName: "short",
//   });
// }

// src/utils/dateHelpers.ts

import { MS_PER_SIMULATED_DAY } from "@/constants/reductionConstants"; // Make sure this path is correct and constant is defined

/**
 * Calculates the current virtual day number based on a start date and the simulated day duration.
 * @param startDate The start date of the reduction period.
 * @returns An object containing the current virtual day number.
 */
export const getVirtualDayInfo = (startDate: Date) => {
  const now = new Date();
  // Calculate time elapsed since the start date in milliseconds
  const timeElapsed = now.getTime() - startDate.getTime();
  // Determine the current virtual day by dividing elapsed time by simulated day duration
  const currentVirtualDay = Math.floor(timeElapsed / MS_PER_SIMULATED_DAY);
  return { currentVirtualDay };
};

/**
 * Converts a virtual day number back to a specific Date string based on a fixed base date.
 * This is used for database storage and queries to represent a specific "virtual day".
 * @param virtualDayNumber The virtual day number (e.g., 0, 1, 2).
 * @returns A date string (YYYY-MM-DD) representing that virtual day.
 */
export const getVirtualDateFromDayNumber = (
  virtualDayNumber: number
): string => {
  // Use a consistent base date for all virtual day calculations
  // This must match the base_test_date used in your Supabase RPC function ('2000-01-01')
  const BASE_VIRTUAL_DATE = new Date("2000-01-01T00:00:00Z"); // Using Z for UTC to avoid local timezone issues

  const targetDate = new Date(BASE_VIRTUAL_DATE);
  targetDate.setDate(BASE_VIRTUAL_DATE.getDate() + virtualDayNumber);

  // Format to YYYY-MM-DD string for database compatibility
  return targetDate.toISOString().split("T")[0];
};

/**
 * Formats a date string to a local date/time string with timezone (optional).
 * @param dateString The date string to format.
 * @returns A formatted local date/time string.
 */
export const formatDateToLocalWithTZ = (dateString: string): string => {
  const date = new Date(dateString);
  // Options for a more readable format, you can adjust this
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    // second: '2-digit', // Uncomment if you want seconds
    // timeZoneName: 'short', // Uncomment if you want timezone abbreviation
  };
  return date.toLocaleDateString(undefined, options);
};

// You can add more date utility functions here as needed
