import { blogService } from '@/services/blog.service';
import PageHeader from '@/components/common/PageHeader';
import BlogListingClient from './BlogListingClient';

export const metadata = {
  title: "Industry Journal | Tridev Labels Insights",
  description: "Exploring the intersections of precision engineering, sustainable materials, and brand aesthetics.",
};

export default async function BlogListingPage({ searchParams }) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const BLOGS_PER_PAGE = 9;

  let blogs = [];
  let totalPages = 1;

  try {
    const response = await blogService.getAll(currentPage, BLOGS_PER_PAGE);
    blogs = response?.data || [];
    totalPages = response?.pages || 1;
  } catch (error) {
    console.error("BlogListingPage: SSR Fetch failed:", error);
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Home-Page Style Background Pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{
             backgroundImage: `linear-gradient(45deg, #000 1px, transparent 1px),
                                 linear-gradient(-45deg, #000 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }} 
      />

      <PageHeader 
        title="Journal" 
        subtitle="Industrial" 
        highlightSubtitle="Insights"
        breadcrumb="Journal"
        description="Exploring the intersections of precision engineering, sustainable materials, and brand aesthetics."
      />

      <BlogListingClient 
        initialBlogs={blogs} 
        initialPage={currentPage} 
        totalPages={totalPages} 
      />
    </main>
  );
}


