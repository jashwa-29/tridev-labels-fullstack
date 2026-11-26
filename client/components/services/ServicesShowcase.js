"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Box, Layers, Shield } from 'lucide-react';
import { getImgUrl, isLocalImage } from '@/utils/image-url';

gsap.registerPlugin(ScrollTrigger);

const DUMMY_SERVICES = [
  {
    _id: '1',
    title: 'Precision Micro-Labeling',
    slug: 'dummy-service-1',
    subtitle: 'Pharmaceutical Grade Accuracy',
    description: 'Our micro-labeling technology ensures uncompromised readability on the smallest vials and ampoules. We employ state-of-the-art vision systems to guarantee 100% compliance with strict pharmaceutical regulations.',
    icon: 'Box',
    featuredImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80',
    features: ['High-resolution print', 'Extreme adhesion', 'Compliance guaranteed']
  },
  {
    _id: '2',
    title: 'Industrial Durability',
    slug: 'dummy-service-2',
    subtitle: 'Built for Harsh Environments',
    description: 'Engineered to withstand extreme temperatures, chemical exposure, and abrasion. These labels are the backbone of supply chains, keeping critical information intact when it matters most.',
    icon: 'Layers',
    featuredImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80',
    features: ['Chemical resistant', 'UV protected', 'Tear-proof substrates']
  },
  {
    _id: '3',
    title: 'Premium Brand Enhancements',
    slug: 'dummy-service-3',
    subtitle: 'Foil, Emboss & Spot UV',
    description: 'Elevate your product packaging with luxurious tactile finishes. We combine cold foil, deep embossing, and high-build varnishes to create labels that command attention on any retail shelf.',
    icon: 'Shield',
    featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80',
    features: ['Cold & hot foil', 'Tactile varnishes', 'Custom die-cuts']
  }
];

export default function ServicesShowcase() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.service-card-anim');

      cards.forEach((card, index) => {
        const image = card.querySelector('.parallax-image');
        const content = card.querySelector('.content-block');
        
        // Entrance animation
        gsap.fromTo(card, 
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        );

        // Parallax image effect
        if (image) {
          gsap.to(image, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="py-24 bg-white relative overflow-hidden">
      
      {/* Background Abstract */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-linear-to-b from-gray-50 to-transparent blur-[120px]"></div>
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-linear-to-t from-gray-100 to-transparent blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 space-y-32">
        {DUMMY_SERVICES.map((service, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <div key={service._id} className="service-card-anim flex flex-col lg:flex-row items-center gap-12 lg:gap-24 group">
              
              {/* Image Block */}
              <div className={`w-full lg:w-1/2 overflow-hidden rounded-[2rem] aspect-[4/3] relative ${!isEven ? 'lg:order-2' : ''}`}>
                <div className="absolute inset-0 bg-black/10 z-10 transition-opacity duration-500 group-hover:opacity-0"></div>
                <div className="w-full h-[120%] relative -top-[10%]">
                  <Image 
                    src={service.featuredImage}
                    alt={service.title}
                    fill
                    className="object-cover parallax-image scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]"
                    unoptimized={isLocalImage(service.featuredImage)}
                  />
                </div>
              </div>

              {/* Content Block */}
              <div className={`w-full lg:w-1/2 content-block ${!isEven ? 'lg:order-1 lg:text-right' : ''}`}>
                <div className={`inline-flex items-center gap-3 mb-6 px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50/50 ${!isEven ? 'lg:ml-auto lg:flex-row-reverse' : ''}`}>
                   <span className="w-2 h-2 rounded-full bg-[#E32219]"></span>
                   <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{String(index + 1).padStart(2, '0')}</span>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 tracking-tight leading-tight mb-4">
                  {service.title.split(' ').map((word, i, arr) => (
                    <span key={i} className={i === arr.length - 1 ? "font-normal text-[#E32219]" : ""}>
                      {word}{' '}
                    </span>
                  ))}
                </h2>
                
                <h3 className="text-xl md:text-2xl text-gray-400 font-medium tracking-wide mb-8">
                  {service.subtitle}
                </h3>
                
                <p className="text-base md:text-lg text-gray-600 leading-relaxed font-light mb-10 max-w-xl">
                  {service.description}
                </p>

                <div className={`flex flex-col gap-4 mb-12 ${!isEven ? 'lg:items-end' : ''}`}>
                  {service.features.map((feature, fIndex) => (
                    <div key={fIndex} className={`flex items-center gap-3 text-sm font-medium text-gray-800 ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[#E32219]">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                <Link 
                  href={`/services/${service.slug}`}
                  className={`inline-flex items-center gap-4 group/btn ${!isEven ? 'lg:flex-row-reverse' : ''}`}
                >
                  <div className="w-14 h-14 rounded-full bg-[#E32219] text-white flex items-center justify-center transform group-hover/btn:scale-110 transition-transform duration-500 shadow-lg shadow-[#E32219]/30">
                    <ArrowRight className={`w-6 h-6 transform group-hover/btn:translate-x-1 transition-transform duration-500 ${!isEven ? 'rotate-180 group-hover/btn:-translate-x-1' : ''}`} />
                  </div>
                  <span className="text-sm uppercase tracking-widest font-bold text-gray-900 group-hover/btn:text-[#E32219] transition-colors duration-300">
                    Discover More
                  </span>
                </Link>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
