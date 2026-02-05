/**
 * Utility function to construct image URLs for the admin panel
 * Handles both relative paths and absolute URLs
 * @param {string} path - Image path from the backend (relative or absolute)
 * @returns {string|null} - Full image URL or null if no path provided
 */
export const getImgUrl = (path) => {
  if (!path) return null;
  
  // If it's already a full URL or a data URL, return it as-is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  
  // Get base backend URL from environment variable
  const backendBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  
  // Remove '/api' suffix if present (we want the root domain)
  const baseUrl = backendBaseUrl.replace('/api', '');
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${normalizedPath}`;
};
