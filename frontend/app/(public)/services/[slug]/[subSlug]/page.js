import { notFound } from 'next/navigation';
import SubProductDetail from '@/components/services/SubProductDetail';

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
  const { slug, subSlug } = await params;
  const service = await getService(slug);
  
  const subProduct = service?.subProducts?.find(sp => 
    sp.slug === subSlug || 
    sp.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') === subSlug
  );

  if (!service || !subProduct) {
    return { title: 'Product Not Found | Tridev Labels' };
  }

  return {
    title: subProduct.metaTitle || `${subProduct.title} | ${service.title} | Tridev Labels`,
    description: subProduct.metaDescription || subProduct.desc,
    openGraph: {
      title: subProduct.metaTitle || subProduct.title,
      description: subProduct.metaDescription || subProduct.desc,
      images: [{ url: subProduct.image, alt: subProduct.imageAlt || subProduct.title }],
    },
  };
}

export default async function SubProductPage({ params }) {
  const { slug, subSlug } = await params;
  const service = await getService(slug);

  if (!service) notFound();

  const subProduct = service.subProducts?.find(sp => 
    sp.slug === subSlug || 
    sp.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') === subSlug
  );

  if (!subProduct) notFound();

  return <SubProductDetail service={service} subProduct={subProduct} />;
}
