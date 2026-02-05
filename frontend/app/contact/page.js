"use client";

import PageHeader from '@/components/common/PageHeader';
import dynamic from 'next/dynamic';

const ContactSection = dynamic(() => import('@/components/contact/ContactSection'), { 
  ssr: true,
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" /> 
});

const ContactMap = dynamic(() => import('@/components/contact/ContactMap'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" /> 
});

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
