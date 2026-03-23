import PageHeader from '@/components/common/PageHeader';
import AboutApproach from '@/components/about/AboutApproach';
import AboutMetrics from '@/components/about/AboutMetrics';
import AboutValues from '@/components/about/AboutValues';
import HistoryTimeline from '@/components/about/HistoryTimeline';
import AboutTestimonials from '@/components/about/AboutTestimonials';

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
