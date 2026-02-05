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

    return {
      title: `${blog.title} | Tridev Labels Insights`,
      description: blog.metaDescription || blog.title,
      openGraph: {
        title: blog.title,
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
