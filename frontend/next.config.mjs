/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'peppy-moonbeam-9fe49c.netlify.app',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5000',
      },
      {
        protocol: 'http',
        hostname: '::1',
        port: '5000',
      }
    ],
    unoptimized: true,
  },
  // Performance optimizations for development and build
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      'gsap', 
      'framer-motion', 
      '@lucide/react'
    ],
  },
  // Ensure we aren't leaking too much during dev
  reactStrictMode: false, 
};

export default nextConfig;
