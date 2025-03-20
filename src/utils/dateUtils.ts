
import { format, formatDistanceToNow, isValid } from "date-fns";

/**
 * Formats a date string or Date object into a human-readable relative format
 * (e.g., "5 days ago", "about 2 months ago")
 */
export function formatRelativeDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) {
    return "Never";
  }
  
  try {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    
    if (!isValid(date)) {
      return "Invalid date";
    }
    
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error("Error formatting relative date:", error);
    return "Invalid date";
  }
}

/**
 * Formats a date string or Date object into a standard date format
 * (e.g., "Jan 1, 2023")
 */
export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) {
    return "N/A";
  }
  
  try {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    
    if (!isValid(date)) {
      return "Invalid date";
    }
    
    return format(date, "MMM d, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

/**
 * Formats a date string or Date object into a full date and time format
 * (e.g., "Jan 1, 2023, 12:30 PM")
 */
export function formatDateTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) {
    return "N/A";
  }
  
  try {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    
    if (!isValid(date)) {
      return "Invalid date";
    }
    
    return format(date, "MMM d, yyyy, h:mm a");
  } catch (error) {
    console.error("Error formatting date time:", error);
    return "Invalid date";
  }
}
