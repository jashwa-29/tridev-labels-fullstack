import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import axios from 'axios';

const ServiceContent = dynamic(() => import('@/components/services/ServiceContent'), {
  ssr: true,
  loading: () => <div className="min-h-screen bg-white animate-pulse" />
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getService(slug) {
  try {
    const res = await fetch(`${API_URL}/services/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return { title: 'Service Not Found | Tridev Labels' };
  }

  return {
    title: `${service.title} | Premium Labeling Solutions`,
    description: service.description,
    openGraph: {
      title: service.title,
      description: service.description,
      images: [{ url: service.heroImage }],
    },
  };
}

export const dynamicParams = true;

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  return <ServiceContent service={service} />;
}
