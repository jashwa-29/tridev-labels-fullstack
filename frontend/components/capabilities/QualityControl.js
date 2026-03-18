"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldAlert, Microscope, FlaskConical, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const tests = [
  {
    icon: <Microscope className="w-12 h-12 text-[#E32219]" />,
    title: "Optical Inspection",
    desc: "100% web inspection using AVT Helios systems to catch print defects down to 0.1mm."
  },
  {
    icon: <FlaskConical className="w-12 h-12 text-[#E32219]" />,
    title: "Chemical Resistance",
    desc: "Solvent rub tests and immersion limit testing for labels exposed to harsh industrial fluids."
  },
  {
    icon: <ShieldAlert className="w-12 h-12 text-[#E32219]" />,
    title: "Adhesion Testing",
    desc: "FINAT standard peel adhesion tests to guarantee labels stay applied to your specific container material."
  },
  {
    icon: <Award className="w-12 h-12 text-[#E32219]" />,
    title: "ISO 9001:2015",
    desc: "Our quality management system is certified and audited annually to maintain global compliance."
  }
];

export default function QualityControl() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".qc-card", 
        { y: 50, opacity: 0, autoAlpha: 0 },
        { 
            y: 0, opacity: 1, autoAlpha: 1, duration: 0.8, stagger: 0.2, ease: "power3.out",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%"
            }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50 skew-x-12 transform translate-x-20 z-0"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">
            
            <div className="lg:w-1/3">
                <span className="text-[#E32219] font-bold tracking-widest uppercase text-xs mb-4 block">Quality Assurance</span>
                <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight">
                    Zero <br/> <span className="font-bold">Defect.</span>
                </h2>
                <div className="w-20 h-1 bg-[#E32219] mb-8"></div>
                <p className="text-gray-500 font-light text-xl leading-relaxed">
                    Our commitment to quality goes beyond visual appeal. We subject our labels to a battery of stress tests to ensure they perform in the real world—from freezer shelves to industrial warehouses.
                </p>
            </div>

            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                {tests.map((test, idx) => (
                    <div key={idx} className="qc-card p-8 bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="mb-6 bg-red-50 w-20 h-20 rounded-2xl flex items-center justify-center">
                            {test.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{test.title}</h3>
                        <p className="text-gray-500 font-light leading-relaxed text-sm">
                            {test.desc}
                        </p>
                    </div>
                ))}
            </div>

        </div>
      </div>
    </section>
  );
}
