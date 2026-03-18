"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leaf, Recycle, Factory } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function SustainabilityStats() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.fromTo(".stat-item",
            { y: 30, opacity: 0, autoAlpha: 0 },
            { 
                y: 0, opacity: 1, autoAlpha: 1, duration: 1, stagger: 0.2, ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%"
                }
            }
        );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-[#0a2e1d] text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <span className="text-[#4ade80] font-bold tracking-widest uppercase text-xs mb-4 block">Responsibility</span>
        <h2 className="text-4xl md:text-6xl font-light mb-16">
            Sustainable <span className="font-bold">Innovation.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            <div className="stat-item flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border border-[#4ade80]/30 flex items-center justify-center mb-6 bg-[#4ade80]/10">
                    <Leaf className="w-10 h-10 text-[#4ade80]" />
                </div>
                <div className="text-5xl font-bold mb-2">40%</div>
                <div className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Reduced Waste</div>
                <p className="text-gray-300 font-light text-sm max-w-xs">
                    Through advanced nesting algorithms and digital setup processes, we've cut material waste by nearly half.
                </p>
            </div>

            <div className="stat-item flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border border-[#4ade80]/30 flex items-center justify-center mb-6 bg-[#4ade80]/10">
                    <Recycle className="w-10 h-10 text-[#4ade80]" />
                </div>
                <div className="text-5xl font-bold mb-2">100%</div>
                <div className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Recyclable Liners</div>
                <p className="text-gray-300 font-light text-sm max-w-xs">
                    We offer PET liner recycling programs, turning release liners into new raw materials instead of landfill.
                </p>
            </div>

            <div className="stat-item flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border border-[#4ade80]/30 flex items-center justify-center mb-6 bg-[#4ade80]/10">
                    <Factory className="w-10 h-10 text-[#4ade80]" />
                </div>
                <div className="text-5xl font-bold mb-2">Zero</div>
                <div className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Solvent Emissions</div>
                <p className="text-gray-300 font-light text-sm max-w-xs">
                    Our transition to UV LED curing and water-based inks has completely eliminated VOC emissions from our press room.
                </p>
            </div>

        </div>
      </div>
    </section>
  );
}
