"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getImgUrl } from '@/utils/image-url';
import { 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Settings,
  Package,
  Star,
  Plus,
  Minus,
  ChevronDown,
  Ruler,
  Scale,
  Droplet,
  Zap,
  Gauge,
  Thermometer,
  Hammer,
  Wrench,
  Layers,
  Target,
  Award,
  Clock,
  Truck,
  RefreshCw,
  Activity,
  Cog,
  FileText,
  Quote as QuoteIcon
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import QuoteModal from '@/components/common/QuoteModal';
import PageHeader from '@/components/common/PageHeader';

gsap.registerPlugin(ScrollTrigger);

export default function SubProductDetail({ service, subProduct }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState({ url: subProduct.image, alt: subProduct.imageAlt });
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!subProduct) return;

    const ctx = gsap.context(() => {
      // Entrance animations
      gsap.from('.fade-in', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out"
      });

      gsap.from('.hero-image', {
        scale: 1.1,
        duration: 1.5,
        ease: "power3.out"
      });

      // Spec items animation
      gsap.fromTo(".spec-item", 
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".specs-section",
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Process step animations
      gsap.utils.toArray(".process-step").forEach((step, i) => {
        gsap.fromTo(step, 
          { x: i % 2 === 0 ? -100 : 100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [subProduct]);

  if (!subProduct) return null;

  const gallery = [{ url: subProduct.image, alt: subProduct.imageAlt }, ...(subProduct.gallery || [])].filter(item => item && item.url);

  // Icon mapping for specifications
  const getSpecIcon = (label) => {
    const icons = {
      'material': Hammer,
      'weight': Scale,
      'dimensions': Ruler,
      'size': Ruler,
      'voltage': Zap,
      'power': Zap,
      'capacity': Droplet,
      'pressure': Gauge,
      'temperature': Thermometer,
      'warranty': Award,
      'default': Settings
    };
    const key = label?.toLowerCase() || 'default';
    return icons[key] || icons.default;
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-white selection:bg-[#E32219] selection:text-white">
      <QuoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        serviceTitle={`${service.title} - ${subProduct.title}`}
      />

      <PageHeader 
        title={subProduct.title}
        subtitle={service.title}
        breadcrumb="Services"
      />

      <main className="pb-16">
        {/* Main Article Container */}
        <article className="mx-auto px-6 md:px-12 lg:px-20 pt-6 md:pt-10">
          
          <div className="max-w-7xl mx-auto">
            {/* 1. Featured Hero Visual */}
            {subProduct.image && (
              <div className="mb-8 relative z-10">
                <div className="relative aspect-video md:aspect-[21/9] overflow-hidden rounded-[24px] md:rounded-[32px] hero-image">
                  <Image
                    src={getImgUrl(activeImage.url || activeImage)}
                    alt={activeImage.alt || subProduct.imageAlt || subProduct.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
                
                {/* Gallery Thumbnails */}
                {gallery.length > 1 && (
                  <div className="flex gap-4 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                    {gallery.map((img, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 shrink-0 ${
                          (activeImage.url || activeImage) === (img.url || img)
                            ? 'border-[#E32219] scale-110' 
                            : 'border-gray-100 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image src={getImgUrl(img.url || img)} alt={img.alt || "Product view"} fill className="object-cover" unoptimized />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. Product Title */}
            <div className="mb-8 fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-gray-900 leading-[1.1] mb-6 tracking-tighter">
                {subProduct.title}
              </h1>
            </div>
            
            {/* 3. Metadata Row */}
            <div className="mb-8 fade-in">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 mb-4">
                <span className="text-[9px] font-bold text-[#E32219] uppercase tracking-[0.2em] py-1 px-3 border border-[#E32219]/20 rounded-full bg-white shadow-sm">
                  {service.title}
                </span>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <div className="size-1 rounded-full bg-gray-200"></div>
                  Premium Quality
                </span>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <div className="size-1 rounded-full bg-gray-200"></div>
                  In Stock
                </span>
              </div>
            </div>

            {/* 4. Product Description - Excerpt Style */}
            <div className="prose prose-lg md:prose-xl prose-gray max-w-none fade-in
              prose-headings:text-gray-900 prose-headings:font-medium prose-headings:tracking-tight
              prose-p:text-gray-700 prose-p:leading-[1.75] prose-p:mb-6 prose-p:font-light
              prose-strong:text-gray-950 prose-strong:font-medium
            ">
              {subProduct.desc && (
                <div className="text-xl md:text-2xl font-light text-gray-800 leading-relaxed mb-12 border-l-4 border-[#E32219] pl-6 py-1">
                  {subProduct.desc}
                </div>
              )}
            </div>

            {/* 5. Technical Specifications - Detailed Grid */}
            {subProduct.specifications?.length > 0 && (
              <div className="my-16 specs-section">
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-6 bg-[#E32219] rounded-full"></div>
                    <h2 className="text-3xl md:text-4xl font-medium text-gray-900 tracking-tight">Technical Data (Matrix)</h2>
                  </div>
                  <p className="text-gray-600 font-light leading-relaxed">Detailed technical parameters and performance metrics</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subProduct.specifications.map((spec, idx) => {
                    const IconComponent = spec.label ? getSpecIcon(spec.label) : Settings;
                    return spec.label && (
                      <div 
                        key={idx} 
                        className="spec-item p-6 md:p-8 rounded-[24px] bg-[#f8f8f8] border border-gray-100 hover:shadow-lg transition-all duration-500"
                      >
                        <div className="flex items-start gap-5">
                          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0">
                            <IconComponent size={20} className="text-[#E32219]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-2">
                              {spec.label}
                            </p>
                            <p className="text-xl md:text-2xl font-light text-gray-900 tracking-tight leading-tight">
                              {spec.value}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. Features Highlight Box */}
            {subProduct.features?.length > 0 && (
              <div className="my-16 reveal-element">
                <div className="p-8 md:p-12 rounded-[24px] bg-[#f8f8f8] border border-gray-100">
                  <h3 className="text-2xl md:text-3xl font-medium text-gray-900 mb-8 flex items-center gap-3 tracking-tight">
                    <div className="w-1.5 h-6 bg-[#E32219] rounded-full"></div>
                    Key Features & Capabilities
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    {subProduct.features.map((feature, idx) => (
                      <div key={idx} className="flex gap-4 items-start group">
                        <div className="size-2 rounded-full bg-[#E32219] mt-2 shrink-0 group-hover:scale-150 transition-transform"></div>
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed font-light group-hover:text-gray-900 transition-colors">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 7. Applications Section */}
            {subProduct.applications?.length > 0 && (
              <div className="my-16">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-6 bg-[#E32219] rounded-full"></div>
                    <h2 className="text-3xl md:text-4xl font-medium text-gray-900 tracking-tight">Applications Grid</h2>
                  </div>
                  <p className="text-gray-600 font-light leading-relaxed">Proven performance across diverse sectors and use cases</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {subProduct.applications.map((app, i) => (
                    <span
                      key={i}
                      className="px-5 py-3 text-sm font-medium text-gray-700 rounded-full border border-gray-200 bg-white hover:border-[#E32219] hover:text-[#E32219] hover:shadow-md transition-all duration-300 cursor-default"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 8. Benefits - Premium Card Grid */}
            {subProduct.benefits?.length > 0 && (
              <div className="my-16 md:my-24">
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-6 bg-[#E32219] rounded-full"></div>
                    <h2 className="text-3xl md:text-4xl font-medium text-gray-900 tracking-tight">Key Advantages (Benefits)</h2>
                  </div>
                  <p className="text-gray-600 font-light leading-relaxed">Key advantages and value propositions that set this product apart</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {subProduct.benefits.map((benefit, i) => (
                    <div 
                      key={i}
                      className="group relative p-8 md:p-10 bg-white rounded-[40px] border border-gray-100 shadow-sm transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-4"
                    >
                      {/* Hover Red Accent */}
                      <div className="absolute inset-x-10 bottom-0 h-1 bg-[#E32219] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 rounded-full"></div>

                      <div className="flex items-center justify-between mb-8">
                         <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-[#E32219] group-hover:bg-[#E32219] group-hover:text-white transition-all duration-500">
                            <Award size={24} />
                         </div>
                         <div className="text-right">
                            <span className="text-[10px] font-black text-gray-300 block tracking-widest uppercase">Benefit_{String(i + 1).padStart(2, '0')}</span>
                         </div>
                      </div>

                      <p className="text-base md:text-lg text-gray-700 font-light leading-relaxed group-hover:text-gray-900 transition-colors">
                        {benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. Detailed Analysis */}
            {subProduct.fullDescription && (
              <div className="my-16">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-6 bg-[#E32219] rounded-full"></div>
                    <h2 className="text-3xl md:text-4xl font-medium text-gray-900 tracking-tight">Detailed Analysis</h2>
                  </div>
                </div>
                
                <div 
                  className="prose prose-lg md:prose-xl prose-gray max-w-none
                           prose-headings:text-gray-900 prose-headings:font-medium prose-headings:tracking-tight
                           prose-p:text-gray-700 prose-p:leading-[1.75] prose-p:mb-6 prose-p:font-light
                           prose-strong:text-gray-950 prose-strong:font-medium
                           prose-a:text-[#E32219] prose-a:no-underline hover:prose-a:underline
                           prose-img:rounded-3xl prose-img:my-6"
                  dangerouslySetInnerHTML={{ __html: subProduct.fullDescription }}
                />
              </div>
            )}

            {/* 10. FAQs Section - Elegant Accordion */}
            {subProduct.faqs?.length > 0 && (
              <div className="my-16 md:my-24">
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-6 bg-[#E32219] rounded-full"></div>
                    <h2 className="text-3xl md:text-4xl font-medium text-gray-900 tracking-tight">Product Specific FAQs</h2>
                  </div>
                  <p className="text-gray-600 font-light leading-relaxed">Common questions and detailed answers about this product</p>
                </div>
                
                <div className="max-w-4xl mx-auto space-y-0 border-t border-gray-100">
                  {subProduct.faqs.map((faq, i) => (
                    <div key={i} className="faq-item border-b border-gray-100 last:border-0">
                      <button 
                        onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                        className="w-full py-10 flex items-start justify-between text-left group"
                      >
                        <div className="flex gap-8">
                          <span className={`text-xs font-black mt-2 transition-colors duration-500 ${openFaqIndex === i ? 'text-[#E32219]' : 'text-gray-300'}`}>
                            Q{String(i + 1).padStart(2, '0')}
                          </span>
                          <span className={`text-xl md:text-2xl font-light tracking-tight transition-all duration-500 ${openFaqIndex === i ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
                            {faq.question}
                          </span>
                        </div>
                        <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 ${openFaqIndex === i ? 'bg-[#E32219] rotate-45 shadow-[0_0_15px_rgba(227,34,25,0.4)]' : 'bg-gray-50'}`}>
                          <Plus className={`w-5 h-5 transition-colors ${openFaqIndex === i ? 'text-white' : 'text-gray-400'}`} />
                        </div>
                      </button>
                      <div className={`overflow-hidden transition-all duration-700 ease-in-out ${openFaqIndex === i ? 'max-h-[800px] pb-10' : 'max-h-0'}`}>
                        <div className="flex gap-8">
                          <div className="w-[1px] ml-4 bg-gradient-to-b from-[#E32219] to-transparent"></div>
                          <p className="text-gray-500 text-lg font-light leading-relaxed max-w-3xl ml-4">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 11. CTA Section */}
            <div className="mt-16 pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 fade-in">
              <div>
                <h3 className="text-2xl md:text-3xl font-medium text-gray-900 mb-2 tracking-tight">Ready to Order?</h3>
                <p className="text-gray-600 font-light">Get a custom quote tailored to your requirements</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="group relative px-10 py-5 bg-[#050505] text-white rounded-full overflow-hidden transition-all duration-500 active:scale-95"
              >
                <span className="relative z-10 text-[11px] font-bold uppercase tracking-[0.25em] flex items-center gap-3">
                  Request Quote
                  <ArrowRight className="w-4 h-4" />
                </span>
                <div className="absolute inset-0 bg-[#E32219] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </button>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}