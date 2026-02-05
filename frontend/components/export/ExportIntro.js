"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, ShieldCheck, Zap } from 'lucide-react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function ExportIntro() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".intro-card", 
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          },
          clearProps: "all"
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 overflow-hidden bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 intro-card">
            <div className="inline-flex items-center gap-3">
              <span className="w-10 h-px bg-[#E32219]"></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">Institutional Philosophy</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tighter text-gray-900 leading-[0.9]">
              Creative Label <span className="text-[#E32219] font-medium">Solutions.</span>
            </h2>
            
            <p className="text-gray-500 text-lg font-light leading-relaxed max-w-xl">
              Modern Technology. Innovative Thinking. We understand that finding the perfect label for your product or business can be an elaborate process. Our goal is to ensure that your experience with us is as smooth and easy as possible.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-[#E32219]">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">National Reach</h3>
                  <p className="text-gray-500 text-xs mt-1">Local touch across the country.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-[#E32219]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Expert Care</h3>
                  <p className="text-gray-500 text-xs mt-1">First-hand press experience.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative intro-card">
            <div className="aspect-square rounded-[40px] overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec" 
                alt="Global Logistics" 
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-[#050505] p-10 rounded-[32px] text-white shadow-2xl hidden md:block max-w-xs">
              <Zap className="w-8 h-8 text-[#E32219] mb-4" />
              <p className="text-sm font-light leading-relaxed text-gray-300">
                Our customer service team members have printing press experience giving you first-hand knowledge on what needs to be done.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
