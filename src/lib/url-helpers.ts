/**
 * Extracts a GUID/MongoDB ID from a URL path
 * @param url The full URL containing the ID
 * @returns The extracted ID or null if not found
 */
export function extractIdFromUrl(url: string): string | null {
  try {
    // Look for a 24-character hexadecimal ID in the URL path
    const match = url.match(/([a-f0-9]{24})/i);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting ID from URL:', error);
    return null;
  }
}

// Alias for backwards compatibility
export const extractPropertyIdFromUrl = extractIdFromUrl; 