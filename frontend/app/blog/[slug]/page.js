import { notFound } from 'next/navigation';
import { blogService } from '@/services/blog.service';
import BlogContent from './BlogContent';

// SEO Metadata Generation
export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    const response = await blogService.getBySlug(slug);
    const blog = response?.data;

    if (!blog) {
      return {
        title: 'Guide Not Found',
      };
    }

    const pageTitle = blog.pageTitle || blog.cardTitle || blog.title;
    return {
      title: `${pageTitle} | Tridev Labels Insights`,
      description: blog.metaDescription || pageTitle,
      openGraph: {
        title: pageTitle,
        description: blog.metaDescription,
        images: [blog.featuredImage || '/default-og.jpg'],
        type: 'article',
        publishedTime: blog.publishedDate || blog.createdAt,
        authors: [blog.author],
      },
    };
  } catch (error) {
    return { title: 'Editorial | Tridev Labels' };
  }
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  let blog = null;
  
  try {
    const response = await blogService.getBySlug(slug);
    blog = response?.data;
  } catch (error) {
    console.error("BlogDetailPage: Fetch failed:", error);
  }

  if (!blog) {
    notFound();
  }

  return <BlogContent blog={blog} />;
}
