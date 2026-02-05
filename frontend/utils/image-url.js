/**
 * Utility to resolve image paths to full URLs
 * Supports:
 * - Full remote URLs (Unsplash, Cloudinary, etc.)
 * - Local backend-relative paths (uploads/...)
 * - Fallbacks for missing images
 * 
 * @param {string} path - The image path or URL
 * @returns {string|null} - The resolved full URL
 */
export const getImgUrl = (path) => {
  if (!path || typeof path !== 'string') return null;
  
  // 1. If it's already a full URL, return it as is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  
  // 2. Resolve backend base URL
  // We prefer the environment variable, but fallback to a reasonable default for production/dev
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
  const backendBaseUrl = apiBase.includes('/api') 
    ? apiBase.replace('/api', '') 
    : 'https://tridev-labels-fullstack.onrender.com';
    
  // 3. Normalize the path (ensure single slash between base and path)
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${backendBaseUrl}${normalizedPath}`;
};
