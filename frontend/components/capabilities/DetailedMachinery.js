"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const machines = [
  {
    id: "mark-andy",
    name: "Mark Andy P-Series",
    category: "Flexographic Powerhouse",
    specs: [
      "13-inch web width",
      "8-color UV printing",
      "Inline rotary screen",
      "Cold foil application"
    ],
    description: "The backbone of our high-volume production. This servo-driven press delivers unmatched registration accuracy and speed, perfect for long runs of prime labels with complex embellishments.",
    image: "https://images.unsplash.com/photo-1565514158740-064f34bd6cfd?auto=format&fit=crop&q=80&w=1200" 
  },
  {
    id: "hp-indigo",
    name: "HP Indigo 6K",
    category: "Digital Excellence",
    specs: [
      "Up to 7 colors",
      "One-Shot Color technology",
      "Variable Data Printing",
      "Micro-text security"
    ],
    description: "Setting the standard for digital label printing. The HP Indigo allows for mosaic hyper-customization, prototyping, and short-run efficiency with offset-matching quality.",
    image: "https://images.unsplash.com/photo-1598520106830-8c45c2035460?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: "rotoflex",
    name: "Rotoflex VSI",
    category: "Finishing Precision",
    specs: [
      "100% Defect Detection",
      "High-speed slitting",
      "Automated tension control",
      "Missing label detection"
    ],
    description: "Quality assurance isn't just a step; it's a guarantee. Our finishing lines inspect every millimeter of your roll, removing any imperfections before shipping.",
    image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=1200"
  }
];

export default function DetailedMachinery() {
  const sectionRef = useRef(null);
  const [activeMachine, setActiveMachine] = useState(0);

  useEffect(() => {
    // Animate content change
    const ctx = gsap.context(() => {
      gsap.fromTo(".machine-content", 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [activeMachine]);

  return (
    <section ref={sectionRef} className="py-24 bg-[#050505] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
            <span className="text-[#E32219] font-bold tracking-widest uppercase text-xs mb-4 block">Technical Blueprint</span>
            <h2 className="text-4xl md:text-5xl font-light">Machine <span className="font-bold">Specs.</span></h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
            {/* Navigation / List */}
            <div className="lg:w-1/3 flex flex-col gap-4">
                {machines.map((machine, idx) => (
                    <button 
                        key={machine.id}
                        onClick={() => setActiveMachine(idx)}
                        className={`text-left p-6 rounded-2xl border transition-all duration-300 group ${
                            activeMachine === idx 
                            ? 'bg-[#E32219] border-[#E32219] text-white' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-400'
                        }`}
                    >
                        <span className={`text-xs font-bold uppercase tracking-widest block mb-2 ${activeMachine === idx ? 'text-white/80' : 'text-gray-500'}`}>
                            {machine.category}
                        </span>
                        <h3 className={`text-xl font-bold ${activeMachine === idx ? 'text-white' : 'text-white group-hover:text-white'}`}>
                            {machine.name}
                        </h3>
                    </button>
                ))}
            </div>

            {/* Content Display */}
            <div className="lg:w-2/3 machine-content">
                <div className="relative aspect-video rounded-3xl overflow-hidden mb-8 border border-white/10">
                    <Image 
                        src={machines[activeMachine].image}
                        alt={machines[activeMachine].name}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-3xl font-light mb-4 text-white">
                            {machines[activeMachine].name}
                        </h3>
                        <p className="text-gray-400 leading-relaxed font-light">
                            {machines[activeMachine].description}
                        </p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-[#E32219] mb-4">Specifications</h4>
                        <ul className="space-y-3">
                            {machines[activeMachine].specs.map((spec, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                    <Check className="w-4 h-4 text-[#E32219]" />
                                    {spec}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
