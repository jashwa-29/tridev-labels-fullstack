import dynamic from 'next/dynamic';
import PageHeader from '@/components/common/PageHeader';
import AboutApproach from '@/components/about/AboutApproach';

const AboutMetrics = dynamic(() => import('@/components/about/AboutMetrics'));
const AboutValues = dynamic(() => import('@/components/about/AboutValues'));
const HistoryTimeline = dynamic(() => import('@/components/about/HistoryTimeline'));
const AboutTestimonials = dynamic(() => import('@/components/about/AboutTestimonials'));

export const metadata = {
  title: "Label Printing Excellence Since 2008 | Tridev Labels",
  description: "Sixteen years of industrial excellence. Trridev Labelss is a dedicated partner to global brands, delivering precision printing solutions.",
};

export default function AboutPage() {
  return (
    <main className="bg-white">
      <PageHeader 
        title="Our Journey – Built on"
        subtitle="Trust, Grown with"
        highlightSubtitle="Commitment."
        description="What began in 2008 as a small vision has grown step by step through hard work, learning, and the continued trust of our customers. Every label we produce carries our promise of quality, consistency, and responsibility."
        breadcrumb="About Us"
      />
      <AboutApproach />
      <AboutMetrics />
      <AboutValues />
      <HistoryTimeline />
      <AboutTestimonials />
    </main>
  );
}
