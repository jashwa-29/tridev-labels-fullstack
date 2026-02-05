"use client";

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Layers, Cpu, Recycle, Shield, Zap, Star } from 'lucide-react';
import Image from 'next/image';
import { galleryService } from '@/services/gallery.service';
import SectionLoader from '@/components/common/SectionLoader';
import PageHeader from '@/components/common/PageHeader';
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

export default function GalleryListingPage() {
  const [finishes, setFinishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const fetchFinishes = async () => {
      try {
        const response = await galleryService.getAll();
        // Standardized response handling: apiClient returns the whole body
        const items = response?.data || [];
        setFinishes(Array.isArray(items) ? items : []);
      } catch (err) {
        console.error("GalleryListingPage: API Sync failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFinishes();
  }, []);

  useEffect(() => {
    if (!loading && finishes.length > 0) {
      const ctx = gsap.context(() => {
        // Entrance animation
        gsap.from(".gallery-card-item", {
          y: 60,
          opacity: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%"
          }
        });

        // Header entrance
        if (headerRef.current) {
          gsap.from(headerRef.current.children, {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
          });
        }
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, finishes]);

  return (
    <main className="min-h-screen bg-white">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{
             backgroundImage: `linear-gradient(45deg, #000 1px, transparent 1px),
                                 linear-gradient(-45deg, #000 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }} 
      />

      <PageHeader 
        title="Gallery" 
        subtitle="Technical" 
        highlightSubtitle="Archive"
        breadcrumb="Gallery"
        description="A visual exploration of our specialized tactile finishes, industrial labels, and precision engineering highlights."
      />

      <section ref={containerRef} className="pb-32 relative z-10">
        <div className="container mx-auto px-4 md:px-12 lg:px-20 py-20">
          
          {loading ? (
            <div className="py-20">
              <SectionLoader message="Assembling Technical Portfolio..." />
            </div>
          ) : finishes.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-light text-gray-500 tracking-tight">Gallery currently unpopulated.</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {finishes.map((finish) => (
                <div key={finish._id} className="gallery-card-item group">
                  <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 mb-6 shadow-sm group-hover:shadow-xl transition-all duration-700">
                    <Image 
                      src={getImgUrl(finish.image)} 
                      alt={finish.name}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 300px"
                      className="w-full h-full object-cover grayscale brightness-95 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-1000"
                    />
                    
                    {/* Overlay Identity */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    
                    <div className="absolute bottom-6 left-6 right-6 z-10">
                      <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#E32219] mb-4 transform -translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                          {iconMap[finish.icon] || <Sparkles size={24} />}
                      </div>
                      {finish.benefit && (
                        <span className="text-[10px] font-bold text-[#E32219] uppercase tracking-widest block mb-1">{finish.benefit}</span>
                      )}
                      <h3 className="text-xl font-medium text-white tracking-tight">{finish.name}</h3>
                      <div className="mt-2 text-[9px] font-black uppercase tracking-widest text-white/40 block">
                        {finish.category}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm font-light leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {finish.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
