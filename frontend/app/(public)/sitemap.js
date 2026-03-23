import { blogService } from '@/services/blog.service';
import { serviceService } from '@/services/service.service';

export default async function sitemap() {
  const baseUrl = 'https://tridevlabels.com';

  // Base routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/blog',
    '/gallery',
    '/export',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes - Blogs
  let blogRoutes = [];
  try {
    const blogsResponse = await blogService.getAll(1, 100);
    const blogs = blogsResponse?.data || [];
    blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.updatedAt || blog.publishedDate || new Date()),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Sitemap: Blog fetch failed', error);
  }

  // Dynamic routes - Services
  let serviceRoutes = [];
  try {
    const servicesResponse = await serviceService.getAll();
    const services = servicesResponse?.data || [];
    serviceRoutes = services.map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: new Date(service.updatedAt || new Date()),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Sitemap: Service fetch failed', error);
  }

  return [...routes, ...blogRoutes, ...serviceRoutes];
}
