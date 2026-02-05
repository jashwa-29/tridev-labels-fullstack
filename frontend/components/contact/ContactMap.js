"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Compass, ShieldCheck, Map } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ContactMap() {
  const containerRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance Animation for Map Container
      gsap.from(".map-reveal", {
        scale: 0.9,
        opacity: 0,
        duration: 2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%"
        }
      });

      // 2. Floating Animation for the Info Slab
      gsap.to(cardRef.current, {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // 3. HUD Elements subtle pulse
      gsap.to(".hud-line", {
        opacity: 1,
        duration: 1.5,
        stagger: 0.1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="pb-16 md:pb-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Map Container with Advanced Hover Mechanics */}
        <div className="map-reveal relative h-[500px] md:h-[600px] lg:h-[700px] rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 group">
          
          {/* Iframe with Cinematic grayscale filter that saturates on hover */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15551.488347895473!2d80.2443!3d12.9649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d8866165d3d%3A0xe6712edaa245e676!2sNehru%20Nagar%2C%20Kottivakkam%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'grayscale(1) contrast(1.1) brightness(0.9)' }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="group-hover:opacity-100 group-hover:filter-none transition-all duration-1000 scale-105 group-hover:scale-100"
          ></iframe>

          {/* Luxury HUD UI Overlay - Top Left */}
          <div ref={cardRef} className="absolute top-12 left-12 p-10 bg-white/95 backdrop-blur-2xl rounded-[32px] border border-white/50 shadow-2xl max-w-sm hidden md:block z-20">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-[#E32219] flex items-center justify-center text-white shadow-lg shadow-[#E32219]/20 transform group-hover:rotate-12 transition-transform duration-500">
                   <Compass className="w-6 h-6 animate-spin-slow" />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-[#E32219]">Navigation Desk</span>
                   <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Chennai Headquarters</span>
                 </div>
              </div>
              
              <h3 className="text-3xl font-light text-gray-900 tracking-tighter leading-tight">
                Benchmark of <br />
                <span className="font-medium text-[#E32219]">Industrial Scale.</span>
              </h3>
              
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                Visit our state-of-the-art facility located in the industrial heart 
                of Nehru Nagar. We operate 24/7 to service global demand.
              </p>

              <div className="pt-4 flex flex-col gap-4">
                 <a 
                   href="https://goo.gl/maps/example" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="group/btn relative inline-flex items-center justify-between py-5 px-8 bg-gray-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#E32219] transition-all duration-500 shadow-xl overflow-hidden"
                 >
                   <span className="relative z-10">Get Directions</span>
                   <ArrowUpRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                   <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                 </a>
              </div>
            </div>
          </div>

          {/* Technical HUD Metrics Overlay - Bottom Right */}
          <div className="absolute bottom-12 right-12 hidden lg:flex flex-col items-end gap-6 z-20">
             <div className="flex gap-1.5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="hud-line w-[3px] h-8 bg-white/20 rounded-full opacity-40"></div>
                ))}
             </div>
             <div className="bg-[#050505]/80 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4 text-white">
                <ShieldCheck className="w-5 h-5 text-[#E32219]" />
                <div className="text-[9px] font-bold uppercase tracking-[0.3em]">Institutional Security Enabled</div>
             </div>
          </div>

          {/* Dark Vignette Overlay for better readability of UI */}
          <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/20 to-transparent pointer-events-none"></div>
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
