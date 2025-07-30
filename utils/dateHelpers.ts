// export function formatDateToLocal(dateString: string) {
//   return new Date(dateString).toLocaleString(); // Uses device timezone by default
// }

// // Optional with timezone abbreviation
// // export function formatDateToLocalWithTZ(dateString: string) {
// //   return new Date(dateString).toLocaleString(undefined, {
// //     timeZoneName: "short",
// //   });
// // }

// // src/utils/dateHelpers.ts

// import { MS_PER_SIMULATED_DAY } from "@/constants/reductionConstants"; // Make sure this path is correct and constant is defined

// /**
//  * Calculates the current virtual day number based on a start date and the simulated day duration.
//  * @param startDate The start date of the reduction period.
//  * @returns An object containing the current virtual day number.
//  */
// export const getVirtualDayInfo = (startDate: Date) => {
//   const now = new Date();
//   // Calculate time elapsed since the start date in milliseconds
//   const timeElapsed = now.getTime() - startDate.getTime();
//   // Determine the current virtual day by dividing elapsed time by simulated day duration
//   const currentVirtualDay = Math.floor(timeElapsed / MS_PER_SIMULATED_DAY);
//   return { currentVirtualDay };
// };

// /**
//  * Converts a virtual day number back to a specific Date string based on a fixed base date.
//  * This is used for database storage and queries to represent a specific "virtual day".
//  * @param virtualDayNumber The virtual day number (e.g., 0, 1, 2).
//  * @returns A date string (YYYY-MM-DD) representing that virtual day.
//  */
// export const getVirtualDateFromDayNumber = (
//   virtualDayNumber: number
// ): string => {
//   // Use a consistent base date for all virtual day calculations
//   // This must match the base_test_date used in your Supabase RPC function ('2000-01-01')
//   const BASE_VIRTUAL_DATE = new Date("2000-01-01T00:00:00Z"); // Using Z for UTC to avoid local timezone issues

//   const targetDate = new Date(BASE_VIRTUAL_DATE);
//   targetDate.setDate(BASE_VIRTUAL_DATE.getDate() + virtualDayNumber);

//   // Format to YYYY-MM-DD string for database compatibility
//   return targetDate.toISOString().split("T")[0];
// };

// /**
//  * Formats a date string to a local date/time string with timezone (optional).
//  * @param dateString The date string to format.
//  * @returns A formatted local date/time string.
//  */
// export const formatDateToLocalWithTZ = (dateString: string): string => {
//   const date = new Date(dateString);
//   // Options for a more readable format, you can adjust this
//   const options: Intl.DateTimeFormatOptions = {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     // second: '2-digit', // Uncomment if you want seconds
//     // timeZoneName: 'short', // Uncomment if you want timezone abbreviation
//   };
//   return date.toLocaleDateString(undefined, options);
// };

// // You can add more date utility functions here as needed
///////////////////////////////////////////

// src/utils/dateHelpers.ts

// import { MS_PER_SIMULATED_DAY } from "@/constants/reductionConstants"; // Make sure this path is correct and constant is defined

// /**
//  * Calculates the current virtual day number based on a start date and the simulated day duration.
//  * @param startDate The start date of the reduction period.
//  * @returns An object containing the current virtual day number.
//  */
// export const getVirtualDayInfo = (startDate: Date) => {
//   const now = new Date();
//   // Calculate time elapsed since the start date in milliseconds
//   const timeElapsed = now.getTime() - startDate.getTime();
//   // Determine the current virtual day by dividing elapsed time by simulated day duration
//   const currentVirtualDay = Math.floor(timeElapsed / MS_PER_SIMULATED_DAY);
//   return { currentVirtualDay };
// };

// /**
//  * Converts a virtual day number back to a specific Date string based on the pledge's actual start date.
//  * This is used for database storage and queries to represent a specific "virtual day" within the pledge's timeline.
//  * @param virtualDayNumber The virtual day number (e.g., 0, 1, 2).
//  * @param pledgeStartDate The actual start date of the reduction period (as a Date object).
//  * @returns A date string (YYYY-MM-DD) representing that virtual day relative to the pledge's start.
//  */
// export const getVirtualDateFromDayNumber = (
//   virtualDayNumber: number,
//   pledgeStartDate: Date // NEW: Accepts the pledge's start date
// ): string => {
//   const targetDate = new Date(pledgeStartDate); // Start from the pledge's actual start date
//   targetDate.setDate(pledgeStartDate.getDate() + virtualDayNumber); // Add virtual days to it

//   // Format to YYYY-MM-DD string for database compatibility
//   return targetDate.toISOString().split("T")[0];
// };

// /**
//  * Formats a date string to a local date/time string with timezone (optional).
//  * @param dateString The date string to format.
//  * @returns A formatted local date/time string.
//  */
// export const formatDateToLocalWithTZ = (dateString: string): string => {
//   const date = new Date(dateString);
//   const options: Intl.DateTimeFormatOptions = {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   };
//   return date.toLocaleDateString(undefined, options);
// };

// export function formatDateToLocal(dateString: string) {
//   return new Date(dateString).toLocaleString();
// }

////////////////////////////

// utils/dateHelpers.ts

// IMPORTANT: This constant MUST match the MS_PER_SIMULATED_DAY_CONST in your PostgreSQL function
// For testing: 60000 (1 minute)
// For production: 86400000 (24 hours)
export const MS_PER_SIMULATED_DAY = 60000; // Using 1 minute for current testing

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
 * Calculates the precise start timestamp (ISO string) of a given virtual day number.
 * This aligns with the backend's definition of a virtual day.
 * @param virtualDayNumber The virtual day number (e.g., 0, 1, 2).
 * @param pledgeStartDate The actual start date of the reduction period (as a Date object).
 * @returns An ISO 8601 string representing the start of that virtual day.
 */
export const getVirtualDayStartTimestamp = (
  virtualDayNumber: number,
  pledgeStartDate: Date
): string => {
  const startTimeMs =
    pledgeStartDate.getTime() + virtualDayNumber * MS_PER_SIMULATED_DAY;
  return new Date(startTimeMs).toISOString();
};

/**
 * Calculates the precise end timestamp (ISO string, exclusive) of a given virtual day number.
 * This aligns with the backend's definition of a virtual day.
 * @param virtualDayNumber The virtual day number (e.g., 0, 1, 2).
 * @param pledgeStartDate The actual start date of the reduction period (as a Date object).
 * @returns An ISO 8601 string representing the end (exclusive) of that virtual day.
 */
export const getVirtualDayEndTimestamp = (
  virtualDayNumber: number,
  pledgeStartDate: Date
): string => {
  const endTimeMs =
    pledgeStartDate.getTime() + (virtualDayNumber + 1) * MS_PER_SIMULATED_DAY;
  return new Date(endTimeMs).toISOString();
};

/**
 * Formats a date string to a local date/time string with timezone (optional).
 * @param dateString The date string to format.
 * @returns A formatted local date/time string.
 */
export const formatDateToLocalWithTZ = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit", // Added seconds for debugging precision
    timeZoneName: "short",
  };
  return date.toLocaleDateString(undefined, options);
};

export function formatDateToLocal(dateString: string) {
  return new Date(dateString).toLocaleString();
}
