"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CapabilitiesHero() {
  const heroRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power4.out", delay: 0.5 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image/Video Placeholder */}
      <div className="absolute inset-0 z-0 opacity-40">
         <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000')` }}
         ></div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>

      <div className="container mx-auto px-4 relative z-20 text-center text-white" ref={textRef}>
        <div className="inline-block mb-4 px-4 py-1 border border-[#E32219] rounded-full backdrop-blur-md bg-black/30">
          <span className="text-[#E32219] text-xs md:text-sm font-bold tracking-[0.2em] uppercase">
            Excellence in Motion
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter mb-6">
          Our <span className="font-bold text-white">Capabilities</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 font-light leading-relaxed">
          Merging artisan craftsmanship with industrial power to deliver label solutions that define brands.
        </p>
      </div>
    </section>
  );
}
