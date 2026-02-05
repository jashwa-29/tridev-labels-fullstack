"use client";

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, Layers, Cpu, Recycle, Shield, Zap, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { galleryService } from '@/services/gallery.service';
import SectionLoader from '@/components/common/SectionLoader';

import { getImgUrl } from '@/utils/image-url';

gsap.registerPlugin(ScrollTrigger);

const iconMap = {
  Sparkles: <Sparkles size={24} />,
  Layers: <Layers size={24} />,
  Cpu: <Cpu size={24} />,
  Recycle: <Recycle size={24} />,
  Shield: <Shield size={24} />,
  Zap: <Zap size={24} />,
  Star: <Star size={24} />,
};

export default function FinishesGallery() {
  const [finishes, setFinishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const fetchFinishes = async () => {
      try {
        const data = await galleryService.getAll();
        setFinishes(data.data || []);
      } catch (err) {
        console.error("Failed to fetch gallery items", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFinishes();
  }, []);

  useEffect(() => {
    if (loading || finishes.length === 0) return;

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.from(headerRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%"
        }
      });

      // Gallery stagger entrance
      gsap.from(".finish-card", {
        x: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".finish-grid",
          start: "top 85%"
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, [loading, finishes]);

  return (
    <section ref={containerRef} className=" mb-16 md:mb-24 lg:mb-32 xl:mb-40  bg-white overflow-hidden ">
      <div className="container mx-auto px-4 md:px-12">
        
        {/* Light Header */}
        <div ref={headerRef} className="max-w-4xl mx-auto text-center mb-20 md:mb-24">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#E32219]"></div>
            <span className="text-xs font-medium uppercase tracking-[0.4em] text-gray-400">
              Technical Excellence
            </span>
            <div className="h-px w-8 bg-[#E32219]"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-light text-gray-900 mb-8 tracking-tighter">
            Tactile <span className="font-medium text-[#E32219]">Precision</span> Finishing
          </h2>
          
          <p className="text-lg text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
            Elevate your brand beyond the visual. Our specialized finishes provide a multisensory 
            experience that defines quality through touch and light.
          </p>
        </div>

        {/* The Technical Grid */}
        <div className="finish-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-full">
              <SectionLoader message="Calibrating Tactile Assets..." />
            </div>
          ) : (
            finishes.slice(0, 4).map((finish) => (
              <div key={finish._id} className="finish-card group">
                <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 mb-6">
                  <Image 
                    src={getImgUrl(finish.image)} 
                    alt={finish.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 300px"
                    className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-1000"
                  />
                  
                  {/* Overlay Identity */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6 z-10">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#E32219] mb-4 transform -translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        {iconMap[finish.icon] || <Sparkles size={24} />}
                    </div>
                    {finish.benefit && (
                      <span className="text-[10px] font-bold text-[#E32219] uppercase tracking-widest block mb-1">{finish.benefit}</span>
                    )}
                    <h3 className="text-xl font-medium text-white tracking-tight">{finish.name}</h3>
                  </div>
                </div>

                <p className="text-gray-500 text-sm font-light leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {finish.description}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Action Reveal Footer */}
        {!loading && finishes.length > 4 && (
          <div className="mt-20 flex justify-center">
             <Link href="/gallery">
               <button className="relative px-8 sm:px-12 py-4 sm:py-5 bg-gray-900 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-[0.25em] rounded-sm group overflow-hidden shadow-xl transition-all duration-300">
                    <span className="relative z-10 flex items-center gap-4">
                    Explore All Finishes
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </span>
                    <div className="absolute inset-0 bg-[#E32219] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </button>
             </Link>
          </div>
        )}
      </div>
    </section>
  );
}
