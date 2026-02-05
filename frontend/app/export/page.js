import PageHeader from '@/components/common/PageHeader';
import ExportIntro from '@/components/export/ExportIntro';
import SpecialtyCapabilities from '@/components/export/SpecialtyCapabilities';
import GlobalReachSection from '@/components/export/GlobalReachSection';
import ExportMetrics from '@/components/export/ExportMetrics';
import ExportProcess from '@/components/export/ExportProcess';
import ExportFAQ from '@/components/export/ExportFAQ';

export const metadata = {
  title: "Global Export Solutions | Tridev Labels International",
  description: "Trridev Labelss bridges the gap between artisan craftsmanship and global logistics, providing world-class labeling solutions globally.",
};

export default function ExportPage() {
  return (
    <main className="bg-white">
      <PageHeader 
        title="Global Presence."
        subtitle="Indian Heritage,"
        highlightSubtitle="International Standards."
        description="Trridev Labelss bridges the gap between artisan craftsmanship and global logistics, providing world-class labeling solutions to every corner of the world."
        breadcrumb="Export Solutions"
      />
      
      <ExportIntro />
      <SpecialtyCapabilities />
      <ExportMetrics />
      <GlobalReachSection />
      <ExportProcess />
      <ExportFAQ />
    </main>
  );
}
