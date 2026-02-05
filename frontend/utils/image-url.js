export const getImgUrl = (path) => {
  if (!path) return null;
  
  // If it's already a full URL (http:// or https://), return it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Get base backend URL from env or fallback to localhost
  const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') 
    : 'http://localhost:5000';
    
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${backendBaseUrl}${normalizedPath}`;
};
