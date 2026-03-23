/**
 * Utility function to construct image URLs for the admin panel
 */
export const getImgUrl = (path) => {
  if (!path || typeof path !== 'string') return null;
  
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiBase.replace(/\/api$/, '').replace(/\/api\/$/, '');
  
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseUrl}${normalizedPath}`;
};
