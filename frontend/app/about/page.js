"use client";

import PageHeader from '@/components/common/PageHeader';
import dynamic from 'next/dynamic';

import AboutApproach from '@/components/about/AboutApproach';
import AboutMetrics from '@/components/about/AboutMetrics';

const AboutValues = dynamic(() => import('@/components/about/AboutValues'), { ssr: false });
const HistoryTimeline = dynamic(() => import('@/components/about/HistoryTimeline'), { ssr: false });
const AboutTestimonials = dynamic(() => import('@/components/about/AboutTestimonials'), { ssr: false });

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
