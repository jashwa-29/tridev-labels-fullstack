/**
 * Utility function to construct image URLs for the admin panel
 * Handles both relative paths and absolute URLs
 * 
 * Supports:
 * - Full remote URLs (Unsplash, Cloudinary)
 * - Base64 Data URLs
 * - Local backend-relative paths (uploads/...)
 * 
 * @param {string} path - Image path or URL
 * @returns {string|null} - Full image URL or null
 */
export const getImgUrl = (path) => {
  if (!path || typeof path !== 'string') return null;
  
  // 1. If it's already a full URL or a data URL, return it as-is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  
  // 2. Resolve backend base URL from environment
  const apiBase = import.meta.env.VITE_API_BASE_URL || '';
  const baseUrl = apiBase.includes('/api') 
    ? apiBase.replace('/api', '') 
    : 'https://tridev-labels-fullstack.onrender.com';
  
  // 3. Normalize path (ensure leading slash)
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${normalizedPath}`;
};
