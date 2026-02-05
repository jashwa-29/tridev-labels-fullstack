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
        title="Sixteen Years of"
        subtitle="Industrial"
        highlightSubtitle="Excellence."
        description="Since 2008, Trridev Labelss has been a dedicated partner to global brands, delivering precision printing solutions with an unwavering commitment to quality."
        breadcrumb="About Organization"
      />
      <AboutApproach />
      <AboutMetrics />
      <AboutValues />
      <HistoryTimeline />
      <AboutTestimonials />
    </main>
  );
}
