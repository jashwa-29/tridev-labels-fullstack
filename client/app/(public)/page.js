import SolutionsSection from '@/components/home/SolutionsSection';
import AboutUs from '@/components/home/AboutUs';
import HeroSection from '@/components/home/HeroSection';
import dynamic from 'next/dynamic';

const FinishesGallery = dynamic(() => import('@/components/home/FinishesGallery'), { ssr: true });
const WhyChooseSection = dynamic(() => import('@/components/home/WhyChooseSection'), { ssr: true });
const OurProcessSection = dynamic(() => import('@/components/home/OurProcess'), { ssr: true });
const Testimonials = dynamic(() => import('@/components/home/Testimonials'), { ssr: true });


export default async function Home() {


  return (
    <div className="relative min-h-screen w-full">
      <HeroSection />
      <AboutUs />

      <SolutionsSection />
         <WhyChooseSection />
      <FinishesGallery />

      <OurProcessSection />
  
      <Testimonials />

    </div>
  );
}
