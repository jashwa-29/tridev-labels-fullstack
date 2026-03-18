"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Layers, Maximize } from 'lucide-react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const machinery = [
  {
    name: "8-Color Mark Andy Performance Series",
    description: "High-speed flexographic press capable of multi-layer printing, cold foil, and rotary screen integration.",
    image: "https://images.unsplash.com/photo-1565514158740-064f34bd6cfd?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "HP Indigo Digital Press",
    description: "Digital offset quality for short runs, variable data printing, and rapid prototyping without plate costs.",
    image: "https://images.unsplash.com/photo-1598520106830-8c45c2035460?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Rotoflex Inspection Slitter",
    description: "100% automated defect detection system ensuring only perfect labels reach our customers.",
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800"
  }
];

const materials = [
  { name: "Metallic BoPP", type: "Film" },
  { name: "Textured Wine Papers", type: "Specialty" },
  { name: "Clear-on-Clear", type: "Film" },
  { name: "Thermal Transfer", type: "Paper" },
  { name: "Holographic Foils", type: "Foil" },
  { name: "Tamper Evident", type: "Security" },
];

export default function MachineryAndMaterials() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate Machine Cards
      gsap.fromTo(".machine-card", 
        { y: 50, opacity: 0, autoAlpha: 0 },
        { 
          y: 0, 
          opacity: 1, 
          autoAlpha: 1,
          duration: 0.8, 
          stagger: 0.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%"
          }
        }
      );

      // Animate Material Cards
      gsap.fromTo(".material-card",
        { scale: 0.9, opacity: 0, autoAlpha: 0 },
        {
          scale: 1,
          opacity: 1,
          autoAlpha: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ".materials-container",
            start: "top 85%"
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Machinery Section */}
        <div className="mb-24">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <div className="max-w-xl">
                    <span className="text-[#E32219] font-bold tracking-widest uppercase text-xs mb-2 block">Infrastructure</span>
                    <h2 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
                        Powerhouse <span className="font-medium">Technology.</span>
                    </h2>
                </div>
                <p className="max-w-md text-gray-500 font-light mt-4 md:mt-0 text-sm md:text-right">
                    We invest in the world's most advanced printing technology to deliver speed, precision, and consistency at scale.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {machinery.map((machine, idx) => (
                    <div key={idx} className="machine-card group relative rounded-3xl overflow-hidden aspect-[4/5] md:aspect-[3/4]">
                         <Image 
                            src={machine.image} 
                            alt={machine.name} 
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                         <div className="absolute bottom-8 left-8 right-8 text-white">
                            <h3 className="text-xl font-bold mb-2">{machine.name}</h3>
                            <p className="text-sm font-light text-gray-300 opacity-90">{machine.description}</p>
                         </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Materials Section */}
        <div className="materials-container bg-white rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                     <span className="text-[#E32219] font-bold tracking-widest uppercase text-xs mb-2 block">Substrates</span>
                    <h2 className="text-4xl font-light text-gray-900 mb-6">Material <span className="font-medium">Mastery.</span></h2>
                    <p className="text-gray-500 font-light text-lg mb-8 leading-relaxed">
                        The right material defines the product's feel and durability. We stock over 200 varieties of premium substrates, from textured vintages to industrial-grade films.
                    </p>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                            <Layers className="w-5 h-5 text-[#E32219]" /> Multi-Layer
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                            <Zap className="w-5 h-5 text-[#E32219]" /> Smart Labels
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                            <Maximize className="w-5 h-5 text-[#E32219]" /> Wide Format
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {materials.map((mat, idx) => (
                        <div key={idx} className="material-card p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center hover:bg-[#E32219] hover:text-white transition-colors duration-300 group cursor-default">
                            <span className="block text-xs uppercase tracking-wider opacity-50 mb-2 group-hover:text-white/70">{mat.type}</span>
                            <h4 className="font-bold text-sm md:text-base">{mat.name}</h4>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </section>
  );
}
