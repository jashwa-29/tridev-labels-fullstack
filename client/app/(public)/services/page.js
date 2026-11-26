import dynamic from 'next/dynamic';
import PageHeader from '@/components/common/PageHeader';

const ServicesShowcase = dynamic(() => import('@/components/services/ServicesShowcase'));

export const metadata = {
  title: "Our Services | Tridev Labels",
  description: "Explore our premium labeling solutions tailored for your business needs.",
};

export default function ServicesPage() {
  return (
    <main className="bg-white">
      <PageHeader 
        title="Our Premium"
        highlightTitle="Services"
        subtitle="Tailored to your"
        highlightSubtitle="Brand's Needs."
        description="We offer a comprehensive suite of labeling solutions designed to elevate your brand presence and ensure durability across all conditions. From pharmaceutical to industrial, we have you covered."
        breadcrumb="Services"
        image="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80"
      />
      <div className="pt-0">
         <ServicesShowcase />
      </div>
    </main>
  );
}
