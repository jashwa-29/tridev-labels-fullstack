"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Plane, Award } from 'lucide-react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function GlobalReachSection() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        scale: 1.1,
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-40 overflow-hidden bg-gray-900">
      <div className="absolute inset-0 z-0 opacity-40">
        <Image 
          src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff" 
          alt="Global Logistics Background"
          fill
          loading="lazy"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-gray-900 via-gray-900/40 to-gray-900 z-10"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-20">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div className="flex justify-center">
            <div className="px-6 py-2 border border-[#E32219]/60 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] text-white bg-[#E32219]/20 backdrop-blur-md">
              Cross-Continental Logistics
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-8xl font-light tracking-tighter text-white leading-none">
            We Export <br />
            <span className="text-[#E32219] font-medium italic">Across The World.</span>
          </h2>
          
          <p className="text-gray-200 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            As the most trusted label exporter in India, we provide labelling solutions to businesses across different global markets, irrespective of the size and the industry. After all, art doesn't have boundaries!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10">
            <div className="p-10 bg-white/5 backdrop-blur-sm rounded-[32px] border border-white/10 text-left group hover:bg-[#E32219] transition-all duration-700">
               <Award className="w-10 h-10 text-[#E32219] mb-6 group-hover:text-white" />
               <h3 className="text-2xl font-bold text-white mb-4">India's Excellence</h3>
               <p className="text-gray-400 font-light text-sm leading-relaxed group-hover:text-white/90">
                 Manufacturing labels in Chennai since 2008 with full control over finished products, resulting in excellent outcomes.
               </p>
            </div>
            <div className="p-10 bg-white/5 backdrop-blur-sm rounded-[32px] border border-white/10 text-left group hover:bg-[#E32219] transition-all duration-700">
               <Plane className="w-10 h-10 text-[#E32219] mb-6 group-hover:text-white" />
               <h3 className="text-2xl font-bold text-white mb-4">Global Reach</h3>
               <p className="text-gray-400 font-light text-sm leading-relaxed group-hover:text-white/90">
                 Equipped with the new Mark Andy Press, we provide excellent service across a broad range of international requirements.
               </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
