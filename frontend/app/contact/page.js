import PageHeader from '@/components/common/PageHeader';
import ContactSection from '@/components/contact/ContactSection';
import ContactMap from '@/components/contact/ContactMap';

export const metadata = {
  title: "Contact Our Label Specialists | Tridev Labels",
  description: "Connect with Tridev Labels for custom labeling solutions, technical consultations, or project inquiries.",
};

export default function ContactPage() {
  return (
    <main className="bg-white">
      <PageHeader 
        title="Connect with"
        subtitle="Industrial"
        highlightSubtitle="Precision."
        description="Reach out to our specialist team for custom labeling solutions, technical consultations, or project inquiries. We are here to engineer your brand's success."
        breadcrumb="Contact Us"
      />
      <ContactSection />
      <ContactMap />
    </main>
  );
}
