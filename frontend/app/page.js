import SolutionsSection from '@/components/home/SolutionsSection';
import AboutUs from '@/components/home/AboutUs';
import HeroSection from '@/components/home/HeroSection';
import dynamic from 'next/dynamic';
import { blogService } from '@/services/blog.service';

const FinishesGallery = dynamic(() => import('@/components/home/FinishesGallery'), { ssr: true });
const WhyChooseSection = dynamic(() => import('@/components/home/WhyChooseSection'), { ssr: true });
const OurProcessSection = dynamic(() => import('@/components/home/OurProcess'), { ssr: true });
const Testimonials = dynamic(() => import('@/components/home/Testimonials'), { ssr: true });
const BlogsSection = dynamic(() => import('@/components/home/BlogsSection'), { ssr: true });

export default async function Home() {
  // Fetch blogs on the server for SSR
  let blogs = [];
  try {
    const response = await blogService.getAll(1, 4);
    blogs = response?.data || [];
  } catch (error) {
    console.error("Home: SSR Blog Fetch failed:", error);
  }

  return (
    <div className="relative min-h-screen w-full">
      <HeroSection />
      <AboutUs />

      <SolutionsSection />
      <FinishesGallery />
      <WhyChooseSection />
      <OurProcessSection />
      <Testimonials />
      <BlogsSection initialBlogs={blogs} />
    </div>
  );
}
