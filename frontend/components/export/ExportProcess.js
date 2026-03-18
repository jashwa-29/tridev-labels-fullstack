"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, FileText, CheckCircle2, PackageCheck, Zap, Cog, Shield, Activity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: "Enquiry",
    subtitle: "Inbound Logic",
    desc: "Send us quantities, colors, size, and application details via our form or email Kiruba@trridevlabelss.com.",
    icon: <Mail className="w-5 h-5" />,
    specs: ["RFI Processing", "Metadata Collection", "Validation"]
  },
  {
    title: "Quote & Approval",
    subtitle: "Commercial Sync",
    desc: "We send a competitive quote. Once approved, we request files in .cdr (Curves) or .ai (Create Online) format.",
    icon: <FileText className="w-5 h-5" />,
    specs: ["Cost Auditing", "Asset Retrieval", "Client Sign-off"]
  },
  {
    title: "Proofing",
    subtitle: "Visual Calibration",
    desc: "A .jpg or .pdf proof is sent. Upon approval, we ask for exact Pantone shades or label samples for 100% accuracy.",
    icon: <CheckCircle2 className="w-5 h-5" />,
    specs: ["Pantone Mapping", "Proofing Cycle", "Geometry Check"]
  },
  {
    title: "Production & Delivery",
    subtitle: "Final Output",
    desc: "Upon sign-off and PO, samples reach you within 12 days. Full production follows with guaranteed quality.",
    icon: <PackageCheck className="w-5 h-5" />,
    specs: ["Mark Andy Press", "Vision QC", "Global Air-Freight"]
  }
];

export default function ExportProcess() {
  const sectionRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Line drawing animation
      gsap.fromTo(".conduit-path", 
        { height: 0 },
        { 
          height: "100%", 
          ease: "none",
          scrollTrigger: {
            trigger: ".process-container",
            start: "top 20%",
            end: "bottom 80%",
            scrub: 1
          }
        }
      );

      // Card reveals
      gsap.utils.toArray(".step-schematic").forEach((step, i) => {
        gsap.fromTo(step, 
          { x: i % 2 === 0 ? -100 : 100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-48 bg-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gray-50 z-0"></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24 md:mb-40">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3 px-6 py-2 bg-[#050505] rounded-full border border-gray-800">
               <Cog className="w-4 h-4 text-[#E32219] animate-spin-slow" />
               <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">Workflow Schematic</span>
            </div>
          </div>
          <h2 className="text-5xl md:text-8xl font-light text-gray-900 tracking-tighter leading-none">
            Our Industrial <br />
            <span className="text-[#E32219] font-medium italic">Protocol.</span>
          </h2>
        </div>

        <div className="process-container relative max-w-6xl mx-auto min-h-[1000px]">
          {/* Main conduit line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[2px] h-full bg-gray-100 hidden md:block">
            <div className="conduit-path absolute top-0 left-0 w-full bg-[#E32219] shadow-[0_0_15px_rgba(227,34,25,0.5)]"></div>
          </div>

          <div className="space-y-24 md:space-y-48">
            {steps.map((step, i) => (
              <div key={i} className={`step-schematic flex flex-col md:flex-row items-center gap-12 md:gap-0 ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
                
                {/* Content Card */}
                <div className="w-full md:w-[45%] group">
                  <div className="relative p-8 md:p-12 bg-white rounded-[40px] border border-gray-100 shadow-sm transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-4">
                    
                    {/* Hover Red Accent */}
                    <div className="absolute inset-x-10 bottom-0 h-1 bg-[#E32219] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 rounded-full"></div>

                    <div className="flex items-center justify-between mb-10">
                       <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-[#E32219] group-hover:bg-[#E32219] group-hover:text-white transition-all duration-500">
                          {step.icon}
                       </div>
                       <div className="text-right">
                          <span className="text-[10px] font-black text-gray-300 block tracking-widest uppercase">Node_0{i + 1}</span>
                          <span className="text-[10px] font-bold text-[#E32219] block tracking-widest uppercase">Active_Link</span>
                       </div>
                    </div>

                    <div className="space-y-2 mb-8">
                       <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 group-hover:text-[#E32219] transition-colors">{step.subtitle}</span>
                       <h3 className="text-3xl font-light text-gray-900 tracking-tight leading-none group-hover:font-medium transition-all duration-500">{step.title}</h3>
                    </div>

                    <p className="text-gray-500 font-light leading-relaxed mb-10 tracking-wide text-sm md:text-base italic">
                      {step.desc}
                    </p>

                    <div className="flex flex-wrap gap-3 pt-8 border-t border-gray-50">
                       {step.specs.map((spec, si) => (
                         <div key={si} className="flex items-center gap-2 group/spec">
                            <Activity className="w-3 h-3 text-[#E32219]/40 group-hover/spec:text-[#E32219]" />
                            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 group-hover/spec:text-gray-900 transition-colors">{spec}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>

                {/* Center Node Visual */}
                <div className="relative w-20 h-20 md:w-32 md:h-32 flex items-center justify-center z-20">
                   <div className="w-4 h-4 rounded-full bg-white border-4 border-gray-200 group-hover:border-[#E32219] transition-colors duration-500"></div>
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-full h-full rounded-full border border-[#E32219]/20 animate-ping"></div>
                   </div>
                   {/* Connection Line Desktop Only */}
                   <div className={`hidden md:block absolute top-1/2 w-12 h-[2px] bg-gray-100 ${i % 2 === 0 ? "left-0" : "right-0"}`}></div>
                </div>

                {/* Empty Space for balancing grid */}
                <div className="hidden md:block md:w-[45%]"></div>

              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
