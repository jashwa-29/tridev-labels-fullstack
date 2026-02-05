import { galleryService } from '@/services/gallery.service';
import PageHeader from '@/components/common/PageHeader';
import GalleryListingClient from './GalleryListingClient';

export const metadata = {
  title: "Technical Portfolio | Tridev Labels Gallery",
  description: "A visual exploration of our specialized tactile finishes, industrial labels, and precision engineering highlights.",
};

export default async function GalleryListingPage() {
  let finishes = [];
  try {
    const response = await galleryService.getAll();
    finishes = response?.data || [];
  } catch (err) {
    console.error("GalleryListingPage: SSR Fetch failed:", err);
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{
             backgroundImage: `linear-gradient(45deg, #000 1px, transparent 1px),
                                 linear-gradient(-45deg, #000 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }} 
      />

      <PageHeader 
        title="Gallery" 
        subtitle="Technical" 
        highlightSubtitle="Archive"
        breadcrumb="Gallery"
        description="A visual exploration of our specialized tactile finishes, industrial labels, and precision engineering highlights."
      />

      <GalleryListingClient initialFinishes={finishes} />
    </main>
  );
}
