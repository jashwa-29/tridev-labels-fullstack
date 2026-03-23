import { galleryService } from '@/services/gallery.service';
import PageHeader from '@/components/common/PageHeader';
import CapabilitiesPageContent from '@/components/capabilities/CapabilitiesPageContent';

export const metadata = {
  title: "Complete Flexo & Digital Label Printing Solutions | Tridev Labels",
  description: "At TRRIDEV LABELSS MFG CO., we deliver advanced flexo and digital label printing solutions managed under one roof — ensuring quality control, faster turnaround, and reliable production.",
};

export default async function CapabilitiesPage() {
  let galleryItems = [];
  try {
    const response = await galleryService.getAll();
    galleryItems = response?.data || [];
  } catch (err) {
    console.error("CapabilitiesPage: SSR Fetch failed:", err);
  }

  return (
    <main className="min-h-screen bg-white">
      <PageHeader 
        title="Complete Flexo &"
        subtitle="Digital Label Printing"
        highlightSubtitle="Solutions."
        description="At TRRIDEV LABELSS MFG CO., we deliver advanced flexo and digital label printing solutions for industries wherever labeling, identification, branding, and security printing are required. Everything managed under one roof — ensuring quality control, faster turnaround, and reliable production."
        breadcrumb="Our Capabilities"
       
      />
      <CapabilitiesPageContent galleryItems={galleryItems} />
    </main>
  );
}
