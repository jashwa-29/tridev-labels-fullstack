"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Layers, Box, Cpu, CheckCircle2, ChevronDown, Info, Plus } from 'lucide-react';
import QuoteModal from '@/components/common/QuoteModal';
import FooterSection from '@/components/layout/FooterSection';
import PageHeader from '@/components/common/PageHeader';
import Image from 'next/image';
import { getImgUrl } from '@/utils/image-url';

gsap.registerPlugin(ScrollTrigger);

const FAQItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-10 flex items-start justify-between text-left group"
      >
        <div className="flex gap-8">
          <span className={`text-xs font-black mt-2 transition-colors duration-500 ${isOpen ? 'text-[#E32219]' : 'text-gray-300'}`}>
            Q{String(faq.index + 1).padStart(2, '0')}
          </span>
          <span className={`text-xl md:text-2xl font-light tracking-tight transition-all duration-500 ${isOpen ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>
            {faq.question}
          </span>
        </div>
        <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 ${isOpen ? 'bg-[#E32219] rotate-45 shadow-[0_0_15px_rgba(227,34,25,0.4)]' : 'bg-gray-50'}`}>
          <Plus className={`w-5 h-5 transition-colors ${isOpen ? 'text-white' : 'text-gray-400'}`} />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isOpen ? 'max-h-[800px] pb-10' : 'max-h-0'}`}>
        <div className="flex gap-8">
          <div className="w-[1px] ml-4 bg-linear-to-b from-[#E32219] to-transparent"></div>
          <p className="text-gray-500 text-lg font-light leading-relaxed max-w-3xl ml-4">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function ServiceContent({ service }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef(null);

  // Entrance Animations
  useEffect(() => {
    if (!service) return;

    const ctx = gsap.context(() => {
      // Robust Entrance Sequence
      const animations = [
        { selector: ".overview-item", trigger: "#dna" },
        { selector: ".feature-card", trigger: ".features-grid" },
        { selector: ".spec-row", trigger: ".specs-table" },
        { selector: ".rich-section", trigger: ".rich-content-area" },
        { selector: ".faq-item", trigger: ".faq-section" },
        { selector: ".cta-reveal", trigger: ".cta-section" },
        { selector: ".section-header-reveal", trigger: ".section-header-reveal" }
      ];

      animations.forEach(anim => {
        gsap.fromTo(anim.selector, 
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: anim.trigger,
              start: "top 95%", // Trigger earlier
              toggleActions: "play none none none"
            },
            clearProps: "all"
          }
        );
      });

      // Special animation for mosaic images (matching AboutUs)
      gsap.fromTo(".parallax-img",
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: "#dna",
            start: "top 80%"
          },
          clearProps: "all"
        }
      );

      // Trust Section Stagger
      gsap.fromTo(".trust-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".trust-section",
            start: "top 85%"
          },
          clearProps: "all"
        }
      );

      ScrollTrigger.refresh();
    }, containerRef);
    
    return () => ctx.revert();
  }, [service]);

  if (!service) return null;

  return (
    <div ref={containerRef} className="min-h-screen bg-white">
      <QuoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        serviceTitle={service.title}
      />

      {/* 1. Standardized Hero Header */}
      <PageHeader 
        title={service.title}
        subtitle={service.subtitle}
        breadcrumb="Services"
        description={service.description}
      />

      {/* 2. Institutional Overview - Adaptive Section */}
      {(!service.layout || service.layout.showIntro !== false) && (service.description || service.subtitle) && (
        <section id="dna" className="py-16 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E32219]/5 rounded-full blur-[120px] -mr-64 -mt-32"></div>

          
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16">
              
              {/* Left: Enhanced Narrative Content */}
              <div className="lg:col-span-5 space-y-8 md:space-y-10 overview-item">
                <div className="space-y-4 md:space-y-6">
                  {/* Status & Category Badge */}
                  <div className="flex flex-wrap gap-3 md:gap-4 items-center">

                    {service.category && (
                      <div className="px-3 md:px-4 py-1.5 md:py-2 bg-red-50 border border-red-100 rounded-full">
                         <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#E32219]">{service.category}</span>
                      </div>
                    )}
                  </div>

                  <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 leading-[1.1] tracking-tighter">
                    Fundamental <br />
                    <span className="text-[#E32219] font-normal italic">Details.</span>
                  </h2>
                </div>
                
                <div className="space-y-6 md:space-y-8">
                  <p className="text-gray-600 text-base md:text-lg lg:text-xl font-light leading-relaxed max-w-xl italic border-l-4 border-[#E32219]/20 pl-4 md:pl-6">
                    "{service.subtitle}"
                  </p>
                  <p className="text-gray-500 text-base md:text-lg font-light leading-relaxed max-w-2xl">
                    {service.description}
                  </p>

                  {/* Dynamic Tags */}
                  {service.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 md:gap-3 pt-3 md:pt-4">
                      {service.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-wider before:content-['#'] before:text-[#E32219]/50 before:mr-px">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                {/* Enhanced Statistics - Only if data looks serious */}
                <div className="grid grid-cols-2 gap-4 md:gap-6 pt-4">
                  <div className="group relative bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#E32219]/20 transition-all duration-500">
                    <div className="absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-[#E32219]/5 rounded-full blur-2xl group-hover:bg-[#E32219]/10 transition-all duration-500"></div>
                    <div className="relative z-10">
                      <div className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 tracking-tighter mb-1 md:mb-2 group-hover:text-[#E32219] transition-colors duration-300">100%</div>
                      <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] text-gray-400 mb-2 md:mb-3">Quality Assurance</div>
                    </div>
                  </div>
                  
                  <div className="group relative bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#E32219]/20 transition-all duration-500">
                    <div className="absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-gray-900/5 rounded-full blur-2xl group-hover:bg-gray-900/10 transition-all duration-500"></div>
                    <div className="relative z-10">
                      <div className="text-xl md:text-2xl lg:text-3xl font-light text-gray-900 tracking-tighter mb-1 md:mb-2 group-hover:text-[#E32219] transition-colors duration-300">ISO Certified</div>
                    </div>
                  </div>
                </div>
              </div>
              </div>

              {/* Right: Adaptive Mosaic */}
              {(!service.layout || service.layout.showShowcase !== false) && (
                <div className="lg:col-span-7 relative overview-item">
                  <div className="relative h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px]">
                    {/* Main Image - Fully Dynamic */}
                    <div className={`absolute top-0 right-0 rounded-2xl md:rounded-[40px] overflow-hidden shadow-xl md:shadow-2xl z-20 group ${service.subProducts?.length > 0 ? 'w-full md:w-[75%] h-full md:h-[70%]' : 'w-full h-full'}`}>
                      <Image 
                        src={getImgUrl(service.heroImage) || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"} 
                        alt="Fundamental Details" 
                        fill
                        priority
                        unoptimized={true}
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    </div>

                    {/* Secondary Image - Top Left (Static for Elite Aesthetic) */}
                    <div className="hidden md:block absolute top-[15%] left-[5%] w-[35%] h-[30%] rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-xl z-30 group border-2 md:border-4 border-white">
                      <Image 
                        src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80" 
                        alt="Fundamental Details - Technical Insight"
                        fill
                        unoptimized={true}
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-br from-[#E32219]/20 to-transparent"></div>
                    </div>

                    {/* Accent Image - Bottom Left (Static for Consistency) */}
                    <div className="hidden md:block absolute bottom-0 left-0 w-[55%] h-[45%] rounded-2xl md:rounded-[40px] overflow-hidden shadow-lg md:shadow-2xl z-10 group border-2 md:border-4 border-white">
                      <Image 
                        src="https://images.unsplash.com/photo-1565034946487-077786996e27?auto=format&fit=crop&q=80" 
                        alt="Fundamental Details - Industry standard"
                        fill
                        unoptimized={true}
                        className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}


      {/* 3. Sub-Products Portfolio - Modular Showcase */}
      {(!service.layout || service.layout.showSolutions !== false) && service.subProducts?.length > 0 && (
        <section className="pb-16 md:pb-24 lg:pb-32 xl:pb-40 relative overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
               style={{
                 backgroundImage: `linear-gradient(45deg, #000 1px, transparent 1px),
                                   linear-gradient(-45deg, #000 1px, transparent 1px)`,
                 backgroundSize: '40px 40px'
               }} 
          />
          
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            
            {/* Section Header */}
            <div className="section-header-reveal text-center max-w-5xl mx-auto mb-16 md:mb-20">
              <div className="flex items-center justify-center mb-8 md:mb-10">
                <div className="h-px w-12 md:w-16 bg-linear-to-r from-transparent via-gray-300 to-transparent"></div>
                <div className="mx-4 md:mx-5 text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] md:tracking-[0.4em] text-gray-500 whitespace-nowrap">
                  Our Product Range
                </div>
                <div className="h-px w-12 md:w-16 bg-linear-to-l from-transparent via-gray-300 to-transparent"></div>
              </div>

              <div className="relative mb-8 md:mb-10 flex flex-col items-center">
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 tracking-tight leading-tight md:leading-[0.95] text-center">
                  <span className="font-normal relative block md:inline mt-2 md:mt-0">
                    <span className="text-[#E32219]">Solutions Portfolio</span>
                  </span>
                </h2>
              </div>
            </div>

            {/* Detailed Product Cards */}
            <div className="space-y-12 md:space-y-16 features-grid max-w-7xl mx-auto">
              {service.subProducts.map((item, i) => (
                <div 
                  key={i} 
                  className={`feature-card group grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center bg-white rounded-[40px] p-8 md:p-12 shadow-lg hover:shadow-2xl transition-all duration-700 border border-gray-100`}
                >
                  {/* Image Section */}
                  <div className={`${i % 2 === 0 ? 'lg:col-span-2' : 'lg:col-span-2 lg:order-2'} relative`}>
                    <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-xl relative">
                      <Image 
                        src={getImgUrl(item.image) || "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80"} 
                        alt={item.title}
                        fill
                        unoptimized={true}
                        className="object-cover grayscale brightness-90 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                      />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className={`${i % 2 === 0 ? 'lg:col-span-3' : 'lg:col-span-3 lg:order-1'} space-y-6`}>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#E32219]">Product {String(i + 1).padStart(2, '0')}</span>
                        <div className="h-px flex-1 bg-linear-to-r from-[#E32219]/30 to-transparent"></div>
                      </div>
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 tracking-tight leading-tight">{item.title}</h3>
                    </div>
                    <p className="text-gray-600 font-light leading-relaxed text-lg">{item.desc}</p>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 border-b-2 border-[#E32219] pb-2 hover:text-[#E32219] transition-all duration-300"
                    >
                      Request Technical Quote
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* 4. Technical Specifications & Applications - Merged Modular Section */}
      {((!service.layout || service.layout.showSpecs !== false) && service.specs?.length > 0) || 
       ((!service.layout || service.layout.showApplications !== false) && service.applications?.length > 0) ? (
        <section className="relative pb-16 md:pb-24 lg:pb-32 xl:pb-40 overflow-hidden">
  

          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              
              <div className="section-header-reveal lg:col-span-12 mb-12">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-px bg-[#E32219]"></div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Technical Datasheet</span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tighter">
                    Performance <span className="text-[#E32219] font-medium">Specs.</span>
                  </h3>
              </div>

              {/* Specs Table */}
              {(!service.layout || service.layout.showSpecs !== false) && service.specs?.length > 0 && (
                <div className="lg:col-span-8 specs-table">
                  <div className="bg-white/50 backdrop-blur-md rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                    {service.specs.map((spec, i) => (
                      <div key={i} className="spec-row flex justify-between items-center py-8 border-b border-gray-100 last:border-0 hover:bg-white/80 px-8 transition-all duration-500">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">{spec.label}</span>
                        <span className="text-xl md:text-2xl font-light text-gray-900 tracking-tight">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Applications Sidebar */}
              {(!service.layout || service.layout.showApplications !== false) && service.applications?.length > 0 && (
                <div className={(!service.layout || service.layout.showSpecs !== false) && service.specs?.length > 0 ? "lg:col-span-4 sticky top-32" : "lg:col-span-12"}>
                  <div className="bg-[#050505] p-12 rounded-[40px] text-white space-y-10 shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-[#E32219]/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#E32219]/20 transition-all duration-700"></div>
                     
                     <h4 className="text-xl font-bold uppercase tracking-widest text-[#E32219] relative z-10">Key Applications</h4>
                     <div className={`relative z-10 ${(!service.layout || service.layout.showSpecs !== false) && service.specs?.length > 0 ? 'space-y-5' : 'grid grid-cols-2 md:grid-cols-4 gap-6 space-y-0'}`}>
                       {service.applications.map((app, i) => (
                         <div key={i} className="flex items-center gap-5 text-gray-300 font-light hover:text-white transition-colors cursor-default">
                            <div className="w-2 h-2 rounded-full bg-[#E32219] shadow-[0_0_8px_#E32219]"></div>
                            <span className="text-lg tracking-tight">{app}</span>
                         </div>
                       ))}
                     </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* NEW: 4.5 Quality Standards - Immersive Parallax Section */}
      <section 
        className="relative py-32 md:py-40   mb-16 md:mb-24 lg:mb-32 xl:mb-40 trust-section overflow-hidden"
        style={{
          backgroundImage: 'url("https://peppy-moonbeam-9fe49c.netlify.app/images/background-img-1.jpeg")',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark Overlay with Blur */}
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-0"></div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-[#E32219]"></div>
              <span className="text-sm font-medium uppercase tracking-[0.3em] text-gray-300">
                Manufacturing Excellence
              </span>
              <div className="h-px w-8 bg-[#E32219]"></div>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tighter">
              Quality <span className="font-medium text-[#E32219]">Standards.</span>
            </h2>
            <p className="text-gray-300 font-light text-lg leading-relaxed">
              We adhere to global certifications and rigorous internal audits to ensure every label that leaves our facility meets international safety and durability benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "ISO 9001:2015", 
                desc: "Certified Quality Management System ensuring consistent high-grade output.",
                icon: <ShieldCheck className="w-10 h-10" />
              },
              { 
                title: "Zero-Defect Policy", 
                desc: "Vision-inspected printing lines for 100% accuracy in serialization and data.",
                icon: <Cpu className="w-10 h-10" />
              },
              { 
                title: "Global Compliance", 
                desc: "Materials compliant with FDA, UL, and RoHS environmental standards.",
                icon: <Layers className="w-10 h-10" />
              }
            ].map((trust, idx) => (
              <div key={idx} className="trust-item bg-white/10 backdrop-blur-md p-10 rounded-[40px] border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-500 group">
                <div className="w-16 h-16 rounded-2xl bg-[#E32219]/20 text-[#E32219] flex items-center justify-center mb-8 group-hover:bg-[#E32219] group-hover:text-white transition-all duration-300">
                  {trust.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-4">{trust.title}</h4>
                <p className="text-gray-300 font-light leading-relaxed">{trust.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 4.8 Dynamic Rich Content Sections (Cinematic Feature Hub) */}
      {(!service.layout || service.layout.showRichContent !== false) && service.sections?.length > 0 && (
        <section className="rich-content-area">
          {service.sections.map((section, idx) => (
            <section key={idx} className={`relative pb-16 md:pb-24 lg:pb-32 xl:pb-40 overflow-hidden ${idx % 2 === 0 ? 'bg-white' : 'bg-white'}`}>
              {/* Background Geometric Identifier */}
              <div className={`absolute top-1/2 -translate-y-1/2 ${idx % 2 === 0 ? '-left-20' : '-right-20'} opacity-[0.03] select-none pointer-events-none`}>
                <span className="text-[30rem] font-black leading-none tracking-tighter">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                  
                  {/* Visual Side: Dynamic Image Monolith */}
                  <div className={`relative aspect-square md:aspect-4/5 group ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                    <div className="absolute inset-0 bg-[#E32219]/5 rounded-[60px] blur-3xl group-hover:bg-[#E32219]/10 transition-all duration-700"></div>
                    <div className="relative h-full w-full rounded-[60px] overflow-hidden shadow-2xl border-8 border-white">
                      <Image 
                        src={getImgUrl(section.image) || (idx % 2 === 0 
                          ? "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
                          : "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80"
                        )}
                        alt={section.imageAlt || section.heading}
                        fill
                        unoptimized={true}
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-tr from-black/40 via-transparent to-transparent"></div>
                      
                      {/* Corner Accent Label */}
                      <div className="absolute bottom-10 left-10 p-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 max-w-[200px]">
                         <div className="w-8 h-[2px] bg-[#E32219] mb-4"></div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Infrastructure Analysis</p>
                         <p className="text-xs font-bold text-gray-900 mt-1">Verified Protocol 01/{String(idx + 1).padStart(2, '0')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content Side: The Technical Plate */}
                  <div className="space-y-10">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E32219]">Strategic Briefing</span>
                        <div className="h-px w-20 bg-linear-to-r from-[#E32219] to-transparent"></div>
                      </div>
                      <h3 className="text-4xl md:text-5xl lg:text-7xl font-light text-gray-900 tracking-tighter leading-[1.1]">
                        {section.heading}
                      </h3>
                    </div>

                    <div 
                      className="prose prose-xl prose-gray max-w-none font-light leading-relaxed text-gray-600
                                 prose-headings:text-gray-900 prose-headings:font-light prose-headings:tracking-tight
                                 prose-strong:text-gray-900 prose-strong:font-bold prose-strong:bg-red-50 prose-strong:px-1
                                 prose-a:text-[#E32219] prose-a:font-bold
                                 prose-ul:list-none prose-ul:pl-0 prose-li:relative prose-li:pl-8 
                                 prose-li:before:content-[''] prose-li:before:absolute prose-li:before:left-0 prose-li:before:top-4 
                                 prose-li:before:w-2 prose-li:before:h-2 prose-li:before:bg-[#E32219] prose-li:before:rounded-full"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />

                    <div className="pt-8 border-t border-gray-100">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                           <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Technical Data Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Info className="w-4 h-4 text-gray-300" />
                           <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Verified standards</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          ))}
        </section>
      )}

      {/* 4.9 Frequently Asked Questions (Institutional Black) */}
      {(!service.layout || service.layout.showFAQs !== false) && service.faqs?.length > 0 && (
        <section className="py-16 md:py-24 lg:py-48 bg-[#050505] faq-section relative overflow-hidden">
          {/* Subtle Red Atmosphere */}
          <div className="absolute top-0 right-0 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-[#E32219]/5 rounded-full blur-[100px] md:blur-[150px] -mr-48 md:-mr-96 -mt-48 md:-mt-96"></div>
          
          <div className="container mx-auto px-6 md:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-24 items-start">
              
              <div className="lg:col-span-4 lg:sticky lg:top-40 space-y-8 md:space-y-12 order-1">
                <div className="space-y-6 md:space-y-8">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 md:w-12 h-[2px] bg-[#E32219]"></div>
                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-[#E32219]">Concierge Desk</span>
                  </div>
                  <h3 className="text-3xl md:text-5xl lg:text-6xl font-light text-white tracking-tighter leading-tight lg:leading-none">
                    Institutional <br /> <span className="text-gray-500 italic">Clarifications.</span>
                  </h3>
                </div>

                <div className="p-6 md:p-10 bg-white/5 backdrop-blur-3xl rounded-2xl md:rounded-[40px] border border-white/10 space-y-4 md:space-y-6">
                   <p className="text-gray-400 font-light leading-relaxed text-sm md:text-lg">
                      Our engineering team is standing by to provide bespoke technical assessments for your specific labeling infrastructure.
                   </p>
                   <button 
                     onClick={() => setIsModalOpen(true)}
                     className="w-full py-4 md:py-5 bg-[#E32219] text-white text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-lg md:rounded-2xl shadow-xl shadow-[#E32219]/20 hover:scale-[1.02] transition-all duration-500"
                   >
                     Submit Briefing Request
                   </button>
                </div>
              </div>
              
              <div className="lg:col-span-8 order-2">
                <div className="bg-white rounded-2xl md:rounded-[60px] p-6 md:p-10 lg:p-20 shadow-2xl relative">
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 left-0 w-16 md:w-24 h-16 md:h-24 border-t-2 border-l-2 border-[#E32219]/20 rounded-tl-2xl md:rounded-tl-[60px]"></div>
                  
                  <div className="space-y-1 md:space-y-2">
                    {service.faqs.map((faq, idx) => (
                      <FAQItem key={idx} faq={{ ...faq, index: idx }} />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 4.8 Extra Content - Custom Flexible Blocks */}
      {service.extraContent?.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 md:px-12">
            {service.extraContent.map((block, i) => (
              <div key={i} className="mb-16 last:mb-0">
                {block.title && <h3 className="text-3xl font-light mb-6 text-gray-900">{block.title}</h3>}
                <div 
                  className="text-gray-600 text-lg font-light leading-relaxed prose prose-red max-w-none"
                  dangerouslySetInnerHTML={{ __html: block.html || block.text }}
                />
              </div>
            ))}
          </div>
        </section>
      )}


      {/* 5. Clean Conversion Hub */}
      <section className="py-20 md:py-32 bg-gray-50 flex justify-center items-center cta-section">
        <div className="container mx-auto px-6 text-center max-w-4xl space-y-10 cta-reveal">
          <div className="inline-flex items-center gap-3">
             <span className="w-12 h-px bg-[#E32219]"></span>
             <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400">Initiate Partnership</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-light text-gray-900 tracking-tighter leading-tight">
            Ready to <span className="font-medium text-[#E32219]">Transform</span> Your <br className="hidden md:block" /> Product Packaging?
          </h2>

          <p className="text-gray-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Partner with Trridev Labels for high-precision labeling solutions. From initial design to global industrial delivery, we have you covered with ISO-certified excellence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="relative px-10 sm:px-12 py-5 bg-gray-900 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] rounded-sm group overflow-hidden shadow-xl transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-4">
                Get Technical Quote
                <svg className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </span>
              <div className="absolute inset-0 bg-[#E32219] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
            <Link 
              href="/contact"
               className="relative px-10 sm:px-12 py-5 border border-gray-300 text-gray-900 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] rounded-sm group overflow-hidden transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-4 group-hover:text-white transition-colors duration-300">
                Consult Engineering
                <svg className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </span>
              <div className="absolute inset-0 bg-[#E32219] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>


    </div>
  );
}
