import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Utility function to handle API responses
export async function handleApiResponse(response) {
  try {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data?.error || `HTTP error! status: ${response.status}`);
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('API Response Error:', error);
    return { success: false, error: error.message };
  }
}

// Utility function to format error messages
export function formatErrorMessage(error) {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
}

// Utility function to validate MongoDB ObjectId
export function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}
