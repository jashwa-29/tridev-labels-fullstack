import { notFound } from 'next/navigation';
import SubProductDetail from '@/components/services/SubProductDetail';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getService(slug) {
  return {
    _id: '1',
    title: 'Dummy Service',
    slug: slug,
    subtitle: 'Dummy Subtitle',
    description: 'Dummy description for service',
    heroImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80',
    overview: 'Dummy overview',
    features: ['Dummy Feature 1', 'Dummy Feature 2'],
    technicalSpecs: [{ property: 'Spec 1', value: 'Value 1' }],
    subProducts: [
      {
        _id: 'sub-1',
        title: 'Dummy Sub Product',
        slug: 'dummy-sub-product',
        desc: 'Dummy description for sub product',
        image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80',
        features: ['Sub Feature 1'],
        applications: ['App 1'],
        specifications: [{ name: 'Spec 1', value: 'Value 1' }]
      }
    ],
    faqs: [{ question: 'Q1', answer: 'A1' }]
  };
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
